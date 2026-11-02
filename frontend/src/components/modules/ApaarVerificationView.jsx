import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Clock, 
  Zap, 
  Check, 
  Edit3,
  X
} from 'lucide-react';
import { getVerificationSummary, getStudents, runBatchVerification, overrideVerificationStatus, verifySingleStudent } from '../../services/api';

export default function ApaarVerificationView() {
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [batchRunning, setBatchRunning] = useState(false);

  // Manual Override Modal
  const [overrideTarget, setOverrideTarget] = useState(null);
  const [overrideStatusVal, setOverrideStatusVal] = useState('VERIFIED');
  const [overrideNotes, setOverrideNotes] = useState('');
  const [overrideSubmitting, setOverrideSubmitting] = useState(false);

  // Interactive Live Tester
  const [testApaar, setTestApaar] = useState('7842-1982-3041');
  const [testResult, setTestResult] = useState(null);

  const fetchSummary = async () => {
    try {
      const res = await getVerificationSummary();
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await getStudents({
        verificationStatus: filterStatus !== 'ALL' ? filterStatus : undefined,
        size: 30
      });
      setStudents(res.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchRecords();
  }, [filterStatus]);

  const handleBatchVerify = async () => {
    setBatchRunning(true);
    try {
      await runBatchVerification();
      await fetchSummary();
      await fetchRecords();
    } catch (err) {
      alert(err.message || 'Batch verification failed');
    } finally {
      setBatchRunning(false);
    }
  };

  const handleSingleVerify = async (stuId) => {
    try {
      await verifySingleStudent(stuId);
      await fetchSummary();
      await fetchRecords();
    } catch (err) {
      alert(err.message || 'Verification failed');
    }
  };

  const submitOverride = async () => {
    if (!overrideTarget) return;
    setOverrideSubmitting(true);
    try {
      await overrideVerificationStatus(overrideTarget.id, {
        status: overrideStatusVal,
        remarks: overrideNotes || 'Approved by AICTE Authorized Officer'
      });
      setOverrideTarget(null);
      setOverrideNotes('');
      await fetchSummary();
      await fetchRecords();
    } catch (err) {
      alert(err.message || 'Override failed');
    } finally {
      setOverrideSubmitting(false);
    }
  };

  const runLiveTest = () => {
    const raw = testApaar.replace(/[^0-9]/g, '');
    if (raw.length !== 12) {
      setTestResult({
        valid: false,
        status: 'INVALID_FORMAT',
        message: 'APAAR ID must contain exactly 12 numeric digits.'
      });
      return;
    }

    if (raw.startsWith('9999')) {
      setTestResult({
        valid: false,
        status: 'INVALID',
        message: 'Mock ABC Gateway Error: ID not present in Academic Bank of Credits master repository.'
      });
    } else if (raw.startsWith('8888')) {
      setTestResult({
        valid: true,
        status: 'MANUAL_REVIEW',
        message: 'Demographic Notice: Candidate name mismatch between college application and Aadhaar seed.'
      });
    } else {
      setTestResult({
        valid: true,
        status: 'VERIFIED',
        message: 'Checksum valid. Academic account active and mapped in DigiLocker NAD repository.'
      });
    }
  };

  useEffect(() => {
    runLiveTest();
  }, [testApaar]);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-brand-text-secondary uppercase">Total Records</span>
            <span className="text-xl font-bold font-kpi text-gray-900 dark:text-white block mt-1">{summary.total}</span>
          </div>
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-emerald-600 uppercase">Verified</span>
            <span className="text-xl font-bold font-kpi text-emerald-600 block mt-1">{summary.verified}</span>
          </div>
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-amber-600 uppercase">Pending Gateway</span>
            <span className="text-xl font-bold font-kpi text-amber-600 block mt-1">{summary.pending}</span>
          </div>
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-rose-600 uppercase">Invalid</span>
            <span className="text-xl font-bold font-kpi text-rose-600 block mt-1">{summary.invalid}</span>
          </div>
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-teal-600 uppercase">Manual Review</span>
            <span className="text-xl font-bold font-kpi text-teal-600 block mt-1">{summary.manualReview}</span>
          </div>
        </div>
      )}

      {/* Interactive Live APAAR Format Validator Box */}
      <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-brand-border dark:border-dark-border gap-2">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-brand-primary" />
              <span>Real-Time APAAR Verification Diagnostic Adapter</span>
            </h3>
            <p className="text-xs text-brand-text-secondary">
              Test APAAR ID structure, checksum validity, and simulated Academic Bank of Credits (ABC) handshake.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-blue-50 text-brand-primary dark:bg-blue-950 dark:text-blue-300 font-bold">
            Mock Adapter Active
          </span>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={testApaar}
            onChange={(e) => setTestApaar(e.target.value)}
            placeholder="Enter 12-digit APAAR ID (e.g. 7842-1982-3041)..."
            className="w-full sm:w-80 px-3 py-2 text-xs font-mono rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none focus:border-brand-primary"
          />

          {testResult && (
            <div className={`flex-1 p-2.5 rounded-lg border text-xs flex items-center space-x-2 ${
              testResult.status === 'VERIFIED' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300' :
              testResult.status === 'MANUAL_REVIEW' ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 text-teal-800 dark:text-teal-300' :
              'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-300'
            }`}>
              {testResult.status === 'VERIFIED' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> :
               testResult.status === 'MANUAL_REVIEW' ? <AlertCircle className="w-4 h-4 text-teal-600 flex-shrink-0" /> :
               <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
              <div>
                <span className="font-bold uppercase tracking-wider text-[11px] block">{testResult.status}</span>
                <span>{testResult.message}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Queue & Batch Actions */}
      <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow overflow-hidden">
        <div className="p-4 border-b border-brand-border dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              APAAR Verification Docket Queue
            </h3>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs py-1 px-2.5 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Only</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="MANUAL_REVIEW">Manual Review Only</option>
              <option value="INVALID">Invalid Only</option>
            </select>
          </div>

          <button
            onClick={handleBatchVerify}
            disabled={batchRunning}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg text-xs font-semibold shadow disabled:opacity-50 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${batchRunning ? 'animate-spin' : ''}`} />
            <span>{batchRunning ? 'Querying Gateway...' : 'Process Pending Queue'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-dark-container text-brand-text-secondary uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">APAAR ID</th>
                <th className="py-3 px-4">Admitted Institution</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Gateway Status</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border dark:divide-dark-border">
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center text-brand-text-secondary">Loading verification queue...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-brand-text-secondary">No records matching status.</td></tr>
              ) : (
                students.map((stu) => (
                  <tr key={stu.enrolmentId} className="hover:bg-gray-50/50 dark:hover:bg-dark-container/30">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{stu.fullName}</div>
                      <div className="text-[10px] font-mono text-brand-text-secondary">{stu.studentId}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-800 dark:text-gray-200">{stu.apaarId}</td>
                    <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300 max-w-[180px] truncate">{stu.institutionName}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600">
                      {stu.verificationConfidence ? `${Math.round(stu.verificationConfidence * 100)}%` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        stu.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        stu.verificationStatus === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        stu.verificationStatus === 'MANUAL_REVIEW' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {stu.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-brand-text-secondary dark:text-dark-text-secondary max-w-[200px] truncate" title={stu.verificationRemarks}>
                      {stu.verificationRemarks || '—'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleSingleVerify(stu.id)}
                        className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-brand-primary text-[11px] font-semibold transition-colors"
                      >
                        Re-verify
                      </button>

                      {stu.verificationStatus !== 'VERIFIED' && (
                        <button
                          onClick={() => setOverrideTarget(stu)}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-dark-container hover:bg-slate-200 text-gray-700 dark:text-gray-200 text-[11px] font-semibold transition-colors"
                        >
                          Override
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Status Override Modal */}
      {overrideTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border dark:border-dark-border">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Administrative Verification Override
              </h3>
              <button onClick={() => setOverrideTarget(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <p className="text-brand-text-secondary">
                You are manually overriding the verification status for <strong>{overrideTarget.fullName}</strong> (APAAR: {overrideTarget.apaarId}).
              </p>

              <div>
                <label className="font-semibold block mb-1">Target Verification Status:</label>
                <select
                  value={overrideStatusVal}
                  onChange={(e) => setOverrideStatusVal(e.target.value)}
                  className="w-full p-2 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white"
                >
                  <option value="VERIFIED">VERIFIED (Administrative Discretion)</option>
                  <option value="MANUAL_REVIEW">MANUAL_REVIEW (Escalate to Regulatory Cell)</option>
                  <option value="INVALID">INVALID (Confirm Fraudulent Record)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Audit Justification Notes:</label>
                <textarea
                  rows={3}
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  placeholder="E.g., Physical verification of Aadhaar and original Class 10 certificate completed..."
                  className="w-full p-2 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-brand-border dark:border-dark-border">
              <button
                onClick={() => setOverrideTarget(null)}
                className="px-3 py-1.5 rounded-lg border border-brand-border dark:border-dark-border text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={submitOverride}
                disabled={overrideSubmitting}
                className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold disabled:opacity-50"
              >
                {overrideSubmitting ? 'Recording...' : 'Confirm Override'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

