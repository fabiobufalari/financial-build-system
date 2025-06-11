import { useTranslation } from 'react-i18next'
import { FiHome, FiTrendingUp, FiDollarSign, FiClock, FiRefreshCw } from 'react-icons/fi'
import WeatherWidget from '../../components/WeatherWidget'
import { mockFinancialData, mockProjectsData, formatCurrency, formatPercentage } from '../../utils/mockData'
import { useState } from 'react'

/**
 * Página principal do dashboard com dados financeiros e widgets
 * Main dashboard page with financial data and widgets
 */
const Dashboard = () => {
  const { t } = useTranslation()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simula carregamento de dados
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'negotiation': return 'text-blue-600 bg-blue-100'
      case 'paused': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('projects.status.active')
      case 'negotiation': return t('projects.status.negotiation')
      case 'paused': return t('projects.status.paused')
      default: return status
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header com boas-vindas */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('dashboard.welcome')}, Fabio
          </h1>
          <p className="text-gray-600 mt-1">
            {t('dashboard.subtitle')}
          </p>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          title={t('dashboard.refresh')}
        >
          <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? t('dashboard.refreshing') : t('dashboard.refresh')}
        </button>
      </div>

      {/* Cards financeiros principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Projetos Ativos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.cards.activeProjects')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {mockFinancialData.activeProjects.value}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {formatPercentage(mockFinancialData.activeProjects.change)} {t('dashboard.vsLastMonth')}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiHome className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Receita Total */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.cards.totalRevenue')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(mockFinancialData.totalRevenue.value)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {formatPercentage(mockFinancialData.totalRevenue.change)} {t('dashboard.vsLastMonth')}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Fluxo de Caixa */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.cards.cashFlow')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(mockFinancialData.cashFlow.value)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {formatPercentage(mockFinancialData.cashFlow.change)} {t('dashboard.vsLastMonth')}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Pagamentos Pendentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('dashboard.cards.pendingPayments')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(mockFinancialData.pendingPayments.value)}
              </p>
              <p className="text-sm text-red-600 mt-1">
                {formatPercentage(mockFinancialData.pendingPayments.change)} {t('dashboard.vsLastMonth')}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <FiClock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Layout principal com análise financeira e clima */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Análise Financeira */}
        <div className="lg:col-span-2 space-y-6">
          {/* Botões de análise */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('dashboard.financialAnalysis')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105">
                <div className="text-sm font-medium">{t('dashboard.analysis.budget')}</div>
                <div className="text-xs opacity-90 mt-1">15 {t('dashboard.analysis.reports')}</div>
              </button>
              <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105">
                <div className="text-sm font-medium">{t('dashboard.analysis.materials')}</div>
                <div className="text-xs opacity-90 mt-1">16 {t('dashboard.analysis.items')}</div>
              </button>
              <button className="p-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all transform hover:scale-105">
                <div className="text-sm font-medium">{t('dashboard.analysis.profitability')}</div>
                <div className="text-xs opacity-90 mt-1">17 {t('dashboard.analysis.metrics')}</div>
              </button>
            </div>
          </div>

          {/* Gráfico placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FiTrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">{t('dashboard.chartPlaceholder')}</p>
              </div>
            </div>
          </div>

          {/* Insights Financeiros */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('dashboard.insights.title')}
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                {t('dashboard.insights.positive')}
              </p>
            </div>
          </div>

          {/* Mapa de Projetos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('dashboard.projectMap')}
            </h3>
            <div className="space-y-3">
              {mockProjectsData.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </div>
                    <span className="font-medium text-gray-900">{project.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{project.progress}%</div>
                    <div className="text-xs text-gray-500">{formatCurrency(project.budget)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Widget de Clima */}
        <div className="lg:col-span-1">
          <WeatherWidget />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

