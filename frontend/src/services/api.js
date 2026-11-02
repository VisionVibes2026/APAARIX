import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'Network error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

// 1. Dashboard
export const getDashboardMetrics = () => api.get('/dashboard/metrics');

// 2. Institutions
export const getInstitutions = (params) => api.get('/institutions', { params });
export const getInstitutionDetail = (id) => api.get(`/institutions/${id}`);
export const createInstitution = (data) => api.post('/institutions', data);

// 3. Students & Registry
export const getStudents = (params) => api.get('/students', { params });
export const getStudentDetail = (id) => api.get(`/students/${id}`);
export const registerStudent = (data) => api.post('/students', data);

// 4. Student Data Upload
export const downloadCsvTemplate = () => `${api.defaults.baseURL}/upload/template`;
export const validateUploadBatch = (data) => api.post('/upload/validate', data);
export const commitUploadBatch = (data) => api.post('/upload/commit', data);

// 5. APAAR Verification
export const getVerificationSummary = () => api.get('/verification/summary');
export const verifySingleStudent = (studentId) => api.post(`/verification/verify-student/${studentId}`);
export const runBatchVerification = () => api.post('/verification/batch-verify');
export const overrideVerificationStatus = (verificationId, data) => api.post(`/verification/override/${verificationId}`, data);

// 6. Duplicate Detection
export const getDuplicateAlerts = (status) => api.get('/duplicates', { params: { status } });
export const resolveDuplicateAlert = (id, data) => api.post(`/duplicates/${id}/resolve`, data);
export const runDuplicateScan = () => api.post('/duplicates/scan');

// 7. SeatGuard Compliance Monitoring
export const getSeatGuardSummary = () => api.get('/compliance/summary');
export const getComplianceViolations = (status) => api.get('/compliance/violations', { params: { status } });
export const resolveComplianceViolation = (id, data) => api.post(`/compliance/violations/${id}/resolve`, data);
export const getInstitutionCompliance = (id) => api.get(`/compliance/institution/${id}`);

// 8. Digital Credentials & QR Verification
export const verifyPublicCredential = (credentialId) => api.get(`/credentials/${credentialId}`);
export const getStudentCredential = (studentId) => api.get(`/credentials/student/${studentId}`);
export const generateCredential = (studentId) => api.post(`/credentials/generate/${studentId}`);
export const getStudentPortalProfile = (studentId) => api.get(`/student-portal/profile/${studentId}`);

// 9. Reports & Demo Reset
export const getReportsSummary = () => api.get('/reports/summary');
export const getStudentExportUrl = () => `${api.defaults.baseURL}/reports/export/students`;
export const getComplianceExportUrl = () => `${api.defaults.baseURL}/reports/export/compliance`;
export const resetDemoData = () => api.post('/reports/reset-demo');

export default api;
