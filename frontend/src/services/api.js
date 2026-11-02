import axios from 'axios';
import {
  mockInstitutions,
  mockStudents,
  mockDuplicateAlerts,
  mockComplianceViolations
} from './mockData';

// Determine if we should attempt network or have base URL
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

// In-memory / LocalStorage state for standalone frontend hosting
const STORAGE_KEY = 'apaarix_mock_db';

const loadMockStore = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // ignore
  }
  return {
    institutions: [...mockInstitutions],
    students: [...mockStudents],
    duplicates: [...mockDuplicateAlerts],
    violations: [...mockComplianceViolations]
  };
};

let store = loadMockStore();

const saveStore = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    // ignore
  }
};

// Helper to wrap mock results with standard ApiResponse format { success: true, message: '...', data: ... }
const asApiSuccess = (data, message = 'Success') => ({
  success: true,
  message,
  data
});

// Safe request wrapper that tries live backend, and falls back to mock handler on network failure
const safeRequest = async (networkFn, mockFn) => {
  try {
    const res = await networkFn();
    return res;
  } catch (err) {
    // If backend is unavailable (e.g. static Vercel/Netlify hosting), use standalone mock
    if (mockFn) {
      return mockFn();
    }
    throw err;
  }
};

// 1. Dashboard Metrics
export const getDashboardMetrics = () =>
  safeRequest(
    () => api.get('/dashboard/metrics'),
    () => {
      const totalInst = store.institutions.length;
      const totalStudents = store.students.length;
      const totalEnrolments = totalStudents * 125;
      const verified = store.students.filter(s => s.verificationStatus === 'VERIFIED').length;
      const pending = store.students.filter(s => s.verificationStatus === 'PENDING').length;
      const invalid = store.students.filter(s => s.verificationStatus === 'INVALID').length;
      const manual = store.students.filter(s => s.verificationStatus === 'MANUAL_REVIEW').length;
      const openViolations = store.violations.filter(v => v.status === 'OPEN').length;
      const duplicateAlerts = store.duplicates.filter(d => d.reviewStatus === 'PENDING').length;
      const verificationRate = totalStudents > 0 ? ((verified / totalStudents) * 100).toFixed(1) : '0';

      const statusBreakdown = [
        { name: 'Verified', value: verified, color: '#52c41a' },
        { name: 'Pending', value: pending, color: '#faad14' },
        { name: 'Invalid', value: invalid, color: '#ff4d4f' },
        { name: 'Manual Review', value: manual, color: '#13a8a8' }
      ];

      const topInstitutions = store.institutions.slice(0, 6).map((inst, idx) => ({
        id: inst.id,
        code: inst.code,
        name: inst.name,
        city: inst.city,
        state: inst.state,
        enrolmentCount: 750 + idx * 85,
        approvedIntake: inst.approvedIntake,
        utilization: Math.round(((750 + idx * 85) / inst.approvedIntake) * 1000) / 10,
        complianceScore: inst.complianceScore
      }));

      const enrolmentTrends = [
        { year: '2021-22', enrolments: 7420, verified: 5800 },
        { year: '2022-23', enrolments: 8650, verified: 7100 },
        { year: '2023-24', enrolments: 9840, verified: 8900 },
        { year: '2024-25', enrolments: 10890, verified: 10120 }
      ];

      return asApiSuccess({
        totalInstitutions: totalInst,
        totalEnrolments,
        totalStudents,
        verifiedCount: verified,
        pendingCount: pending,
        invalidCount: invalid,
        manualReviewCount: manual,
        verificationRate: Number(verificationRate),
        openViolations,
        duplicateAlerts,
        statusBreakdown,
        topInstitutions,
        enrolmentTrends
      });
    }
  );

// 2. Institutions
export const getInstitutions = (params = {}) =>
  safeRequest(
    () => api.get('/institutions', { params }),
    () => {
      let list = [...store.institutions];
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(i => i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q) || i.city.toLowerCase().includes(q));
      }
      if (params.state && params.state !== 'ALL') {
        list = list.filter(i => i.state === params.state);
      }
      return asApiSuccess(list);
    }
  );

