import React, { useState } from 'react';
import {
  Shield, Building2, GraduationCap, UserCheck,
  Eye, EyeOff, BookOpen, ChevronRight, CheckCircle2,
  X, ArrowRight, Zap, Lock, Users, BarChart3
} from 'lucide-react';

// Mock users
const USERS = {
  admin:       { password: 'admin123',  role: 'aicte_admin',  label: 'AICTE National Admin',    color: 'from-blue-600 to-blue-800',      icon: Shield },
  institution: { password: 'inst123',   role: 'inst_admin',   label: 'Institution Admin (DTU)',  color: 'from-teal-600 to-teal-800',      icon: Building2 },
  verifier:    { password: 'veri123',   role: 'verifier',     label: 'Third-Party Verifier',     color: 'from-emerald-600 to-emerald-800', icon: UserCheck },
  student:     { password: 'stud123',   role: 'student',      label: 'Student (Aarav Sharma)',   color: 'from-indigo-600 to-indigo-800',  icon: GraduationCap },
};

const GUIDE_STEPS = [
  {
    icon: Shield,
    title: 'Login as AICTE Admin',
    desc: 'Use username "admin" / password "admin123". Access the full executive dashboard with KPIs, charts, and all 10 modules.',
    color: 'text-blue-400',
  },
  {
    icon: BarChart3,
    title: 'Executive Dashboard',
    desc: 'View real-time KPI cards, APAAR verification charts, enrolment trends, and institution-wise statistics.',
    color: 'text-purple-400',
  },
  {
    icon: Zap,
    title: 'Run Duplicate Sweep',
    desc: 'Click "Run Duplicate Sweep" on the dashboard to detect cross-institution duplicate enrolments.',
    color: 'text-amber-400',
  },
  {
    icon: Shield,
    title: 'Batch Verify APAAR IDs',
    desc: 'Click "Batch Verify APAAR IDs" to trigger the mock APAAR verification engine for all pending records.',
    color: 'text-emerald-400',
  },
  {
    icon: Users,
    title: 'Student Registry',
    desc: 'Browse 90 synthetic student records with search, filters, sorting, and column-level pagination.',
    color: 'text-teal-400',
  },
  {
    icon: Building2,
    title: 'Switch Roles',
    desc: 'Use the Role Switcher in the top header to switch between AICTE Admin, Institution Admin, Verifier, and Student views.',
    color: 'text-indigo-400',
  },
  {
    icon: Lock,
    title: 'Student Portal',
    desc: 'Switch to "Student" role or login as "student / stud123" to see the self-service credential and verification portal.',
    color: 'text-rose-400',
  },
  {
    icon: CheckCircle2,
    title: 'Digital Credentials',
    desc: 'Navigate to Digital Credentials to generate QR-based verifiable enrolment credentials.',
    color: 'text-green-400',
  },
];

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = USERS[username];
      if (user && user.password === password) {
        onLogin({ username, role: user.role });
      } else {
        setError('Invalid credentials. Try one of the quick-access roles below.');
      }
      setLoading(false);
    }, 600);
  };

  const handleQuickLogin = (key) => {
    const user = USERS[key];
    setLoading(true);
    setTimeout(() => {
      onLogin({ username: key, role: user.role });
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #000e1f 0%, #001529 50%, #002147 100%)' }}>
      {/* ── Left Panel — Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-500/5 border border-blue-500/10" />
          <div className="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-teal-500/5 border border-teal-500/10" />
          <div className="absolute -bottom-20 left-1/4 w-64 h-64 rounded-full bg-indigo-500/5 border border-indigo-500/10" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center mb-12">
            <img
              src="/apaarix-logo.jpg"
              alt="APAARIX Logo"
              className="h-16 object-contain rounded-xl bg-white/90 px-3 py-1 shadow-lg shadow-blue-500/20"
            />
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Student Verification<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
              & Enrolment Intelligence
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            APAAR-Based centralized student identity verification, cross-institution duplicate detection, SeatGuard compliance monitoring, and digital credential issuance — powering regulatory oversight for AICTE-approved institutions across India.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: Shield,       label: 'APAAR ID Verification Engine',      color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Users,        label: 'Cross-Institution Duplicate Detection', color: 'text-teal-400', bg: 'bg-teal-500/10' },
            { icon: BarChart3,    label: 'SeatGuard Compliance Monitoring',   color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            { icon: CheckCircle2, label: 'Digital Verifiable Credentials',     color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map(({ icon: Icon, label, color, bg }) => (
            <div key={label} className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg ${bg} border border-white/5`}>
              <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
              <span className="text-sm text-slate-300">{label}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-600">
          Government of India • All India Council for Technical Education (AICTE) • Demo Prototype v1.2.0
        </div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <img
              src="/apaarix-logo.jpg"
              alt="APAARIX Logo"
              className="h-12 object-contain rounded-lg bg-white/90 px-2 py-1 shadow"
            />
          </div>

          {/* Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Welcome back</h3>
              <p className="text-sm text-slate-400 mt-1">Sign in to access the platform</p>
            </div>

            {/* Quick Demo Access */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Demo Access — Click to Login Instantly</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(USERS).map(([key, u]) => {
                  const Icon = u.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => handleQuickLogin(key)}
                      disabled={loading}
                      className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg bg-gradient-to-r ${u.color} text-white text-xs font-medium hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-md`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{u.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500">or sign in manually</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin / institution / verifier / student"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                  <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-60 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>

            {/* Evaluator Guide Button */}
            <button
              onClick={() => setShowGuide(true)}
              className="mt-5 w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg border border-teal-500/40 text-teal-400 hover:bg-teal-500/10 text-xs font-semibold transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Evaluator Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>


        </div>
      </div>

      {/* ── Evaluator Guide Modal ── */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#001529] border border-white/10 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-[#001529] border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Evaluator Guide</h2>
                  <p className="text-xs text-slate-400">APAARIX — Demo Walkthrough</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Intro */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-200 leading-relaxed">
                  <strong className="text-blue-300">Welcome, Evaluator!</strong> APAARIX is a full-stack demo prototype for AICTE's student verification and enrolment intelligence platform. Follow the steps below to explore all major features.
                </p>
              </div>

              {/* Quick Login */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Step 1 — Quick Login</h3>
                <p className="text-sm text-slate-300 mb-3">
                  Click any of the coloured role buttons on the login screen to enter instantly (no typing required).
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(USERS).map(([key, u]) => {
                    const Icon = u.icon;
                    return (
                      <div key={key} className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r ${u.color} text-white text-xs font-medium opacity-80`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{u.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Step 2 — Platform Walkthrough</h3>
                <div className="space-y-3">
                  {GUIDE_STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div key={idx} className="flex items-start space-x-4 bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <span className="text-[11px] font-bold text-slate-500 mb-1">{String(idx + 1).padStart(2, '0')}</span>
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <Icon className={`w-4 h-4 ${step.color}`} />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-1">{step.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Module Summary */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">All 10 Modules</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Executive Dashboard', 'Institution Management', 'Student Registry',
                    'Student Data Upload', 'APAAR Verification', 'Duplicate Detection',
                    'SeatGuard Compliance', 'Student Portal', 'Digital Credentials', 'Reports & Analytics'
                  ].map((m, i) => (
                    <div key={i} className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                      <span className="text-slate-300">{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close */}
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-all"
              >
                Got it — Start Exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
