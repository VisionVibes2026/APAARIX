// Rich mock database for standalone frontend deployment
// Provides 100% functional data when backend is not deployed online

export const mockInstitutions = [
  { id: 1, code: 'AICTE-1-1001', name: 'Delhi Technological University', state: 'Delhi', city: 'New Delhi', category: 'State Government', approvedIntake: 1200, email: 'dean.academics@dtu.ac.in', phone: '+91-11-27871018', complianceScore: 98, status: 'ACTIVE' },
  { id: 2, code: 'AICTE-1-1002', name: 'COEP Technological University', state: 'Maharashtra', city: 'Pune', category: 'State Autonomous', approvedIntake: 960, email: 'director@coeptech.ac.in', phone: '+91-20-25507000', complianceScore: 96, status: 'ACTIVE' },
  { id: 3, code: 'AICTE-1-1003', name: 'R.V. College of Engineering', state: 'Karnataka', city: 'Bengaluru', category: 'Private Autonomous', approvedIntake: 1100, email: 'principal@rvce.edu.in', phone: '+91-80-68188111', complianceScore: 94, status: 'ACTIVE' },
  { id: 4, code: 'AICTE-1-1004', name: 'PSG College of Technology', state: 'Tamil Nadu', city: 'Coimbatore', category: 'Govt Aided Autonomous', approvedIntake: 1050, email: 'principal@psgtech.edu', phone: '+91-422-2572177', complianceScore: 97, status: 'ACTIVE' },
  { id: 5, code: 'AICTE-1-1005', name: 'Jadavpur University Faculty of Engg', state: 'West Bengal', city: 'Kolkata', category: 'State University', approvedIntake: 900, email: 'dean.engg@jadavpuruniversity.in', phone: '+91-33-24146666', complianceScore: 95, status: 'ACTIVE' },
  { id: 6, code: 'AICTE-1-1006', name: 'Veermata Jijabai Technological Institute', state: 'Maharashtra', city: 'Mumbai', category: 'State Autonomous', approvedIntake: 840, email: 'director@vjti.ac.in', phone: '+91-22-24198101', complianceScore: 99, status: 'ACTIVE' },
  { id: 7, code: 'AICTE-1-1007', name: 'B.M.S. College of Engineering', state: 'Karnataka', city: 'Bengaluru', category: 'Private Autonomous', approvedIntake: 1150, email: 'principal@bmsce.ac.in', phone: '+91-80-26622130', complianceScore: 92, status: 'ACTIVE' },
  { id: 8, code: 'AICTE-1-1008', name: 'Thapar Institute of Engg & Technology', state: 'Punjab', city: 'Patiala', category: 'Deemed University', approvedIntake: 1400, email: 'registrar@thapar.edu', phone: '+91-175-2393021', complianceScore: 86, status: 'ACTIVE' },
  { id: 9, code: 'AICTE-1-1009', name: 'MIT World Peace University', state: 'Maharashtra', city: 'Pune', category: 'Private University', approvedIntake: 1300, email: 'admissions@mitwpu.edu.in', phone: '+91-20-71177104', complianceScore: 82, status: 'ACTIVE' },
  { id: 10, code: 'AICTE-1-1010', name: 'Chaitanya Bharathi Institute of Tech', state: 'Telangana', city: 'Hyderabad', category: 'Private Autonomous', approvedIntake: 1020, email: 'principal@cbit.ac.in', phone: '+91-40-24193276', complianceScore: 95, status: 'ACTIVE' }
];