export const getInstitutionDetail = (id) =>
  safeRequest(
    () => api.get(`/institutions/${id}`),
    () => {
      const inst = store.institutions.find(i => String(i.id) === String(id)) || store.institutions[0];
      const progList = [
        { id: 1, code: `${inst.code}-CSE`, name: 'Computer Science & Engineering', level: 'UG', approvedIntake: 180, enrolledCount: 174 },
        { id: 2, code: `${inst.code}-ECE`, name: 'Electronics & Communication Engg', level: 'UG', approvedIntake: 120, enrolledCount: 118 },
        { id: 3, code: `${inst.code}-MECH`, name: 'Mechanical Engineering', level: 'UG', approvedIntake: 120, enrolledCount: 115 },
        { id: 4, code: `${inst.code}-IT`, name: 'Information Technology', level: 'UG', approvedIntake: 120, enrolledCount: 122 }
      ];
      return asApiSuccess({
        ...inst,
        programmes: progList,
        totalEnrolled: 529,
        activeViolationsCount: 0
      });
    }
  );

export const createInstitution = (data) =>
  safeRequest(
    () => api.post('/institutions', data),
    () => {
      const newInst = {
        id: Date.now(),
        code: data.code || `AICTE-1-${Math.floor(1000 + Math.random() * 9000)}`,
        name: data.name,
        state: data.state,
        city: data.city,
        category: data.category || 'Affiliated Institution',
        approvedIntake: Number(data.approvedIntake) || 600,
        email: data.email || 'office@institution.edu',
        phone: data.phone || '+91-11-23456789',
        complianceScore: 95,
        status: 'ACTIVE'
      };
      store.institutions.unshift(newInst);
      saveStore();
      return asApiSuccess(newInst, 'Institution registered successfully');
    }
  );

// 3. Students & Registry
export const getStudents = (params = {}) =>
  safeRequest(
    () => api.get('/students', { params }),
    () => {
      let filtered = [...store.students];
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(s =>
          s.fullName.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.apaarId.toLowerCase().includes(q)
        );
      }
      if (params.institutionId) {
        filtered = filtered.filter(s => String(s.institutionId) === String(params.institutionId));
      }
      if (params.verificationStatus && params.verificationStatus !== 'ALL') {
        filtered = filtered.filter(s => s.verificationStatus === params.verificationStatus);
      }
      if (params.academicYear && params.academicYear !== 'ALL') {
        filtered = filtered.filter(s => s.academicYear === params.academicYear);
      }

      const page = Number(params.page) || 0;
      const size = Number(params.size) || 15;
      const totalElements = filtered.length;
      const totalPages = Math.ceil(totalElements / size);
      const content = filtered.slice(page * size, (page + 1) * size);

      return asApiSuccess({
        content,
        totalElements,
        totalPages,
        number: page,
        size
      });
    }
  );

export const getStudentDetail = (id) =>
  safeRequest(
    () => api.get(`/students/${id}`),
    () => {
      const stu = store.students.find(s => String(s.id) === String(id)) || store.students[0];
      return asApiSuccess(stu);
    }
  );

export const registerStudent = (data) =>
  safeRequest(
    () => api.post('/students', data),
    () => {
      const newStu = {
        id: Date.now(),
        studentId: `STU-2024-${String(store.students.length + 1).padStart(4, '0')}`,
        fullName: data.fullName,
        apaarId: data.apaarId,
        institutionId: data.institutionId || 1,
        institutionName: 'Delhi Technological University',
        institutionCode: 'AICTE-1-1001',
        programmeName: data.programmeName || 'Computer Science & Engineering',
        academicYear: data.academicYear || '2024-2025',
        admissionCategory: data.admissionCategory || 'GENERAL',
        enrolmentStatus: 'ENROLLED',
        verificationStatus: 'PENDING',
        enrolmentDate: new Date().toISOString().split('T')[0],
        email: data.email || 'student@example.ac.in',
        phone: data.phone || '+91-9876543210'
      };
      store.students.unshift(newStu);
      saveStore();
      return asApiSuccess(newStu, 'Student enrolled successfully');
    }
  );

