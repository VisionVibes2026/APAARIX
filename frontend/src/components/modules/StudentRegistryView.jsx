import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  X,
  FileSpreadsheet,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  QrCode
} from 'lucide-react';
import { getStudents, getInstitutions, getStudentDetail, verifySingleStudent, getStudentExportUrl } from '../../services/api';

export default function StudentRegistryView({ onSelectStudentForCredential }) {
  const [students, setStudents] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('ALL');
  const [academicYear, setAcademicYear] = useState('ALL');

  // Drawer
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentDetail, setStudentDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [verifyingStudent, setVerifyingStudent] = useState(false);

  useEffect(() => {
    getInstitutions().then(res => setInstitutions(res.data || [])).catch(console.error);
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudents({
        search: search.trim() || undefined,
        institutionId: institutionId ? Number(institutionId) : undefined,
        verificationStatus: verificationStatus !== 'ALL' ? verificationStatus : undefined,
        academicYear: academicYear !== 'ALL' ? academicYear : undefined,
        page: currentPage,
        size: pageSize
      });
      setStudents(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, institutionId, verificationStatus, academicYear, currentPage, pageSize]);

  const openStudentDossier = async (id) => {
    setSelectedStudentId(id);
    setDetailLoading(true);
    try {
      const res = await getStudentDetail(id);
      setStudentDetail(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleVerifyNow = async (id) => {
    setVerifyingStudent(true);
    try {
      await verifySingleStudent(id);
      await openStudentDossier(id);
      fetchStudents();
    } catch (err) {
      alert(err.message || 'Verification failed');
    } finally {
      setVerifyingStudent(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><CheckCircle2 className="w-3 h-3 mr-1" />VERIFIED</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"><Clock className="w-3 h-3 mr-1" />PENDING</span>;
      case 'INVALID':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"><XCircle className="w-3 h-3 mr-1" />INVALID</span>;
      case 'MANUAL_REVIEW':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"><AlertCircle className="w-3 h-3 mr-1" />MANUAL REVIEW</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-4 ant-card-shadow flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-brand-text-secondary" />
          <input
            type="text"
            placeholder="Search by student name, ID, APAAR..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(0); }}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none focus:border-brand-primary"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={institutionId}
            onChange={(e) => { setInstitutionId(e.target.value); setCurrentPage(0); }}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none"
          >
            <option value="">All Campuses</option>
            {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>

          <select
            value={verificationStatus}
            onChange={(e) => { setVerificationStatus(e.target.value); setCurrentPage(0); }}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="INVALID">Invalid</option>
            <option value="MANUAL_REVIEW">Manual Review</option>
          </select>

          <select
            value={academicYear}
            onChange={(e) => { setAcademicYear(e.target.value); setCurrentPage(0); }}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none"
          >
            <option value="ALL">All Years</option>
            <option value="2024-2025">AY 2024-2025</option>
            <option value="2023-2024">AY 2023-2024</option>
          </select>

          <a
            href={getStudentExportUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-brand-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-container text-xs font-semibold text-gray-700 dark:text-gray-200"
          >
            <Download className="w-3.5 h-3.5 text-brand-primary" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Main Students Table */}
      <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-dark-container text-brand-text-secondary uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Masked APAAR ID</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Programme</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">APAAR Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border dark:divide-dark-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-brand-text-secondary">
                    Loading student records...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-brand-text-secondary">
                    No student records matching current filters.
                  </td>
                </tr>
              ) : (
                students.map((stu) => (
                  <tr 
                    key={stu.enrolmentId}
                    onClick={() => openStudentDossier(stu.id)}
                    className="hover:bg-blue-50/40 dark:hover:bg-dark-container/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-brand-primary">{stu.studentId}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{stu.fullName}</td>
                    <td className="py-3 px-4 font-mono text-gray-700 dark:text-gray-300">{stu.maskedApaar}</td>
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200 max-w-[180px] truncate" title={stu.institutionName}>
                      {stu.institutionName}
                    </td>
                    <td className="py-3 px-4 text-brand-text-secondary dark:text-dark-text-secondary">{stu.programmeName}</td>
                    <td className="py-3 px-4">{stu.academicYear}</td>
                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-dark-container text-gray-700 dark:text-gray-300">
                        {stu.admissionCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(stu.verificationStatus)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 bg-gray-50/50 dark:bg-dark-container/50 border-t border-brand-border dark:border-dark-border flex items-center justify-between text-xs">
          <span className="text-brand-text-secondary dark:text-dark-text-secondary">
            Showing {students.length} of {totalElements} student enrolments
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
              className="p-1.5 rounded border border-brand-border dark:border-dark-border disabled:opacity-30 hover:bg-white dark:hover:bg-dark-card"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-semibold px-2">Page {currentPage + 1} of {Math.max(totalPages, 1)}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
              className="p-1.5 rounded border border-brand-border dark:border-dark-border disabled:opacity-30 hover:bg-white dark:hover:bg-dark-card"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Over Drawer for Student Academic Dossier */}
      {selectedStudentId && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-white dark:bg-dark-card h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border dark:border-dark-border">
              <div>
                <span className="text-xs font-mono font-bold text-brand-primary">Student Academic Dossier</span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {studentDetail?.student?.fullName || 'Loading...'}
                </h2>
              </div>
              <button
                onClick={() => setSelectedStudentId(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-container text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="p-12 text-center text-xs text-brand-text-secondary">Loading academic dossier...</div>
            ) : studentDetail ? (
              <div className="space-y-6 text-xs">
                {/* Identity & APAAR Card */}
                <div className="p-4 rounded-xl border border-brand-primary/30 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-brand-primary uppercase tracking-wider text-[11px]">
                      National Academic Identifier (APAAR ID)
                    </span>
                    {studentDetail.verification && getStatusBadge(studentDetail.verification.status)}
                  </div>
                  <div className="font-mono text-base font-extrabold text-gray-900 dark:text-white">
                    {studentDetail.student.apaarId}
                  </div>
                  <div className="text-[11px] text-gray-600 dark:text-gray-300">
                    {studentDetail.verification?.remarks || 'Verification in progress with Academic Bank of Credits.'}
                  </div>
                  <div className="pt-2 border-t border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
                    <span className="text-brand-text-secondary">Gateway Confidence:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {studentDetail.verification?.confidenceScore ? `${Math.round(studentDetail.verification.confidenceScore * 100)}%` : '—'}
                    </span>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Student Demographics</h4>
                  <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-dark-container rounded-lg">
                    <div>
                      <span className="text-brand-text-secondary block">Student ID:</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">{studentDetail.student.studentId}</span>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary block">Date of Birth:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{studentDetail.student.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary block">Gender:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{studentDetail.student.gender}</span>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary block">Father Name:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{studentDetail.student.fatherName}</span>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary block">Email:</span>
                      <span className="font-medium text-brand-primary truncate block">{studentDetail.student.email}</span>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary block">Mobile:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{studentDetail.student.mobileNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Enrolment History */}
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Academic Enrolments</h4>
                  <div className="space-y-2">
                    {studentDetail.enrolments.map((enr) => (
                      <div key={enr.id} className="p-3 border border-brand-border dark:border-dark-border rounded-lg bg-white dark:bg-dark-card space-y-1">
                        <div className="font-bold text-gray-900 dark:text-white text-xs">{enr.institution.name}</div>
                        <div className="text-brand-primary font-medium">{enr.programme.name}</div>
                        <div className="flex justify-between text-brand-text-secondary pt-1">
                          <span>AY: {enr.academicYear} ({enr.admissionCategory})</span>
                          <span className="font-semibold text-emerald-600">{enr.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-brand-border dark:border-dark-border space-y-2">
                  <button
                    onClick={() => handleVerifyNow(studentDetail.student.id)}
                    disabled={verifyingStudent}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg font-semibold text-xs transition-all shadow"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${verifyingStudent ? 'animate-spin' : ''}`} />
                    <span>{verifyingStudent ? 'Querying Gateway...' : 'Re-verify with ABC Gateway'}</span>
                  </button>

                  {studentDetail.credential && (
                    <button
                      onClick={() => {
                        setSelectedStudentId(null);
                        if (onSelectStudentForCredential) {
                          onSelectStudentForCredential(studentDetail.student.id);
                        }
                      }}
                      className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg font-semibold text-xs transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Verifiable Digital Credential</span>
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

