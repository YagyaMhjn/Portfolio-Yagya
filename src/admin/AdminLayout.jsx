import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  User,
  FolderGit2,
  Cpu,
  Milestone,
  Award,
  Sparkles,
  MessageSquare,
  Database,
  KeyRound,
  Shield,
  Sliders,
  ArrowLeft,
  LogOut,
  Check,
} from 'lucide-react';
import { AdminProfile } from './AdminProfile';
import { AdminProjects } from './AdminProjects';
import { AdminSkills } from './AdminSkills';
import { AdminJourney } from './AdminJourney';
import { AdminCertificates } from './AdminCertificates';
import { AdminBeyondData } from './AdminBeyondData';
import { AdminMessages } from './AdminMessages';
import { AdminBackup } from './AdminBackup';
import { AdminSecurity } from './AdminSecurity';
import { AdminSettings } from './AdminSettings';

export const AdminLayout = () => {
  const { data, setCurrentView, logoutAdmin } = usePortfolio();
  const [activeTab, setActiveTab] = useState('profile');
  const [saveToast, setSaveToast] = useState(false);

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-200">
      {/* Top Banner */}
      <header className="border-b border-white/[0.08] bg-[#0c0c0f] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              try {
                window.history.pushState(null, '', '/');
              } catch (e) {}
              setCurrentView('portfolio');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Return to Portfolio</span>
          </button>
          <span className="text-zinc-600">|</span>
          <span className="text-sm font-bold text-white font-mono tracking-wider">
            ✦ CONTROL PANEL
          </span>
        </div>

        <div className="flex items-center gap-3">
          {saveToast && (
            <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <Check size={12} /> Changes Saved Instantly
            </span>
          )}

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-400 hover:bg-red-900/40 transition-colors"
          >
            <LogOut size={13} />
            <span>Lock Session</span>
          </button>
        </div>
      </header>

      {/* Main Admin Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="md:col-span-3 space-y-1.5">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest px-3 py-1">
              MANAGEMENT MODULES
            </div>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'profile' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <User size={15} /> <span>Profile & Bio</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'projects' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <FolderGit2 size={15} /> <span>Projects ({data.projects?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'skills' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Cpu size={15} /> <span>Skillset ({data.skills?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'timeline' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Milestone size={15} /> <span>Journey Timeline</span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'certificates' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Award size={15} /> <span>Certificates ({data.certificates?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('beyondData')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'beyondData' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Sparkles size={15} /> <span>Beyond Data ({data.beyondData?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'messages' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare size={15} /> <span>Visitor Messages</span>
              </div>
              {data.messages?.filter((m) => !m.read).length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {data.messages.filter((m) => !m.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'settings' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Sliders size={15} /> <span>Settings & Display</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'security' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Shield size={15} /> <span>Security & Password</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'backup' ? 'bg-white text-black font-bold shadow' : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Database size={15} /> <span>Database & Backup</span>
            </button>
          </div>

          {/* Content Pane */}
          <div className="md:col-span-9">
            {activeTab === 'profile' && <AdminProfile triggerToast={triggerToast} />}
            {activeTab === 'projects' && <AdminProjects triggerToast={triggerToast} />}
            {activeTab === 'skills' && <AdminSkills triggerToast={triggerToast} />}
            {activeTab === 'timeline' && <AdminJourney triggerToast={triggerToast} />}
            {activeTab === 'certificates' && <AdminCertificates triggerToast={triggerToast} />}
            {activeTab === 'beyondData' && <AdminBeyondData triggerToast={triggerToast} />}
            {activeTab === 'messages' && <AdminMessages />}
            {activeTab === 'settings' && <AdminSettings triggerToast={triggerToast} />}
            {activeTab === 'security' && <AdminSecurity triggerToast={triggerToast} />}
            {activeTab === 'backup' && <AdminBackup />}
          </div>

        </div>
      </div>
    </div>
  );
};