// 4. Student Data Upload
export const downloadCsvTemplate = () => `${baseURL}/upload/template`;

export const validateUploadBatch = (data) =>
  safeRequest(
    () => api.post('/upload/validate', data),
    () => {
      const total = 25;
      const valid = 22;
      const duplicates = 2;
      const invalid = 1;
      return asApiSuccess({
        totalRecords: total,
        validRecords: valid,
        duplicateRecords: duplicates,
        invalidFormatRecords: invalid,
        previewRows: store.students.slice(0, 5),
        validationErrors: [
          { row: 14, field: 'apaarId', error: 'Invalid APAAR checksum format' },
          { row: 19, field: 'dateOfBirth', error: 'Missing mandatory date of birth' }
        ]
      }, 'Batch validation completed');
    }
  );

export const commitUploadBatch = (data) =>
  safeRequest(
    () => api.post('/upload/commit', data),
    () => {
      return asApiSuccess({
        importedCount: 22,
        batchId: `BATCH-${Date.now()}`
      }, '22 student records successfully committed to National Registry');
    }
  );

// 5. APAAR Verification
export const getVerificationSummary = () =>
  safeRequest(
    () => api.get('/verification/summary'),
    () => {
      const verified = store.students.filter(s => s.verificationStatus === 'VERIFIED').length;
      const pending = store.students.filter(s => s.verificationStatus === 'PENDING').length;
      const invalid = store.students.filter(s => s.verificationStatus === 'INVALID').length;
      const manual = store.students.filter(s => s.verificationStatus === 'MANUAL_REVIEW').length;
      const total = store.students.length;
      return asApiSuccess({
        totalCount: total,
        verifiedCount: verified,
        pendingCount: pending,
        invalidCount: invalid,
        manualReviewCount: manual,
        verificationPercentage: total > 0 ? Math.round((verified / total) * 100) : 0,
        gatewayHealth: 'ONLINE_MOCK',
        lastBatchAt: new Date().toISOString()
      });
    }
  );

export const verifySingleStudent = (studentId) =>
  safeRequest(
    () => api.post(`/verification/verify-student/${studentId}`),
    () => {
      const idx = store.students.findIndex(s => String(s.id) === String(studentId));
      if (idx !== -1) {
        store.students[idx].verificationStatus = 'VERIFIED';
        store.students[idx].verifiedAt = new Date().toISOString();
        store.students[idx].verificationSource = 'APAAR_GATEWAY_SIMULATOR';
        saveStore();
      }
      return asApiSuccess({ studentId, status: 'VERIFIED' }, 'APAAR verification succeeded');
    }
  );

export const runBatchVerification = () =>
  safeRequest(
    () => api.post('/verification/batch-verify'),
    () => {
      let newlyVerified = 0;
      store.students = store.students.map(s => {
        if (s.verificationStatus === 'PENDING') {
          newlyVerified++;
          return {
            ...s,
            verificationStatus: 'VERIFIED',
            verifiedAt: new Date().toISOString(),
            verificationSource: 'APAAR_BATCH_GATEWAY'
          };
        }
        return s;
      });
      saveStore();
      return asApiSuccess({
        processedCount: store.students.length,
        newlyVerifiedCount: newlyVerified
      }, 'Batch verification completed');
    }
  );

export const overrideVerificationStatus = (verificationId, data) =>
  safeRequest(
    () => api.post(`/verification/override/${verificationId}`, data),
    () => {
      const idx = store.students.findIndex(s => String(s.id) === String(verificationId));
      if (idx !== -1) {
        store.students[idx].verificationStatus = data.status || 'VERIFIED';
        saveStore();
      }
      return asApiSuccess({ id: verificationId, status: data.status }, 'Manual override applied');
    }
  );

