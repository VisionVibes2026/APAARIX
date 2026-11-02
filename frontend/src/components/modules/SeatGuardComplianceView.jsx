import React, { useState, useEffect } from 'react';
import { 
  Gauge, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  GraduationCap, 
  TrendingUp, 
  ShieldAlert,
  HelpCircle,
  FileText
} from 'lucide-react';
import { getSeatGuardSummary, getComplianceViolations, resolveComplianceViolation, getInstitutions, getInstitutionCompliance } from '../../services/api';

export default function SeatGuardComplianceView() {
  const [summary, setSummary] = useState(null);
  const [violations, setViolations] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstId, setSelectedInstId] = useState('');
  const [instAnalysis, setInstAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);

  const fetchSummary = async () => {
    try {
      const res = await getSeatGuardSummary();
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const res = await getComplianceViolations();
      setViolations(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchViolations();
    getInstitutions().then(res => {
      const list = res.data || [];
      setInstitutions(list);
      if (list.length > 0) {
        setSelectedInstId(list[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedInstId) {
      getInstitutionCompliance(selectedInstId).then(res => {
        setInstAnalysis(res.data);
      }).catch(console.error);
    }
  }, [selectedInstId]);

  const handleResolve = async (id) => {
    setResolvingId(id);
    try {
      await resolveComplianceViolation(id, {
        notes: 'Excess intake penalised and neutralized in subsequent academic intake matrix by AICTE Committee.'
      });
      fetchSummary();
      fetchViolations();
    } catch (err) {
      alert(err.message || 'Resolve failed');
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary KPI Tiles */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-brand-text-secondary uppercase">Sanctioned Intake</span>
            <span className="text-xl font-bold font-kpi text-gray-900 dark:text-white block mt-1">{summary.totalApprovedIntake}</span>
          </div>
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-brand-primary uppercase">Actual Enrolled</span>
            <span className="text-xl font-bold font-kpi text-brand-primary block mt-1">{summary.totalEnrolment}</span>
          </div>
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-emerald-600 uppercase">Avg Compliance</span>
            <span className="text-xl font-bold font-kpi text-emerald-600 block mt-1">{summary.averageComplianceScore}%</span>
          </div>
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-rose-600 uppercase">Open Violations</span>
            <span className="text-xl font-bold font-kpi text-rose-600 block mt-1">{summary.openViolations}</span>
          </div>
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-teal-600 uppercase">Resolved Cases</span>
            <span className="text-xl font-bold font-kpi text-teal-600 block mt-1">{summary.resolvedViolations}</span>
          </div>
        </div>
      )}

      {/* Statutory Violation Log */}
      <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow overflow-hidden">
        <div className="p-4 border-b border-brand-border dark:border-dark-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>SeatGuard Intake Capacity Violations Docket</span>
            </h3>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              Automated detection of campuses admitting candidates beyond AICTE statutory limits.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-dark-container text-brand-text-secondary uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Campus</th>
                <th className="py-3 px-4">Programme</th>
                <th className="py-3 px-4">Approved</th>
                <th className="py-3 px-4">Admitted</th>
                <th className="py-3 px-4">Excess Seats</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Regulatory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border dark:divide-dark-border">
              {loading ? (
                <tr><td colSpan={8} className="py-8 text-center text-brand-text-secondary">Loading violation log...</td></tr>
              ) : violations.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-brand-text-secondary">Zero recorded intake violations.</td></tr>
              ) : (
                violations.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-container/30">
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900 dark:text-white">{v.institution.name}</div>
                      <div className="font-mono text-[10px] text-brand-text-secondary">{v.institution.code}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                      {v.programme ? v.programme.name : 'All Campus Programmes'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{v.approvedIntake}</td>
                    <td className="py-3 px-4 font-bold text-rose-600">{v.actualEnrolment}</td>
                    <td className="py-3 px-4 font-extrabold text-rose-600 font-kpi text-sm">+{v.excessCount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        v.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {v.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {v.status !== 'RESOLVED' ? (
                        <button
                          onClick={() => handleResolve(v.id)}
                          disabled={resolvingId === v.id}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow transition-all disabled:opacity-50"
                        >
                          Resolve & Penalize
                        </button>
                      ) : (
                        <span className="text-[11px] text-brand-text-secondary">Neutralized</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campus Programme Seat Capacity Inspector */}
      <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-brand-border dark:border-dark-border gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-teal-600" />
              <span>Campus Programme Intake Inspector</span>
            </h3>
            <p className="text-xs text-brand-text-secondary">
              Inspect programme-by-programme intake headroom for selected institution.
            </p>
          </div>

          <select
            value={selectedInstId}
            onChange={(e) => setSelectedInstId(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none w-full sm:w-72"
          >
            {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>

        {instAnalysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {instAnalysis.programmes.map((p) => {
                const isOver = p.excessSeats > 0;
                return (
                  <div 
                    key={p.programmeId}
                    className={`p-4 rounded-xl border space-y-2 ${
                      isOver ? 'border-rose-300 dark:border-rose-900 bg-rose-50/20' :
                      'border-brand-border dark:border-dark-border bg-gray-50/50 dark:bg-dark-container/30'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-brand-primary">{p.code}</span>
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white">{p.name}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isOver ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {isOver ? `Excess +${p.excessSeats}` : 'Compliant'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-brand-text-secondary">Admitted vs Approved Ceiling:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {p.actualEnrolment} / {p.approvedIntake}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isOver ? 'bg-rose-600' : 'bg-brand-primary'}`}
                          style={{ width: `${Math.min(p.utilizationPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

