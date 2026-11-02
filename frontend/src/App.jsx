import React, { useState, useEffect } from 'react';
import Login from './components/auth/Login';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardView from './components/modules/DashboardView';
import InstitutionPortalView from './components/modules/InstitutionPortalView';
import StudentRegistryView from './components/modules/StudentRegistryView';
import StudentUploadView from './components/modules/StudentUploadView';
import ApaarVerificationView from './components/modules/ApaarVerificationView';
import DuplicateDetectionView from './components/modules/DuplicateDetectionView';
import SeatGuardComplianceView from './components/modules/SeatGuardComplianceView';
import StudentPortalView from './components/modules/StudentPortalView';
import DigitalCredentialsView from './components/modules/DigitalCredentialsView';
import ReportsAnalyticsView from './components/modules/ReportsAnalyticsView';
import {
  getDashboardMetrics,
  runDuplicateScan,
  runBatchVerification,
  resetDemoData,
} from './services/api';

export default function App() {
  // ---------- All state hooks at top level ----------
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState('aicte_admin');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('apaarix_theme') === 'dark');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [targetCredentialId, setTargetCredentialId] = useState('');

  // ---------- Dark mode effect ----------
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('apaarix_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('apaarix_theme', 'light');
    }
  }, [darkMode]);

  // ---------- Fetch metrics ----------
  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await getDashboardMetrics();
      setMetrics(res.data);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMetrics();
  }, [user]);

  // ---------- Role navigation ----------
  useEffect(() => {
    if (activeRole === 'student') setCurrentTab('student-portal');
    else if (activeRole === 'inst_admin') setCurrentTab('institutions');
    else if (activeRole === 'verifier') setCurrentTab('credentials');
    else if (activeRole === 'aicte_admin') setCurrentTab('dashboard');
  }, [activeRole]);

  // ---------- Login handler ----------
  const handleLogin = (payload) => {
    setUser({ username: payload.username, role: payload.role });
    setActiveRole(payload.role);
  };

  // ---------- Action handlers ----------
  const handleRunDuplicateScan = async () => {
    setScanning(true);
    try {
      const res = await runDuplicateScan();
      alert(`Sweep complete! Scanned ${res.data.totalEnrolmentsScanned} enrolments.`);
      fetchMetrics();
    } catch (err) {
      alert(err.message || 'Duplicate scan failed');
    } finally {
      setScanning(false);
    }
  };

  const handleBatchVerify = async () => {
    setVerifying(true);
    try {
      const res = await runBatchVerification();
      alert(`Processed ${res.data.processedCount} records. Newly verified: ${res.data.newlyVerifiedCount}`);
      fetchMetrics();
    } catch (err) {
      alert(err.message || 'Batch verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm('Reset all demo synthetic records to initial state?')) return;
    setResetting(true);
    try {
      await resetDemoData();
      alert('Demo dataset reset successfully!');
      fetchMetrics();
      window.location.reload();
    } catch (err) {
      alert(err.message || 'Reset failed');
    } finally {
      setResetting(false);
    }
  };

  const handleSelectStudentForCredential = (studentId) => {
    setTargetCredentialId(`CRD-2024-000${studentId}`);
    setCurrentTab('credentials');
  };

  // ---------- Show login if not authenticated ----------
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // ---------- Main app UI ----------
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg text-brand-text dark:text-dark-text transition-colors duration-200 flex">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        duplicateCount={metrics?.duplicateAlerts || 0}
        violationCount={metrics?.openViolations || 0}
        onResetDemo={handleResetDemo}
        resetting={resetting}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Header
          currentTab={currentTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          collapsed={collapsed}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              loading={loading}
              onNavigate={setCurrentTab}
              onRunDuplicateScan={handleRunDuplicateScan}
              onBatchVerify={handleBatchVerify}
              scanning={scanning}
              verifying={verifying}
            />
          )}

          {currentTab === 'institutions' && <InstitutionPortalView />}

          {currentTab === 'students' && (
            <StudentRegistryView onSelectStudentForCredential={handleSelectStudentForCredential} />
          )}

          {currentTab === 'upload' && (
            <StudentUploadView
              onUploadComplete={() => {
                fetchMetrics();
                setCurrentTab('students');
              }}
            />
          )}

          {currentTab === 'verification' && <ApaarVerificationView />}

          {currentTab === 'duplicates' && <DuplicateDetectionView />}

          {currentTab === 'compliance' && <SeatGuardComplianceView />}

          {currentTab === 'student-portal' && (
            <StudentPortalView
              onOpenCredentialVerifier={(credId) => {
                setTargetCredentialId(credId);
                setCurrentTab('credentials');
              }}
            />
          )}

          {currentTab === 'credentials' && (
            <DigitalCredentialsView initialCredentialId={targetCredentialId} />
          )}

          {currentTab === 'reports' && <ReportsAnalyticsView />}
        </main>

        <footer className="border-t border-brand-border dark:border-dark-border py-4 px-6 text-center text-[11px] text-brand-text-secondary dark:text-dark-text-secondary bg-white/50 dark:bg-dark-card/50">
          <p className="font-semibold text-gray-700 dark:text-gray-300">
            APAARIX — AICTE Student Verification &amp; Enrolment Intelligence Platform
          </p>
          <p className="mt-0.5">
            National Academic Depository &amp; Regulatory Compliance Framework • Synthetic Research &amp; Prototype Implementation
          </p>
        </footer>
      </div>
    </div>
  );
}