// 6. Duplicate Detection
export const getDuplicateAlerts = (status) =>
  safeRequest(
    () => api.get('/duplicates', { params: { status } }),
    () => {
      let list = [...store.duplicates];
      if (status && status !== 'ALL') {
        list = list.filter(d => d.reviewStatus === status);
      }
      return asApiSuccess(list);
    }
  );

export const resolveDuplicateAlert = (id, data) =>
  safeRequest(
    () => api.post(`/duplicates/${id}/resolve`, data),
    () => {
      const idx = store.duplicates.findIndex(d => String(d.id) === String(id));
      if (idx !== -1) {
        store.duplicates[idx].reviewStatus = data.action === 'CONFIRM_DUPLICATE' ? 'CONFIRMED' : 'DISMISSED';
        saveStore();
      }
      return asApiSuccess({ id, status: 'RESOLVED' }, 'Duplicate alert resolved');
    }
  );

export const runDuplicateScan = () =>
  safeRequest(
    () => api.post('/duplicates/scan'),
    () => {
      return asApiSuccess({
        totalEnrolmentsScanned: store.students.length * 125,
        newAlertsFound: 2,
        scanDurationMs: 420
      }, 'Automated cross-institution scan complete');
    }
  );

// 7. SeatGuard Compliance Monitoring
export const getSeatGuardSummary = () =>
  safeRequest(
    () => api.get('/compliance/summary'),
    () => {
      const open = store.violations.filter(v => v.status === 'OPEN').length;
      return asApiSuccess({
        totalInstitutionsMonitored: store.institutions.length,
        compliantInstitutionsCount: store.institutions.length - open,
        activeViolationsCount: open,
        averageComplianceScore: 93.8,
        intakeOverflowCount: 1,
        quotaBreachCount: 2
      });
    }
  );

export const getComplianceViolations = (status) =>
  safeRequest(
    () => api.get('/compliance/violations', { params: { status } }),
    () => {
      let list = [...store.violations];
      if (status && status !== 'ALL') {
        list = list.filter(v => v.status === status);
      }
      return asApiSuccess(list);
    }
  );

export const resolveComplianceViolation = (id, data) =>
  safeRequest(
    () => api.post(`/compliance/violations/${id}/resolve`, data),
    () => {
      const idx = store.violations.findIndex(v => String(v.id) === String(id));
      if (idx !== -1) {
        store.violations[idx].status = 'RESOLVED';
        saveStore();
      }
      return asApiSuccess({ id, status: 'RESOLVED' }, 'Statutory notice updated');
    }
  );

export const getInstitutionCompliance = (id) =>
  safeRequest(
    () => api.get(`/compliance/institution/${id}`),
    () => {
      const inst = store.institutions.find(i => String(i.id) === String(id)) || store.institutions[0];
      return asApiSuccess({
        institution: inst,
        complianceScore: inst.complianceScore,
        programmes: [
          { name: 'Computer Science & Engineering', approved: 180, enrolled: 178, utilization: 98.8, status: 'COMPLIANT' },
          { name: 'Electronics & Communication Engg', approved: 120, enrolled: 119, utilization: 99.1, status: 'COMPLIANT' },
          { name: 'Mechanical Engineering', approved: 120, enrolled: 112, utilization: 93.3, status: 'COMPLIANT' },
          { name: 'Information Technology', approved: 120, enrolled: 121, utilization: 100.8, status: 'INTAKE_OVERFLOW' }
        ]
      });
    }
  );

// 8. Digital Credentials & QR Verification
export const verifyPublicCredential = (credentialId) =>
  safeRequest(
    () => api.get(`/credentials/${credentialId}`),
    () => {
      const stu = store.students[0];
      return asApiSuccess({
        credentialId: credentialId || 'CRD-2024-0001',
        studentName: stu.fullName,
        studentId: stu.studentId,
        apaarId: stu.apaarId,
        institutionName: stu.institutionName,
        institutionCode: stu.institutionCode,
        programmeName: stu.programmeName,
        academicYear: stu.academicYear,
        admissionCategory: stu.admissionCategory,
        status: 'OFFICIALLY_VERIFIED',
        issuedAt: '2024-08-20T10:00:00Z',
        signatureHash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        blockchainTxRef: '0x94b3c82d19451994821a819284918237'
      });
    }
  );

