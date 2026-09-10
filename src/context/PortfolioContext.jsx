import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialPortfolioData } from '../data/initialData';

const PortfolioContext = createContext(null);
const STORAGE_KEY = 'yagya_portfolio_data_v2';
const AUTH_KEY = 'yagya_portfolio_admin_auth';
const PASSWORD_KEY = 'yagya_portfolio_admin_password';

const getAdminPassword = () => {
  try {
    const customPass = localStorage.getItem(PASSWORD_KEY);
    if (customPass) return customPass;
  } catch (e) {
    console.error('Failed to read password from localStorage', e);
  }
  return import.meta.env.VITE_ADMIN_PASSWORD || 'Yagy@1605';
};

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialPortfolioData,
          ...parsed,
          profile: {
            ...initialPortfolioData.profile,
            ...(parsed.profile || {}),
            socials: parsed.profile?.socials || initialPortfolioData.profile.socials || []
          },
          projects: (parsed.projects || initialPortfolioData.projects).map((p) => {
            const initP = initialPortfolioData.projects.find((ip) => ip.id === p.id);
            return {
              ...initP,
              ...p,
              media: p.media !== undefined ? p.media : (initP?.media || '')
            };
          }),
          certificates: (parsed.certificates || initialPortfolioData.certificates).map((c) => {
            const initC = initialPortfolioData.certificates.find((ic) => ic.id === c.id);
            return {
              ...initC,
              ...c,
              media: c.media !== undefined ? c.media : (initC?.media || '')
            };
          }),
          beyondData: (parsed.beyondData || initialPortfolioData.beyondData).map((b) => {
            const initB = initialPortfolioData.beyondData.find((ib) => ib.id === b.id);
            return {
              ...initB,
              ...b,
              media: b.media !== undefined ? b.media : (initB?.media || '')
            };
          }),
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

  const [currentView, setCurrentView] = useState(() => {
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (pathname.startsWith('/admin') || hash.startsWith('#admin') || search.includes('admin')) ? 'admin' : 'portfolio';
  });

  // Dedicated Active Page State: 'home' | 'journey' | 'skillset' | 'projects' | 'certificates' | 'beyond-data' | 'contact'
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'journey', 'skillset', 'projects', 'certificates', 'beyond-data', 'contact'];
    return validPages.includes(hash) ? hash : 'home';
  });

  // URL routing synchronization (Popstate and Hashchange)
  // Default Site Theme (Configured via Admin -> Settings & Display, defaults to 'dark')
  const [defaultTheme, setDefaultThemeState] = useState(() => {
    try {
      const savedDefault = localStorage.getItem('yagya_portfolio_default_theme');
      if (savedDefault === 'light' || savedDefault === 'dark') return savedDefault;
    } catch (e) {}
    return 'dark'; // Dark mode is fixed as default
  });

  // Active Session Theme (Falls back to defaultTheme)
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('yagya_portfolio_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (e) {}
    try {
      const savedDefault = localStorage.getItem('yagya_portfolio_default_theme');
      if (savedDefault === 'light' || savedDefault === 'dark') return savedDefault;
    } catch (e) {}
    return 'dark';
  });

  const updateDefaultTheme = (newDefault) => {
    if (newDefault !== 'dark' && newDefault !== 'light') return;
    setDefaultThemeState(newDefault);
    try {
      localStorage.setItem('yagya_portfolio_default_theme', newDefault);
    } catch (e) {}
    // Also apply to current session theme
    setTheme(newDefault);
    try {
      localStorage.setItem('yagya_portfolio_theme', newDefault);
    } catch (e) {}
  };

  const [themeTransitioning, setThemeTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState(null);

  const toggleTheme = () => {
    if (themeTransitioning) return;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTransitionTarget(nextTheme);
    setThemeTransitioning(true);

    // Halfway through the 0.95s diagonal sweep (440ms), flip the theme class under 100% solid curtain coverage
    setTimeout(() => {
      setTheme(nextTheme);
    }, 440);

    // Conclude the 0.95s sweep after 950ms
    setTimeout(() => {
      setThemeTransitioning(false);
      setTransitionTarget(null);
    }, 950);
  };

  // Section Transition Loader Management (Enabled / Disabled via Admin)
  const [enableLoader, setEnableLoaderState] = useState(() => {
    try {
      const saved = localStorage.getItem('yagya_portfolio_enable_loader');
      if (saved !== null) return saved === 'true';
    } catch (e) {}
    return true;
  });

  const toggleLoaderEnabled = () => {
    setEnableLoaderState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('yagya_portfolio_enable_loader', String(next));
      } catch (e) {}
      return next;
    });
  };

  const setEnableLoader = (val) => {
    setEnableLoaderState(val);
    try {
      localStorage.setItem('yagya_portfolio_enable_loader', String(val));
    } catch (e) {}
  };

  useEffect(() => {
    try {
      localStorage.setItem('yagya_portfolio_theme', theme);
    } catch (e) {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // URL routing synchronization (Popstate and Hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (pathname.startsWith('/admin') || hash.startsWith('#admin') || search.includes('admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('portfolio');
        const cleanHash = window.location.hash.replace('#', '');
        const validPages = ['home', 'journey', 'skillset', 'projects', 'certificates', 'beyond-data', 'contact'];
        if (validPages.includes(cleanHash)) {
          setActivePage(cleanHash);
        }
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (currentView === 'portfolio') {
      window.location.hash = activePage;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activePage, currentView]);

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
    const expectedPassword = getAdminPassword();
    if (password === expectedPassword) {
      setIsAdmin(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      setCurrentView('admin');
      return { success: true };
    }
    return { success: false, error: 'Incorrect administrator password.' };
  };

  const changePassword = (oldPassword, newPassword, confirmPassword) => {
    const currentPassword = getAdminPassword();
    if (oldPassword !== currentPassword) {
      return { success: false, error: 'Current password is incorrect.' };
    }
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, error: 'New password must be at least 4 characters long.' };
    }
    if (newPassword !== confirmPassword) {
      return { success: false, error: 'New passwords do not match. Please verify.' };
    }
    try {
      localStorage.setItem(PASSWORD_KEY, newPassword);
      return { success: true, message: 'Password successfully updated! Use your new password on next login.' };
    } catch (e) {
      return { success: false, error: 'Failed to update password in browser storage.' };
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(AUTH_KEY);
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
        theme,
        defaultTheme,
        updateDefaultTheme,
        toggleTheme,
        themeTransitioning,
        transitionTarget,
        enableLoader,
        toggleLoaderEnabled,
        setEnableLoader,
        isAdmin,
        currentView,
        setCurrentView,
        activePage,
        setActivePage,
        loginAdmin,
        logoutAdmin,
        changePassword,
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