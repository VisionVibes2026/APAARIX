import React from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowUpRight,
  Sparkles,
  Zap,
  Activity,
  FileSpreadsheet
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';

export default function DashboardView({ 
  metrics, 
  loading, 
  onNavigate, 
  onRunDuplicateScan, 
  onBatchVerify,
  scanning,
  verifying 
}) {
  if (loading || !metrics) {
    return (
      <div className="p-8 flex items-center justify-center space-y-3 flex-col min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-brand-text-secondary dark:text-dark-text-secondary">Loading AICTE Executive Intelligence...</p>
      </div>
    );
  }

  const {
    totalInstitutions = 0,
    totalEnrolments = 0,
    totalStudents = 0,
    verifiedCount = 0,
    pendingCount = 0,
    invalidCount = 0,
    manualReviewCount = 0,
    verificationRate = 0,
    openViolations = 0,
    duplicateAlerts = 0,
    statusBreakdown = [],
    topInstitutions = [],
    enrolmentTrends = []
  } = metrics;

  return (
    <div className="space-y-6">
      {/* Top AICTE Command Banner */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-gradient-to-r from-blue-900 via-indigo-950 to-[#001529] text-white p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 px-2.5 py-1 rounded-full text-xs text-blue-200 font-semibold mb-2 border border-blue-400/30">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span>AICTE National Academic Command Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-kpi tracking-tight">
            APAAR-Based Student Verification & Enrolment Intelligence
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Centralized monitoring of nationwide student admissions, automated APAAR ID validation, cross-institutional duplicate detection, and SeatGuard statutory intake compliance.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={onRunDuplicateScan}
              disabled={scanning}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-brand-primary hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow transition-all disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 text-amber-300 ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? 'Sweeping Registry...' : 'Run Duplicate Sweep'}</span>
            </button>

            <button
              onClick={onBatchVerify}
              disabled={verifying}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow transition-all disabled:opacity-50"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
              <span>{verifying ? 'Verifying Gateway...' : 'Batch Verify APAAR IDs'}</span>
            </button>

            <button
              onClick={() => onNavigate('upload')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
              <span>Upload Institution Docket</span>
            </button>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
          <Building2 className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Approved Institutions */}
        <div 
          onClick={() => onNavigate('institutions')}
          className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow hover:border-brand-primary/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
              Approved Institutions
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-brand-primary">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-kpi text-gray-900 dark:text-white">
              {totalInstitutions}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 100% Active
            </span>
          </div>
          <div className="mt-2 text-xs text-brand-text-secondary dark:text-dark-text-secondary flex justify-between items-center">
            <span>All technical campuses</span>
            <span className="group-hover:translate-x-1 transition-transform text-brand-primary">→</span>
          </div>
        </div>

        {/* KPI 2: Total Student Enrolments */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow hover:border-brand-primary/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
              Total Enrolments
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-kpi text-gray-900 dark:text-white">
              {totalEnrolments}
            </span>
            <span className="text-xs text-brand-text-secondary dark:text-dark-text-secondary font-medium">
              Across UG & PG
            </span>
          </div>
          <div className="mt-2 text-xs text-brand-text-secondary dark:text-dark-text-secondary flex justify-between items-center">
            <span>{totalStudents} unique students</span>
            <span className="group-hover:translate-x-1 transition-transform text-brand-primary">→</span>
          </div>
        </div>

        {/* KPI 3: APAAR Verified Records */}
        <div 
          onClick={() => onNavigate('verification')}
          className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow hover:border-brand-primary/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
              APAAR Verified
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-kpi text-gray-900 dark:text-white">
              {verificationRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {verifiedCount} Records
            </span>
          </div>
          <div className="mt-2 text-xs text-brand-text-secondary dark:text-dark-text-secondary flex justify-between items-center">
            <span>{pendingCount} Pending Gateway</span>
            <span className="group-hover:translate-x-1 transition-transform text-brand-primary">→</span>
          </div>
        </div>

        {/* KPI 4: Compliance & Duplicate Alerts */}
        <div 
          onClick={() => onNavigate('duplicates')}
          className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow hover:border-brand-primary/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
              Active Alerts
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-kpi text-rose-600 dark:text-rose-400">
              {duplicateAlerts + openViolations}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold">
              Action Required
            </span>
          </div>
          <div className="mt-2 text-xs text-brand-text-secondary dark:text-dark-text-secondary flex justify-between items-center">
            <span>{duplicateAlerts} Duplicates | {openViolations} Intake Violations</span>
            <span className="group-hover:translate-x-1 transition-transform text-brand-primary">→</span>
          </div>
        </div>
      </div>

      {/* Charts Section: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Status Breakdown Donut Chart */}
        <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-brand-border dark:border-dark-border">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                APAAR ID Verification Status
              </h3>
              <span className="text-[11px] font-semibold text-brand-primary cursor-pointer" onClick={() => onNavigate('verification')}>
                View Queue →
              </span>
            </div>

            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141414', borderColor: '#303030', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-brand-border dark:border-dark-border text-xs">
            {statusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-brand-text-secondary dark:text-dark-text-secondary">{item.name}:</span>
                <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Institution-wise Enrolment Distribution */}
        <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-brand-border dark:border-dark-border">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Institution Admitted Count vs Approved Intake
                </h3>
                <p className="text-[11px] text-brand-text-secondary dark:text-dark-text-secondary">
                  Top technical campuses by active student docket
                </p>
              </div>
              <span className="text-[11px] font-semibold text-brand-primary cursor-pointer" onClick={() => onNavigate('institutions')}>
                All Institutions →
              </span>
            </div>

            <div className="h-60 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topInstitutions} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="code" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#141414', borderColor: '#303030', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="enrolmentCount" name="Admitted Students" fill="#1677ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Top Institutions Table & Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Campuses Table */}
        <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border dark:border-dark-border">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Institutional Compliance & Seat Utilization
            </h3>
            <button 
              onClick={() => onNavigate('compliance')}
              className="text-xs font-semibold text-brand-primary hover:underline"
            >
              Open SeatGuard Monitor →
            </button>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-dark-container text-brand-text-secondary uppercase font-semibold">
                <tr>
                  <th className="py-2 px-3">Code</th>
                  <th className="py-2 px-3">Institution Name</th>
                  <th className="py-2 px-3">State</th>
                  <th className="py-2 px-3">Admitted</th>
                  <th className="py-2 px-3">Capacity</th>
                  <th className="py-2 px-3">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border dark:divide-dark-border">
                {topInstitutions.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-container/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-brand-primary">{inst.code}</td>
                    <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white max-w-[200px] truncate" title={inst.name}>
                      {inst.name}
                    </td>
                    <td className="py-2.5 px-3 text-brand-text-secondary dark:text-dark-text-secondary">{inst.state}</td>
                    <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-gray-200">{inst.enrolmentCount}</td>
                    <td className="py-2.5 px-3 text-brand-text-secondary">{inst.approvedIntake}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inst.complianceScore >= 95 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        inst.complianceScore >= 90 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {inst.complianceScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Alerts & Quick Actions */}
        <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-brand-border dark:border-dark-border">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Actionable Regulatory Alerts</span>
              </h3>
            </div>

            <div className="mt-3 space-y-3">
              {/* Alert 1 */}
              <div 
                onClick={() => onNavigate('duplicates')}
                className="p-3 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 cursor-pointer hover:bg-rose-50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400">
                  <span>3 Multi-Tenancy APAAR Duplicates</span>
                  <span className="text-[10px] uppercase bg-rose-200 dark:bg-rose-900 px-1.5 py-0.5 rounded font-mono">HIGH</span>
                </div>
                <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">
                  Students registered concurrently in two full-time engineering campuses (e.g. DTU & RVCE).
                </p>
              </div>

              {/* Alert 2 */}
              <div 
                onClick={() => onNavigate('compliance')}
                className="p-3 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 cursor-pointer hover:bg-amber-50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                  <span>MIT-WPU Intake Violation</span>
                  <span className="text-[10px] uppercase bg-amber-200 dark:bg-amber-900 px-1.5 py-0.5 rounded font-mono">CRITICAL</span>
                </div>
                <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">
                  Admitted candidates exceed approved intake by 12 seats (20% excess in B.Tech AI & Data Science).
                </p>
              </div>

              {/* Alert 3 */}
              <div 
                onClick={() => onNavigate('verification')}
                className="p-3 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400">
                  <span>12 APAAR Verifications Pending</span>
                  <span className="text-[10px] uppercase bg-blue-200 dark:bg-blue-900 px-1.5 py-0.5 rounded font-mono">QUEUE</span>
                </div>
                <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">
                  Awaiting automated handshake with DigiLocker / ABC National Gateway.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-brand-border dark:border-dark-border text-center">
            <span className="text-xs text-brand-text-secondary dark:text-dark-text-secondary">
              AICTE Compliance Engine Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

