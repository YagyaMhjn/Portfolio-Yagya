import React from 'react';
import { usePortfolio } from './context/PortfolioContext';
import { AmbientCanvas } from './components/AmbientCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Journey } from './components/Journey';
import { Skillset } from './components/Skillset';
import { Projects } from './components/Projects';
import { BlogCertificates } from './components/BlogCertificates';
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

      {/* Main Navbar */}
      <Navbar />

      {/* Main Sections */}
      <main className="relative z-10">
        <Hero />
        <Journey />
        <Skillset />
        <Projects />
        <BlogCertificates />
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
