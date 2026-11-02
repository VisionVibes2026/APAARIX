import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  UploadCloud, 
  ShieldCheck, 
  CopyCheck, 
  Gauge, 
  UserSquare2, 
  QrCode, 
  BarChart3, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertTriangle
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  collapsed, 
  setCollapsed, 
  duplicateCount = 0, 
  violationCount = 0,
  onResetDemo,
  resetting
}) {
  const menuItems = [
    { id: 'dashboard', label: 'AICTE Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'institutions', label: 'Institution Portal', icon: Building2, badge: null },
    { id: 'students', label: 'Student Registry', icon: Users, badge: null },
    { id: 'upload', label: 'Student Data Upload', icon: UploadCloud, badge: null },
    { id: 'verification', label: 'APAAR Verification', icon: ShieldCheck, badge: null },
    { id: 'duplicates', label: 'Duplicate Detection', icon: CopyCheck, badge: duplicateCount > 0 ? duplicateCount : null, badgeColor: 'bg-amber-500' },
    { id: 'compliance', label: 'SeatGuard Compliance', icon: Gauge, badge: violationCount > 0 ? violationCount : null, badgeColor: 'bg-rose-500' },
    { id: 'student-portal', label: 'Student Portal', icon: UserSquare2, badge: null },
    { id: 'credentials', label: 'Digital Credentials', icon: QrCode, badge: null },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: null },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen z-40 bg-[#001529] text-slate-300 transition-all duration-300 flex flex-col justify-between border-r border-slate-800 shadow-xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding Section */}
      <div>
        <div className="h-16 flex items-center px-4 border-b border-slate-800/80 bg-[#001222] justify-between">
          {!collapsed ? (
            <div className="flex items-center space-x-2 overflow-hidden">
              <img
                src="/apaarix-logo.jpg"
                alt="APAARIX"
                className="h-9 w-auto object-contain rounded-md bg-white/90 px-1 py-0.5 shadow"
              />
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <img
                src="/apaarix-logo.jpg"
                alt="APAARIX"
                className="h-8 w-8 object-contain rounded-md bg-white/90 shadow"
              />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {!collapsed ? 'Core Platform' : '•••'}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-[#1677ff] text-white font-semibold shadow-md shadow-blue-900/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                } ${collapsed ? 'justify-center' : 'justify-between'}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Badge Indicator */}
                {collapsed && item.badge && (
                  <span className={`absolute top-1.5 right-2 w-2 h-2 rounded-full ${item.badgeColor} ring-2 ring-[#001529]`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls & Reset Demo Data */}
      <div className="p-3 border-t border-slate-800/80 bg-[#001222]/90 space-y-2">
        <button
          onClick={onResetDemo}
          disabled={resetting}
          title="Reset Synthetic Demo Dataset to clean state"
          className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all shadow-sm ${
            resetting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RotateCcw className={`w-3.5 h-3.5 text-teal-400 ${resetting ? 'animate-spin' : ''}`} />
          {!collapsed && <span>{resetting ? 'Resetting...' : 'Reset Demo Data'}</span>}
        </button>

        {!collapsed && (
          <div className="px-2 pt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>AICTE Regulatory Portal</span>
            <span className="font-mono text-teal-400">v1.2.0</span>
          </div>
        )}
      </div>
    </aside>
  );
}

