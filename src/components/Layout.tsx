import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiDollarSign,
  FiTruck,
  FiCreditCard,
  FiFileText,
  FiBarChart,
  FiTrendingUp,
  FiLink,
  FiLogOut,
  FiMenu,
  FiX,
  FiShield,
  FiMap
} from 'react-icons/fi'

interface LayoutProps {
  children: React.ReactNode
}

/**
 * Layout principal com menu lateral responsivo e navegação otimizada
 * Main layout with responsive sidebar and optimized navigation
 */
const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Verificar preferência do usuário para o menu lateral
  // Check user preference for sidebar
  useEffect(() => {
    const savedPreference = localStorage.getItem('sidebarCollapsed')
    if (savedPreference !== null) {
      setIsSidebarCollapsed(savedPreference === 'true')
    }
    
    // Escutar eventos de toggle do sidebar de outros componentes
    // Listen for sidebar toggle events from other components
    const handleToggleSidebar = (event: CustomEvent) => {
      setIsSidebarCollapsed(event.detail.collapsed)
    }
    
    window.addEventListener('toggleSidebar', handleToggleSidebar as EventListener)
    
    return () => {
      window.removeEventListener('toggleSidebar', handleToggleSidebar as EventListener)
    }
  }, [])

  const menuItems = [
    {
      name: t('menu.dashboard'),
      path: '/dashboard',
      icon: FiHome,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: t('menu.descriptions.dashboard')
    },
    {
      name: t('menu.authentication'),
      path: '/auth',
      icon: FiShield,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      description: t('menu.descriptions.authentication')
    },
    {
      name: t('menu.company'),
      path: '/company',
      icon: FiSettings,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      description: t('menu.descriptions.company')
    },
    {
      name: t('menu.employees'),
      path: '/employee-and-costs',
      icon: FiUsers,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
      description: t('menu.descriptions.employees')
    },
    {
      name: t('menu.suppliers'),
      path: '/supplier-service',
      icon: FiTruck,
      color: 'text-teal-500',
      bgColor: 'bg-teal-50',
      description: t('menu.descriptions.suppliers')
    },
    {
      name: t('menu.cashFlow'),
      path: '/cash-flow',
      icon: FiDollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      description: t('menu.descriptions.cashFlow')
    },
    {
      name: t('menu.accountsPayable'),
      path: '/accounts-payable',
      icon: FiCreditCard,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      description: t('menu.descriptions.accountsPayable')
    },
    {
      name: t('menu.accountsReceivable'),
      path: '/accounts-receivable',
      icon: FiCreditCard,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      description: t('menu.descriptions.accountsReceivable')
    },
    {
      name: t('menu.materials'),
      path: '/calculation-materials',
      icon: FiSettings,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      description: t('menu.descriptions.materials')
    },
    {
      name: t('menu.projectMap'),
      path: '/project-map',
      icon: FiMap,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      description: t('menu.descriptions.projectMap')
    },
    {
      name: t('menu.reports'),
      path: '/financial-reports',
      icon: FiBarChart,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
      description: t('menu.descriptions.reports')
    },
    {
      name: t('menu.analytics'),
      path: '/api/data-analytics',
      icon: FiTrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: t('menu.descriptions.analytics')
    },
    {
      name: t('menu.advanced'),
      path: '/api/financial-advanced',
      icon: FiBarChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: t('menu.descriptions.advanced')
    },
    {
      name: t('menu.integrations'),
      path: '/api/integrations',
      icon: FiLink,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: t('menu.descriptions.integrations')
    }
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    setIsSidebarOpen(false) // Fecha sidebar no mobile após navegação
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  const toggleSidebarCollapse = () => {
    const newState = !isSidebarCollapsed
    setIsSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isSidebarCollapsed ? 'w-16' : 'w-64'}
      `}>
        {/* Header do Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">⚡</span>
            </div>
            {!isSidebarCollapsed && (
              <span className="font-semibold text-gray-900 hidden sm:block">
                Financial Solutions
              </span>
            )}
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleSidebarCollapse}
              className="p-1 rounded-md hover:bg-gray-100 hidden lg:block"
            >
              {isSidebarCollapsed ? <FiMenu className="w-5 h-5" /> : <FiX className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informações do Usuário */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.roles?.[0] || 'User'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu de Navegação */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group
                    ${active 
                      ? `${item.bgColor} ${item.color} shadow-sm border border-current border-opacity-20` 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  title={item.description}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? item.color : 'text-gray-500'}`} />
                  {!isSidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium truncate block">
                        {item.name}
                      </span>
                      {active && (
                        <span className="text-xs opacity-75 truncate block">
                          {item.description}
                        </span>
                      )}
                    </div>
                  )}
                  {active && !isSidebarCollapsed && (
                    <div className="w-2 h-2 bg-current rounded-full opacity-60" />
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Botão de Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 ${isSidebarCollapsed ? 'justify-center' : ''}`}
          >
            <FiLogOut className="w-5 h-5" />
            {!isSidebarCollapsed && (
              <span className="text-sm font-medium">{t('menu.logout')}</span>
            )}
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              
              {/* Breadcrumb */}
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-gray-500">
                  {menuItems.find(item => isActive(item.path))?.name || t('menu.dashboard')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-900">
                  {new Date().toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Área de Conteúdo */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