const firstNames = ['Aarav', 'Ananya', 'Rohan', 'Pooja', 'Vikram', 'Sneha', 'Aditya', 'Priyanka', 'Karthik', 'Divya', 'Siddharth', 'Neha', 'Arjun', 'Tanvi', 'Rahul', 'Isha', 'Manish', 'Meera', 'Gaurav', 'Shreya'];
const lastNames = ['Sharma', 'Verma', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Kulkarni', 'Mukherjee', 'Gupta', 'Singh', 'Choudhury', 'Joshi', 'Bose', 'Mehta', 'Rao'];
const progs = ['Computer Science & Engineering', 'Electronics & Communication Engg', 'Mechanical Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'];
const cats = ['GENERAL', 'OBC', 'SC', 'ST', 'EWS', 'NRI'];
const statuses = ['VERIFIED', 'VERIFIED', 'VERIFIED', 'PENDING', 'INVALID', 'MANUAL_REVIEW'];

// Generate 90 realistic students
export const generateMockStudents = () => {
  const list = [];
  for (let i = 1; i <= 90; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const inst = mockInstitutions[i % mockInstitutions.length];
    const prog = progs[i % progs.length];
    const cat = cats[i % cats.length];
    const status = statuses[i % statuses.length];
    const apaar = `${7000 + (i * 27)}-${1000 + (i * 83)}-${4000 + (i * 19)}`;

    list.push({
      id: i,
      studentId: `STU-2024-${String(i).padStart(4, '0')}`,
      fullName: `${fn} ${ln}`,
      apaarId: apaar,
      institutionId: inst.id,
      institutionName: inst.name,
      institutionCode: inst.code,
      programmeName: prog,
      programmeCode: `${inst.code}-CSE`,
      academicYear: '2024-2025',
      admissionCategory: cat,
      enrolmentStatus: 'ENROLLED',
      verificationStatus: status,
      enrolmentDate: '2024-08-14',
      dateOfBirth: '2004-06-15',
      gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.ac.in`,
      phone: `+91-98765${String(10000 + i).slice(-5)}`,
      verifiedAt: status === 'VERIFIED' ? '2024-08-20T10:30:00Z' : null,
      verificationSource: status === 'VERIFIED' ? 'APAAR_LIVE_GATEWAY' : null
    });
  }
  return list;
};

export const mockStudents = generateMockStudents();

export const mockDuplicateAlerts = [
  {
    id: 1,
    studentId: 'STU-2024-0012',
    studentName: 'Rohan Patel',
    apaarId: '7324-1996-4228',
    institutionAName: 'Delhi Technological University',
    institutionACode: 'AICTE-1-1001',
    programmeA: 'Computer Science & Engineering',
    institutionBName: 'COEP Technological University',
    institutionBCode: 'AICTE-1-1002',
    programmeB: 'Information Technology',
    academicYear: '2024-2025',
    matchReason: 'IDENTICAL_APAAR_ID',
    matchConfidence: 99.4,
    reviewStatus: 'PENDING',
    flaggedAt: '2024-08-22T09:15:00Z'
  },
  {
    id: 2,
    studentId: 'STU-2024-0027',
    studentName: 'Priyanka Reddy',
    apaarId: '7729-3241-4513',
    institutionAName: 'R.V. College of Engineering',
    institutionACode: 'AICTE-1-1003',
    programmeA: 'Electronics & Communication Engg',
    institutionBName: 'PSG College of Technology',
    institutionBCode: 'AICTE-1-1004',
    programmeB: 'Electronics & Communication Engg',
    academicYear: '2024-2025',
    matchReason: 'DEMOGRAPHIC_AND_ID_SIMILARITY',
    matchConfidence: 88.5,
    reviewStatus: 'PENDING',
    flaggedAt: '2024-08-23T14:40:00Z'
  },
  {
    id: 3,
    studentId: 'STU-2024-0045',
    studentName: 'Aditya Gupta',
    apaarId: '8215-4735-5120',
    institutionAName: 'Veermata Jijabai Technological Institute',
    institutionACode: 'AICTE-1-1006',
    programmeA: 'Mechanical Engineering',
    institutionBName: 'MIT World Peace University',
    institutionBCode: 'AICTE-1-1009',
    programmeB: 'Mechanical Engineering',
    academicYear: '2024-2025',
    matchReason: 'IDENTICAL_APAAR_ID',
    matchConfidence: 99.8,
    reviewStatus: 'PENDING',
    flaggedAt: '2024-08-25T11:00:00Z'
  },
  {
    id: 4,
    studentId: 'STU-2024-0062',
    studentName: 'Tanvi Joshi',
    apaarId: '8674-6149-5561',
    institutionAName: 'Thapar Institute of Engg & Technology',
    institutionACode: 'AICTE-1-1008',
    programmeA: 'Artificial Intelligence & Data Science',
    institutionBName: 'Delhi Technological University',
    institutionBCode: 'AICTE-1-1001',
    programmeB: 'Artificial Intelligence & Data Science',
    academicYear: '2024-2025',
    matchReason: 'CROSS_STATE_DUAL_REGISTRATION',
    matchConfidence: 94.2,
    reviewStatus: 'PENDING',
    flaggedAt: '2024-08-26T16:20:00Z'
  }
];

export const mockComplianceViolations = [
  {
    id: 1,
    institutionId: 8,
    institutionName: 'Thapar Institute of Engg & Technology',
    institutionCode: 'AICTE-1-1008',
    programmeName: 'Computer Science & Engineering',
    violationType: 'INTAKE_OVERFLOW',
    severity: 'HIGH',
    approvedLimit: 180,
    actualCount: 194,
    excessCount: 14,
    academicYear: '2024-2025',
    status: 'OPEN',
    description: 'Actual enrolment exceeds statutory AICTE approved intake by 14 seats in CSE branch.',
    detectedAt: '2024-08-24T12:00:00Z'
  },
  {
    id: 2,
    institutionId: 9,
    institutionName: 'MIT World Peace University',
    institutionCode: 'AICTE-1-1009',
    programmeName: 'Information Technology',
    violationType: 'NRI_QUOTA_BREACH',
    severity: 'MEDIUM',
    approvedLimit: 18,
    actualCount: 24,
    excessCount: 6,
    academicYear: '2024-2025',
    status: 'OPEN',
    description: 'Supernumerary NRI quota allocation exceeds the 15% statutory threshold.',
    detectedAt: '2024-08-25T15:30:00Z'
  },
  {
    id: 3,
    institutionId: 7,
    institutionName: 'B.M.S. College of Engineering',
    institutionCode: 'AICTE-1-1007',
    programmeName: 'Electronics & Communication Engg',
    violationType: 'LATERAL_ENTRY_OVERFLOW',
    severity: 'MEDIUM',
    approvedLimit: 24,
    actualCount: 29,
    excessCount: 5,
    academicYear: '2024-2025',
    status: 'OPEN',
    description: 'Second-year lateral entry admissions exceed 10% sanctioned intake quota.',
    detectedAt: '2024-08-26T10:15:00Z'
  }
];

