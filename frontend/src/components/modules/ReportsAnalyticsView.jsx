import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { getReportsSummary, getStudentExportUrl, getComplianceExportUrl } from '../../services/api';

export default function ReportsAnalyticsView() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReportsSummary().then(res => {
      setSummary(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Bar */}
      <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-brand-primary" />
            <span>AICTE Regulatory Enrolment Reports & Audit Exports</span>
          </h2>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Generate and export official national student enrolment reports, institutional compliance audits, and APAAR registries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={getStudentExportUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shadow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Students Registry (CSV)</span>
          </a>

          <a
            href={getComplianceExportUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-brand-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-container text-gray-800 dark:text-gray-200 text-xs font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-rose-600" />
            <span>Download Violations Log (CSV)</span>
          </a>
        </div>
      </div>

      {/* Aggregate Metrics Tiles */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-brand-text-secondary uppercase">Institutions</span>
            <span className="text-xl font-bold font-kpi text-gray-900 dark:text-white block mt-1">{summary.totalInstitutions}</span>
          </div>
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-brand-primary uppercase">Unique Students</span>
            <span className="text-xl font-bold font-kpi text-brand-primary block mt-1">{summary.totalStudents}</span>
          </div>
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-indigo-600 uppercase">Enrolment Dockets</span>
            <span className="text-xl font-bold font-kpi text-indigo-600 block mt-1">{summary.totalEnrolments}</span>
          </div>
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-amber-600 uppercase">Duplicate Alerts</span>
            <span className="text-xl font-bold font-kpi text-amber-600 block mt-1">{summary.duplicateAlerts}</span>
          </div>
          <div className="p-4 bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow">
            <span className="text-[11px] font-semibold text-rose-600 uppercase">Intake Violations</span>
            <span className="text-xl font-bold font-kpi text-rose-600 block mt-1">{summary.complianceViolations}</span>
          </div>
        </div>
      )}

      {/* Institutional Audit Summary Table */}
      <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl ant-card-shadow overflow-hidden">
        <div className="p-4 border-b border-brand-border dark:border-dark-border">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            AICTE Institutional Regulatory Audit Breakdown
          </h3>
          <p className="text-xs text-brand-text-secondary">
            Nationwide sanctioned vs admitted intake and institutional compliance standing.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-dark-container text-brand-text-secondary uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Sanctioned Intake</th>
                <th className="py-3 px-4">Admitted Students</th>
                <th className="py-3 px-4">Regulatory Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border dark:divide-dark-border">
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-brand-text-secondary">Generating audit tables...</td></tr>
              ) : summary?.institutionSummary?.map((inst, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-dark-container/30">
                  <td className="py-3 px-4 font-mono font-bold text-brand-primary">{inst.code}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{inst.institution}</td>
                  <td className="py-3 px-4 text-brand-text-secondary">{inst.state}</td>
                  <td className="py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">{inst.approvedIntake}</td>
                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">{inst.actualEnrolment}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inst.complianceScore >= 95 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      inst.complianceScore >= 90 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {inst.complianceScore}% Score
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