export const getStudentCredential = (studentId) =>
  safeRequest(
    () => api.get(`/credentials/student/${studentId}`),
    () => {
      const stu = store.students.find(s => String(s.id) === String(studentId)) || store.students[0];
      return asApiSuccess({
        credentialId: `CRD-2024-${String(stu.id).padStart(4, '0')}`,
        studentName: stu.fullName,
        apaarId: stu.apaarId,
        institutionName: stu.institutionName,
        programmeName: stu.programmeName,
        academicYear: stu.academicYear,
        qrPayload: `https://apaarix.aicte.gov.in/verify/CRD-2024-${String(stu.id).padStart(4, '0')}`
      });
    }
  );

export const generateCredential = (studentId) =>
  safeRequest(
    () => api.post(`/credentials/generate/${studentId}`),
    () => {
      return asApiSuccess({
        credentialId: `CRD-2024-${String(studentId).padStart(4, '0')}`,
        qrPayload: `https://apaarix.aicte.gov.in/verify/CRD-2024-${String(studentId).padStart(4, '0')}`
      }, 'Digital Credential generated with tamper-proof cryptographic token');
    }
  );

export const getStudentPortalProfile = (studentId = 1) =>
  safeRequest(
    () => api.get(`/student-portal/profile/${studentId}`),
    () => {
      const stu = store.students.find(s => String(s.id) === String(studentId)) || store.students[0];
      return asApiSuccess({
        student: stu,
        enrolments: [
          {
            institutionName: stu.institutionName,
            institutionCode: stu.institutionCode,
            programmeName: stu.programmeName,
            academicYear: stu.academicYear,
            status: 'ACTIVE_ENROLLED'
          }
        ],
        verification: {
          status: stu.verificationStatus,
          apaarId: stu.apaarId,
          verifiedAt: stu.verifiedAt || '2024-08-20T10:00:00Z',
          source: 'DigiLocker / APAAR National Registry'
        },
        credential: {
          credentialId: `CRD-2024-${String(stu.id).padStart(4, '0')}`,
          issuedAt: '2024-08-20T10:00:00Z',
          qrPayload: `https://apaarix.aicte.gov.in/verify/CRD-2024-${String(stu.id).padStart(4, '0')}`
        },
        consents: [
          { id: 1, purpose: 'AICTE Annual Regulatory Enrolment Audit', grantedAt: '2024-08-14', status: 'ACTIVE' },
          { id: 2, purpose: 'National Academic Depository (NAD) Sync', grantedAt: '2024-08-14', status: 'ACTIVE' }
        ]
      });
    }
  );

// 9. Reports & Demo Reset
export const getReportsSummary = () =>
  safeRequest(
    () => api.get('/reports/summary'),
    () => {
      return asApiSuccess({
        totalEnrolmentsReported: 11250,
        totalInstitutionsCovered: store.institutions.length,
        apaarVerificationRate: 75.6,
        duplicateAlertsTotal: store.duplicates.length,
        resolvedDuplicatesTotal: 1,
        activeViolationsTotal: store.violations.filter(v => v.status === 'OPEN').length,
        generatedAt: new Date().toISOString()
      });
    }
  );

export const getStudentExportUrl = () => `${baseURL}/reports/export/students`;
export const getComplianceExportUrl = () => `${baseURL}/reports/export/compliance`;

export const resetDemoData = () =>
  safeRequest(
    () => api.post('/reports/reset-demo'),
    () => {
      store = {
        institutions: [...mockInstitutions],
        students: [...mockStudents],
        duplicates: [...mockDuplicateAlerts],
        violations: [...mockComplianceViolations]
      };
      saveStore();
      return asApiSuccess(null, 'Demo dataset reset to initial state');
    }
  );

export default api;
