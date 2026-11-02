import React, { useState, useEffect } from 'react';
import { 
  CopyCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RefreshCw, 
  Building2, 
  ArrowRight, 
  ShieldAlert,
  Zap,
  Check,
  X
} from 'lucide-react';
import { getDuplicateAlerts, resolveDuplicateAlert, runDuplicateScan } from '../../services/api';

export default function DuplicateDetectionView() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [scanning, setScanning] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await getDuplicateAlerts(filterStatus !== 'ALL' ? filterStatus : undefined);
      setAlerts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filterStatus]);

  const handleRunScan = async () => {
    setScanning(true);
    try {
      const res = await runDuplicateScan();
      alert(`Automated sweep finished! Scanned ${res.data.totalEnrolmentsScanned} enrolments. New alerts: ${res.data.newAlertsDetected}`);
      fetchAlerts();
    } catch (err) {
      alert(err.message || 'Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const handleResolve = async (id, decision) => {
    setResolvingId(id);
    try {
      await resolveDuplicateAlert(id, {
        decision: decision,
        notes: decision === 'CONFIRMED_DUPLICATE' 
          ? 'Confirmed concurrent full-time enrolment violation. Notice dispatched to Registrar.'
          : decision === 'GENUINE'
          ? 'Legitimate institutional migration verified with formal transfer certificate.'
          : 'Referred to AICTE Standing Committee for student hearing.'
      });
      fetchAlerts();
    } catch (err) {
      alert(err.message || 'Resolution failed');
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Cross-Institution Multi-Tenancy Duplicate Surveillance</span>
          </h2>
          <p className="text-xs text-brand-text-secondary dark:text-dark-text-secondary mt-0.5">
            Real-time identification of simultaneous regular enrolments across AICTE-approved institutions using APAAR ID as unique national identifier.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none"
          >
            <option value="ALL">All Review Statuses</option>
            <option value="PENDING">Pending Review ({alerts.filter(a => a.reviewStatus === 'PENDING').length})</option>
            <option value="CONFIRMED_DUPLICATE">Confirmed Violations</option>
            <option value="GENUINE">Resolved / Genuine</option>
          </select>

          <button
            onClick={handleRunScan}
            disabled={scanning}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg text-xs font-semibold shadow disabled:opacity-50 transition-all"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-300 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Scanning Registry...' : 'Trigger Duplicate Sweep'}</span>
          </button>
        </div>
      </div>

      {/* Duplicate Incident Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-brand-text-secondary">Loading duplicate incident registry...</div>
      ) : alerts.length === 0 ? (
        <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-12 text-center space-y-2 ant-card-shadow">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Zero Unresolved Duplicate Incidents</h3>
          <p className="text-xs text-brand-text-secondary">All institutional student dockets adhere to unique enrolment mandates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`bg-white dark:bg-dark-card border rounded-xl p-5 ant-card-shadow transition-all space-y-4 ${
                alert.reviewStatus === 'CONFIRMED_DUPLICATE' ? 'border-rose-300 dark:border-rose-900 bg-rose-50/10' :
                alert.reviewStatus === 'GENUINE' ? 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/10' :
                'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-brand-border dark:border-dark-border gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-extrabold text-brand-primary">INCIDENT #{alert.id}</span>
                  <span className="text-xs text-brand-text-secondary">•</span>
                  <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                    APAAR ID: {alert.apaarId}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-bold uppercase bg-blue-100 dark:bg-blue-950 text-brand-primary text-[10px]">
                    {alert.confidenceLevel} CONFIDENCE
                  </span>
                </div>

                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    alert.reviewStatus === 'CONFIRMED_DUPLICATE' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                    alert.reviewStatus === 'GENUINE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {alert.reviewStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Side by Side Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Institution A Docket */}
                <div className="p-3.5 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50/80 dark:bg-dark-container/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">CAMPUS DOCKET A</span>
                    <span className="font-mono text-[11px] font-bold text-gray-700 dark:text-gray-300">{alert.institutionA.code}</span>
                  </div>
                  <div className="font-bold text-xs text-gray-900 dark:text-white">{alert.institutionA.name}</div>
                  <div className="text-xs text-brand-text-secondary">{alert.institutionA.city}, {alert.institutionA.state}</div>
                  <div className="pt-2 border-t border-brand-border dark:border-dark-border text-xs flex justify-between">
                    <span className="text-brand-text-secondary">Enrolled Student:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{alert.studentA.fullName} ({alert.studentA.studentId})</span>
                  </div>
                </div>

                {/* Institution B Docket */}
                <div className="p-3.5 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50/80 dark:bg-dark-container/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">CAMPUS DOCKET B</span>
                    <span className="font-mono text-[11px] font-bold text-gray-700 dark:text-gray-300">{alert.institutionB.code}</span>
                  </div>
                  <div className="font-bold text-xs text-gray-900 dark:text-white">{alert.institutionB.name}</div>
                  <div className="text-xs text-brand-text-secondary">{alert.institutionB.city}, {alert.institutionB.state}</div>
                  <div className="pt-2 border-t border-brand-border dark:border-dark-border text-xs flex justify-between">
                    <span className="text-brand-text-secondary">Enrolled Student:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{alert.studentB.fullName} ({alert.studentB.studentId})</span>
                  </div>
                </div>
              </div>

              {/* Match Reason & Notes */}
              <div className="p-3 bg-white dark:bg-dark-card rounded-lg border border-brand-border dark:border-dark-border text-xs space-y-1">
                <span className="font-bold text-gray-900 dark:text-white block">Intelligence Detection Reason:</span>
                <p className="text-gray-600 dark:text-gray-300">{alert.matchReason}</p>
                {alert.resolutionNotes && (
                  <p className="text-brand-primary font-medium pt-1">
                    <strong>Audit Record:</strong> {alert.resolutionNotes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              {alert.reviewStatus === 'PENDING' && (
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleResolve(alert.id, 'CONFIRMED_DUPLICATE')}
                    disabled={resolvingId === alert.id}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition-all disabled:opacity-50"
                  >
                    Confirm Duplicate Enrolment
                  </button>

                  <button
                    onClick={() => handleResolve(alert.id, 'GENUINE')}
                    disabled={resolvingId === alert.id}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all disabled:opacity-50"
                  >
                    Mark Genuine / Valid Transfer
                  </button>

                  <button
                    onClick={() => handleResolve(alert.id, 'MANUAL_REVIEW')}
                    disabled={resolvingId === alert.id}
                    className="px-3 py-1.5 rounded-lg border border-brand-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-container text-xs font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Refer to State Committee
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

