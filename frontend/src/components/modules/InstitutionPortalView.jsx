import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Phone, 
  GraduationCap, 
  ExternalLink,
  X,
  Gauge
} from 'lucide-react';
import { getInstitutions, getInstitutionDetail } from '../../services/api';

export default function InstitutionPortalView() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedInst, setSelectedInst] = useState(null);
  const [instDetail, setInstDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const res = await getInstitutions({
        search: search.trim() || undefined,
        state: selectedState !== 'ALL' ? selectedState : undefined
      });
      setInstitutions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, [search, selectedState]);

  const openDetail = async (inst) => {
    setSelectedInst(inst);
    setDetailLoading(true);
    try {
      const res = await getInstitutionDetail(inst.id);
      setInstDetail(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const states = ['ALL', 'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Punjab', 'Telangana'];

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-4 ant-card-shadow flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-brand-text-secondary dark:text-dark-text-secondary" />
          <input
            type="text"
            placeholder="Search by college name, code, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-brand-text-secondary">State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none"
          >
            {states.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All States' : s}</option>)}
          </select>
        </div>
      </div>

      {/* Institutions Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-brand-text-secondary">Loading institutions directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {institutions.map((inst) => (
            <div
              key={inst.id}
              onClick={() => openDetail(inst)}
              className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow hover:border-brand-primary/60 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-brand-border dark:border-dark-border">
                  <span className="font-mono text-xs font-bold text-brand-primary">{inst.code}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    inst.complianceScore >= 95 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    inst.complianceScore >= 90 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {inst.complianceScore}% Compliance
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-bold text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors">
                  {inst.name}
                </h3>

                <div className="mt-1 flex items-center space-x-1.5 text-xs text-brand-text-secondary dark:text-dark-text-secondary">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{inst.city}, {inst.state}</span>
                  <span>•</span>
                  <span>{inst.institutionType}</span>
                </div>

                {/* Capacity Metric */}
                <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-dark-container/50 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-text-secondary">Enrolled vs Approved:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {inst.enrolmentCount} / {inst.approvedIntake}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-brand-primary h-full rounded-full" 
                      style={{ width: `${Math.min(inst.seatUtilization || 1, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border dark:border-dark-border flex items-center justify-between text-xs text-brand-primary font-medium">
                <span>View Campus Programmes</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-Over Drawer for Institution Detail */}
      {selectedInst && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white dark:bg-dark-card h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border dark:border-dark-border">
              <div>
                <span className="text-xs font-mono font-bold text-brand-primary">{selectedInst.code}</span>
                <h2 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{selectedInst.name}</h2>
              </div>
              <button
                onClick={() => setSelectedInst(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-container text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="p-12 text-center text-xs text-brand-text-secondary">Loading institutional profile...</div>
            ) : instDetail ? (
              <div className="space-y-6 text-xs">
                {/* Contact & Location Info */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-dark-container rounded-xl">
                  <div>
                    <span className="text-brand-text-secondary block">Location:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{instDetail.institution.city}, {instDetail.institution.state}</span>
                  </div>
                  <div>
                    <span className="text-brand-text-secondary block">Category:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{instDetail.institution.institutionType}</span>
                  </div>
                  <div>
                    <span className="text-brand-text-secondary block">Official Email:</span>
                    <span className="font-semibold text-brand-primary truncate block">{instDetail.institution.contactEmail}</span>
                  </div>
                  <div>
                    <span className="text-brand-text-secondary block">Phone:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{instDetail.institution.contactPhone}</span>
                  </div>
                </div>

                {/* Approved Programmes Table */}
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Approved Academic Programmes</h4>
                  <div className="border border-brand-border dark:border-dark-border rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100 dark:bg-dark-container font-semibold text-brand-text-secondary">
                        <tr>
                          <th className="p-2.5">Code</th>
                          <th className="p-2.5">Programme</th>
                          <th className="p-2.5">Approved</th>
                          <th className="p-2.5">Admitted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border dark:divide-dark-border">
                        {instDetail.programmes.map((p) => (
                          <tr key={p.id}>
                            <td className="p-2.5 font-mono text-brand-primary">{p.code}</td>
                            <td className="p-2.5 font-medium text-gray-900 dark:text-white">{p.name}</td>
                            <td className="p-2.5 font-semibold text-gray-700 dark:text-gray-300">{p.approvedIntake}</td>
                            <td className="p-2.5 font-bold text-gray-900 dark:text-white">{p.enrolledCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Compliance Violations if any */}
                {instDetail.violations && instDetail.violations.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm text-rose-600 mb-2">Recorded SeatGuard Violations</h4>
                    <div className="space-y-2">
                      {instDetail.violations.map((v) => (
                        <div key={v.id} className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg">
                          <div className="flex justify-between font-bold text-rose-700 dark:text-rose-400">
                            <span>{v.programme ? v.programme.name : 'Intake'}</span>
                            <span className="uppercase">{v.severity}</span>
                          </div>
                          <p className="mt-1 text-gray-600 dark:text-gray-300">{v.notes}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

