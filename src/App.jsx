import React from 'react';
import { usePortfolio } from './context/PortfolioContext';
import { AmbientCanvas } from './components/AmbientCanvas';
import { CursorGlow } from './components/CursorGlow';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Journey } from './components/Journey';
import { Skillset } from './components/Skillset';
import { Projects } from './components/Projects';
import { Certificates } from './components/Certificates';
import { BeyondData } from './components/BeyondData';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { VerticalSocialDock } from './components/SocialHandleButton';
import { AdminAuthModal } from './admin/AdminAuthModal';
import { AdminLayout } from './admin/AdminLayout';

function App() {
  const { currentView, isAdmin, activePage, data } = usePortfolio();

  if (currentView === 'admin') {
    if (!isAdmin) {
      return <AdminAuthModal />;
    }
    return <AdminLayout />;
  }

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#e4e4e7] overflow-x-hidden selection:bg-white selection:text-black flex flex-col justify-between">
      {/* Background canvas particles & interactive dark blooms */}
      <AmbientCanvas />

      {/* Interactive Cursor Glow Orb */}
      <CursorGlow />

      {/* Main Navbar with 7 sections (No public admin badges) */}
      <Navbar />

      {/* Discrete 7 Main Pages */}
      <main className="relative z-10 flex-1">
        {activePage === 'home' && <Hero key="home" />}
        {activePage === 'journey' && <Journey key="journey" />}
        {activePage === 'skillset' && <Skillset key="skillset" />}
        {activePage === 'projects' && <Projects key="projects" />}
        {activePage === 'certificates' && <Certificates key="certificates" />}
        {activePage === 'beyond-data' && <BeyondData key="beyond-data" />}
        {activePage === 'contact' && <Contact key="contact" />}
      </main>

      {/* Fixed Vertical Social Handles Dock in Lower Right Corner (For all sections except Home) */}
      {activePage !== 'home' && (
        <VerticalSocialDock socials={data.profile?.socials} />
      )}

      {/* Footer (No public admin button) */}
      <Footer />
    </div>
  );
}

export default App;