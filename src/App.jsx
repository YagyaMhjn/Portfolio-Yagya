import React from 'react';
import { usePortfolio } from './context/PortfolioContext';
import { AmbientCanvas } from './components/AmbientCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Journey } from './components/Journey';
import { Skillset } from './components/Skillset';
import { Projects } from './components/Projects';
import { Certificates } from './components/Certificates';
import { BeyondData } from './components/BeyondData';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminAuthModal } from './admin/AdminAuthModal';
import { AdminLayout } from './admin/AdminLayout';

function App() {
  const { currentView } = usePortfolio();

  if (currentView === 'admin') {
    return <AdminLayout />;
  }

  return (
    <div className="relative min-h-screen bg-[#070707] text-[#e4e4e7] overflow-x-hidden selection:bg-white selection:text-black">
      {/* Background canvas particles & dark glow */}
      <AmbientCanvas />

      {/* Main Navbar with 7 sections */}
      <Navbar />

      {/* Exact 7 Main Sections */}
      <main className="relative z-10">
        {/* 1) Home */}
        <Hero />

        {/* 2) Journey */}
        <Journey />

        {/* 3) Skillset */}
        <Skillset />

        {/* 4) Projects */}
        <Projects />

        {/* 5) Certificates */}
        <Certificates />

        {/* 6) Beyond Data (Co-curricular Achievements) */}
        <BeyondData />

        {/* 7) Contact */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Protected Admin Authentication Modal */}
      <AdminAuthModal />
    </div>
  );
}

export default App;