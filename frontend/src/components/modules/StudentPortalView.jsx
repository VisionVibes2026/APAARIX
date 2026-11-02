import React, { useState, useEffect } from 'react';
import { 
  UserSquare2, 
  GraduationCap, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  QrCode, 
  Lock, 
  Share2, 
  Clock, 
  ExternalLink,
  KeyRound
} from 'lucide-react';
import { getStudentPortalProfile, generateCredential } from '../../services/api';

export default function StudentPortalView({ onOpenCredentialVerifier }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStudentId, setActiveStudentId] = useState(1);
  const [consentList, setConsentList] = useState([]);
  const [generating, setGenerating] = useState(false);

  const fetchProfile = async (id) => {
    setLoading(true);
    try {
      const res = await getStudentPortalProfile(id);
      setProfile(res.data);
      setConsentList(res.data.consents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(activeStudentId);
  }, [activeStudentId]);

  const toggleConsent = (idx) => {
    setConsentList(prev => prev.map((c, i) => {
      if (i === idx) {
        return { ...c, status: c.status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE' };
      }
      return c;
    }));
  };

  const handleGenerateCred = async () => {
    if (!profile) return;
    setGenerating(true);
    try {
      await generateCredential(profile.student.id);
      await fetchProfile(profile.student.id);
    } catch (err) {
      alert(err.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  if (loading || !profile) {
    return <div className="p-12 text-center text-xs text-brand-text-secondary">Loading student self-service portal...</div>;
  }

  const { student, enrolments = [], verification, credential } = profile;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Student Identity Card Banner */}
      <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-gradient-to-tr from-[#001529] via-[#00284d] to-[#13a8a8] text-white p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-bold font-kpi">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold font-kpi">{student.fullName}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950 uppercase">
                  Verified Identity
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Student ID: <span className="font-mono text-white font-semibold">{student.studentId}</span> • Gender: {student.gender}
              </p>
              <p className="text-xs text-teal-300 font-mono mt-0.5">
                APAAR ID: {student.apaarId}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-right">
            <span className="text-[10px] uppercase text-slate-300 block">DigiLocker / ABC Status</span>
            <span className="text-sm font-bold text-emerald-300 flex items-center justify-end space-x-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>ACTIVE & LINKED</span>
            </span>
            <span className="text-[10px] text-slate-300 block mt-1">
              DOB: {student.dateOfBirth}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Academic Programme & Credentials */}
        <div className="md:col-span-2 space-y-6">
          {/* Active Academic Enrolments */}
          <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-brand-primary" />
              <span>Institutional Academic Enrolment History</span>
            </h3>

            <div className="space-y-3">
              {enrolments.map((enr) => (
                <div key={enr.id} className="p-4 rounded-xl border border-brand-border dark:border-dark-border bg-gray-50/60 dark:bg-dark-container/40 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-brand-primary">{enr.institution.code}</span>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white">{enr.institution.name}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {enr.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-brand-border dark:border-dark-border">
                    <div>
                      <span className="text-brand-text-secondary block">Programme:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{enr.programme.name}</span>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary block">Session Year:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{enr.academicYear}</span>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary block">Admission Quota:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{enr.admissionCategory}</span>
                    </div>
                    <div>
                      <span className="text-brand-text-secondary block">Enrolment Date:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{enr.enrolmentDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Authorized Data Sharing & Consent Manager */}
          <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-teal-600" />
                  <span>Purpose-Limited Consent & Sharing Controls</span>
                </h3>
                <p className="text-xs text-brand-text-secondary mt-0.5">
                  Manage external verification permissions granted to government bodies and employers.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {consentList.map((c, i) => (
                <div key={i} className="p-3 rounded-lg border border-brand-border dark:border-dark-border flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{c.purpose}</div>
                    <div className="text-[11px] text-brand-text-secondary">
                      Scope: {c.scope} • Granted: {c.grantedDate}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleConsent(i)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      c.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-rose-100 hover:text-rose-800'
                        : 'bg-gray-100 text-gray-600 dark:bg-dark-container dark:text-gray-400 hover:bg-emerald-100 hover:text-emerald-800'
                    }`}
                  >
                    {c.status === 'ACTIVE' ? 'Consent Active' : 'Revoked'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Digital Credential Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <QrCode className="w-4 h-4 text-brand-primary" />
              <span>Digital Enrolment Certificate</span>
            </h3>

            {credential ? (
              <div className="p-4 rounded-xl border-2 border-dashed border-brand-primary/40 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/20 dark:to-dark-card text-center space-y-3">
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg border border-gray-200 shadow-inner flex items-center justify-center">
                  {/* Dynamic simulated QR representation */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://apaarix.aicte.gov.in/verify/${credential.credentialId}`}
                    alt="Verifiable Credential QR"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-text-secondary block">
                    Credential Token
                  </span>
                  <span className="font-mono text-xs font-bold text-brand-primary">
                    {credential.credentialId}
                  </span>
                </div>

                <div className="text-[11px] text-gray-600 dark:text-gray-300">
                  Tamper-evident certificate registered with AICTE Academic Registry.
                </div>

                <button
                  onClick={() => {
                    if (onOpenCredentialVerifier) {
                      onOpenCredentialVerifier(credential.credentialId);
                    }
                  }}
                  className="w-full py-2 px-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg text-xs font-semibold shadow transition-all"
                >
                  Verify Authenticity Certificate
                </button>
              </div>
            ) : (
              <div className="p-6 text-center space-y-3 border border-brand-border dark:border-dark-border rounded-xl">
                <QrCode className="w-10 h-10 text-gray-400 mx-auto" />
                <p className="text-xs text-brand-text-secondary">No digital credential issued yet.</p>
                <button
                  onClick={handleGenerateCred}
                  disabled={generating}
                  className="px-3 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-semibold"
                >
                  {generating ? 'Issuing...' : 'Issue Digital Credential'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

