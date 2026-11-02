import React from 'react';
import { Sun, Moon, UserCheck, Shield, Building2, GraduationCap } from 'lucide-react';

export default function Header({ currentTab, darkMode, setDarkMode, activeRole, setActiveRole }) {
  const getTabTitle = (tab) => {
    switch (tab) {
      case 'dashboard': return 'AICTE Executive Command Dashboard';
      case 'institutions': return 'Institutional Registry & Approvals';
      case 'students': return 'National Student Registry';
      case 'upload': return 'Student Batch Data Ingestion Engine';
      case 'verification': return 'APAAR ID Identity Verification Engine';
      case 'duplicates': return 'Cross-Institution Duplicate Detection';
      case 'compliance': return 'SeatGuard Statutory Intake Monitoring';
      case 'student-portal': return 'Student Self-Service Credential Portal';
      case 'credentials': return 'Digitally Verifiable Enrolment Credentials';
      case 'reports': return 'Regulatory Reports & Enrolment Analytics';
      default: return 'AICTE National Platform';
    }
  };

  const roles = [
    { id: 'aicte_admin', name: 'AICTE National Admin' },
    { id: 'inst_admin', name: 'Institution Admin (DTU)' },
    { id: 'student', name: 'Student (Aarav Sharma)' },
    { id: 'verifier', name: 'Third-Party Verifier' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-dark-card border-b border-brand-border dark:border-dark-border px-6 py-3 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Breadcrumb & Title */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-brand-text-secondary dark:text-dark-text-secondary">
            <span>APAARIX</span>
            <span>/</span>
            <span className="capitalize text-brand-primary dark:text-blue-400 font-medium">
              {currentTab.replace('-', ' ')}
            </span>
          </div>
          <h1 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
            {getTabTitle(currentTab)}
          </h1>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          {/* Role Switcher */}
          <div className="flex items-center bg-gray-100 dark:bg-dark-container p-1 rounded-lg border border-brand-border dark:border-dark-border">
            <span className="text-[11px] font-semibold text-brand-text-secondary dark:text-dark-text-secondary px-2 hidden md:inline">
              Role:
            </span>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none cursor-pointer py-0.5 px-1 rounded"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id} className="dark:bg-dark-card text-gray-900 dark:text-white">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg border border-brand-border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-container text-brand-text-secondary dark:text-dark-text-secondary transition-all"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Profile Chip */}
          <div className="flex items-center space-x-2 pl-2 border-l border-brand-border dark:border-dark-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-primary to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              AI
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
                AICTE Central Ops
              </span>
              <span className="text-[10px] text-brand-text-secondary dark:text-dark-text-secondary">
                Govt. of India
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
