import { useState, useEffect, ReactNode } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiDollarSign,
  FiTrendingUp,
  FiFileText,
  FiBarChart,
  FiMap,
  FiPackage,
  FiTruck,
  FiCreditCard,
  FiPieChart,
  FiLink,
  FiLogOut,
  FiShield
} from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';
import './Layout.css';

interface LayoutProps {
  // Layout now uses Outlet for nested routing
}

interface MenuItem {
  id: string;
  title: string;
  icon: any;
  path: string;
  badge?: number;
}

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', title: t('nav.dashboard'), icon: FiHome, path: '/dashboard' },
    { id: 'authentication', title: t('nav.authentication'), icon: FiShield, path: '/authentication', badge: 3 },
    { id: 'company', title: t('nav.company'), icon: FiSettings, path: '/company', badge: 4 },
    { id: 'employees', title: t('nav.employees'), icon: FiUsers, path: '/employees', badge: 5 },
    { id: 'suppliers', title: t('nav.suppliers'), icon: FiTruck, path: '/suppliers', badge: 6 },
    { id: 'cash-flow', title: t('nav.cashFlow'), icon: FiTrendingUp, path: '/cash-flow', badge: 7 },
    { id: 'accounts-payable', title: t('nav.accountsPayable'), icon: FiCreditCard, path: '/accounts-payable', badge: 8 },
    { id: 'accounts-receivable', title: t('nav.accountsReceivable'), icon: FiDollarSign, path: '/accounts-receivable', badge: 9 },
    { id: 'construction-materials', title: t('nav.constructionMaterials'), icon: FiPackage, path: '/construction-materials', badge: 10 },
    { id: 'employee-map', title: t('nav.employeeMap'), icon: FiMap, path: '/employee-map', badge: 11 },
    { id: 'financial-reports', title: t('nav.financialReports'), icon: FiFileText, path: '/financial-reports', badge: 12 },
    { id: 'data-analytics', title: t('nav.dataAnalytics'), icon: FiBarChart, path: '/data-analytics', badge: 13 },
    { id: 'advanced-financial', title: t('nav.advancedFinancial'), icon: FiPieChart, path: '/advanced-financial', badge: 14 },
    { id: 'integrations', title: t('nav.integrations'), icon: FiLink, path: '/integrations', badge: 15 }
  ];

  const languageOptions = [
    { code: 'en', name: t('language.english'), flag: '🇺🇸' },
    { code: 'pt', name: t('language.portuguese'), flag: '🇧🇷' },
    { code: 'zh', name: t('language.chinese'), flag: '🇨🇳' }
  ];

  const handleMenuClick = (path: string) => navigate(path);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLanguageChange = (code: string) => i18n.changeLanguage(code);

  const isActiveRoute = (path: string) => location.pathname === path;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🏗️</span>
            {isSidebarOpen && (
              <div className="logo-text">
                <h2>Financial Recovery</h2>
                <p>{t('nav.systemOverview')}</p>
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
            ☰
          </button>
        </div>

        {isSidebarOpen && user && (
          <div className="user-info">
            <div className="user-avatar">
              {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.roles?.join(', ') || 'USER'}</p>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.path)}
                  title={item.title}
                >
                  <item.icon className="nav-icon" />
                  {isSidebarOpen && (
                    <>
                      <span className="nav-text">{item.title}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {isSidebarOpen && (
          <div className="sidebar-language">
            <label className="language-label">🌐 {t('language.select')}</label>
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-dropdown"
            >
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.flag} {option.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout} title={t('auth.logout')}>
            <FiLogOut className="logout-icon" />
            {isSidebarOpen && <span>{t('auth.logout')}</span>}
          </button>
        </div>
      </aside>

      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="mobile-menu-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
              ☰
            </button>
            <h1 className="page-title">
              {menuItems.find(item => item.path === location.pathname)?.title || t('nav.dashboard')}
            </h1>
          </div>
          <div className="top-bar-right">
            <div className="current-date">
              {new Date().toLocaleDateString(
                i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'zh' ? 'zh-CN' : 'en-US',
                { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </div>
            <div className="user-menu">
              <div className="user-avatar-small">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>
        </header>

        <div className="page-content">
          {children ?? <Outlet />}
        </div>
      </main>

      {isSidebarOpen && <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default Layout;
