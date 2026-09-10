import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialPortfolioData } from '../data/initialData';

const PortfolioContext = createContext(null);
const STORAGE_KEY = 'yagya_portfolio_data_v2';
const AUTH_KEY = 'yagya_portfolio_admin_auth';

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialPortfolioData,
          ...parsed,
          profile: { ...initialPortfolioData.profile, ...(parsed.profile || {}) },
          certificates: parsed.certificates || initialPortfolioData.certificates,
          beyondData: parsed.beyondData || initialPortfolioData.beyondData,
        };
      }
    } catch (e) {
      console.error('Failed to load portfolio data from localStorage', e);
    }
    return initialPortfolioData;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [currentView, setCurrentView] = useState('portfolio'); // 'portfolio' | 'admin'

  // Dedicated Active Page State: 'home' | 'journey' | 'skillset' | 'projects' | 'certificates' | 'beyond-data' | 'contact'
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'journey', 'skillset', 'projects', 'certificates', 'beyond-data', 'contact'];
    return validPages.includes(hash) ? hash : 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['home', 'journey', 'skillset', 'projects', 'certificates', 'beyond-data', 'contact'];
      if (validPages.includes(hash)) {
        setActivePage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.location.hash = activePage;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Admin routing check
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasAdminQuery = urlParams.has('admin');
    const isAdminPath = window.location.pathname.startsWith('/admin');

    if (hasAdminQuery || isAdminPath) {
      if (isAdmin) {
        setCurrentView('admin');
      } else {
        setShowAdminModal(true);
      }
    }
  }, [isAdmin]);

  const saveData = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return next;
    });
  };

  const loginAdmin = (password) => {
    const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'Yagy@1605';
    if (password === expectedPassword) {
      setIsAdmin(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      setShowAdminModal(false);
      setCurrentView('admin');
      return { success: true };
    }
    return { success: false, error: 'Incorrect administrator password.' };
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(AUTH_KEY);
    setCurrentView('portfolio');
  };

  // Profile
  const updateProfile = (profileFields) => {
    saveData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileFields }
    }));
  };

  // Projects
  const addProject = (project) => {
    const newProject = {
      ...project,
      id: 'p_' + Date.now(),
      year: project.year || new Date().getFullYear().toString()
    };
    saveData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }));
  };

  const updateProject = (id, updatedFields) => {
    saveData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    }));
  };

  const deleteProject = (id) => {
    saveData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  // Skills
  const addSkill = (skill) => {
    const newSkill = { ...skill, id: 's_' + Date.now() };
    saveData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const deleteSkill = (id) => {
    saveData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id)
    }));
  };

  const addCategory = (categoryName) => {
    if (!categoryName || data.categories.includes(categoryName)) return;
    saveData((prev) => ({
      ...prev,
      categories: [...prev.categories, categoryName]
    }));
  };

  const deleteCategory = (categoryName) => {
    if (categoryName === 'All') return;
    saveData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== categoryName),
      skills: prev.skills.filter((s) => s.category !== categoryName)
    }));
  };

  // Journey / Timeline
  const addTimeline = (entry) => {
    const newEntry = { ...entry, id: 't_' + Date.now() };
    saveData((prev) => ({
      ...prev,
      timeline: [newEntry, ...prev.timeline]
    }));
  };

  const updateTimeline = (id, updatedFields) => {
    saveData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    }));
  };

  const deleteTimeline = (id) => {
    saveData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((t) => t.id !== id)
    }));
  };

  // Certificates
  const addCertificate = (cert) => {
    const newCert = {
      ...cert,
      id: 'c_' + Date.now(),
      skills: typeof cert.skills === 'string' ? cert.skills.split(',').map((s) => s.trim()).filter(Boolean) : (cert.skills || [])
    };
    saveData((prev) => ({
      ...prev,
      certificates: [newCert, ...(prev.certificates || [])]
    }));
  };

  const updateCertificate = (id, updatedFields) => {
    saveData((prev) => ({
      ...prev,
      certificates: (prev.certificates || []).map((c) =>
        c.id === id
          ? {
              ...c,
              ...updatedFields,
              skills: typeof updatedFields.skills === 'string'
                ? updatedFields.skills.split(',').map((s) => s.trim()).filter(Boolean)
                : (updatedFields.skills || c.skills || [])
            }
          : c
      )
    }));
  };

  const deleteCertificate = (id) => {
    saveData((prev) => ({
      ...prev,
      certificates: (prev.certificates || []).filter((c) => c.id !== id)
    }));
  };

  // Beyond Data (Co-curricular achievements)
  const addBeyondData = (item) => {
    const newItem = { ...item, id: 'bd_' + Date.now() };
    saveData((prev) => ({
      ...prev,
      beyondData: [newItem, ...(prev.beyondData || [])]
    }));
  };

  const updateBeyondData = (id, updatedFields) => {
    saveData((prev) => ({
      ...prev,
      beyondData: (prev.beyondData || []).map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    }));
  };

  const deleteBeyondData = (id) => {
    saveData((prev) => ({
      ...prev,
      beyondData: (prev.beyondData || []).filter((b) => b.id !== id)
    }));
  };

  // Visitor messages
  const addMessage = (message) => {
    const newMsg = {
      ...message,
      id: 'm_' + Date.now(),
      date: new Date().toLocaleString(),
      read: false
    };
    saveData((prev) => ({
      ...prev,
      messages: [newMsg, ...(prev.messages || [])]
    }));
  };

  const deleteMessage = (id) => {
    saveData((prev) => ({
      ...prev,
      messages: (prev.messages || []).filter((m) => m.id !== id)
    }));
  };

  const markMessageRead = (id) => {
    saveData((prev) => ({
      ...prev,
      messages: (prev.messages || []).map((m) => (m.id === id ? { ...m, read: true } : m))
    }));
  };

  const resetToDefault = () => {
    saveData(initialPortfolioData);
  };

  const exportData = () => {
    return JSON.stringify(data, null, 2);
  };

  const importData = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      saveData(parsed);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Invalid JSON format.' };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isAdmin,
        showAdminModal,
        setShowAdminModal,
        currentView,
        setCurrentView,
        activePage,
        setActivePage,
        loginAdmin,
        logoutAdmin,
        updateProfile,
        addProject,
        updateProject,
        deleteProject,
        addSkill,
        deleteSkill,
        addCategory,
        deleteCategory,
        addTimeline,
        updateTimeline,
        deleteTimeline,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        addBeyondData,
        updateBeyondData,
        deleteBeyondData,
        addMessage,
        deleteMessage,
        markMessageRead,
        resetToDefault,
        exportData,
        importData
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};