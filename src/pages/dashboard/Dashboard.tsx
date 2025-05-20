import { FiHome, FiDollarSign, FiPieChart, FiUsers, FiSettings } from 'react-icons/fi'
import { useAuthStore } from '../../stores/authStore'

/**
 * Componente da página de Dashboard
 * Dashboard page component
 */
const Dashboard = () => {
  const { user, logout } = useAuthStore()

  /**
   * Função para realizar logout
   * Function to perform logout
   */
  const handleLogout = async () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header / Cabeçalho */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Sistema de Recuperação Financeira</h1>
          
          {/* Perfil do usuário / User profile */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Olá, {user?.name || 'Usuário'}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Sair / Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content / Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card de boas-vindas / Welcome card */}
          <div className="col-span-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">Bem-vindo ao Dashboard de Recuperação Financeira</h2>
            <p className="opacity-90">
              Este é o seu painel de controle para monitorar e gerenciar a recuperação financeira da construtora.
              Aqui você encontrará KPIs importantes, fluxo de caixa e resumo de projetos.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiDollarSign size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Fluxo de Caixa Mensal</h3>
                <p className="text-2xl font-semibold text-gray-900">$124,500</p>
                <p className="text-sm text-green-600">+12% em relação ao mês anterior</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiPieChart size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Projetos Ativos</h3>
                <p className="text-2xl font-semibold text-gray-900">8</p>
                <p className="text-sm text-green-600">2 novos este mês</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FiUsers size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Funcionários</h3>
                <p className="text-2xl font-semibold text-gray-900">42</p>
                <p className="text-sm text-gray-600">85% de produtividade</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FiSettings size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Contas a Receber</h3>
                <p className="text-2xl font-semibold text-gray-900">$89,750</p>
                <p className="text-sm text-red-600">3 pagamentos atrasados</p>
              </div>
            </div>
          </div>

          {/* Mensagem de desenvolvimento / Development message */}
          <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Ambiente de Desenvolvimento</h3>
            <p className="text-yellow-700">
              Este é um protótipo inicial do dashboard. Os dados mostrados são fictícios.
              As funcionalidades completas serão implementadas nas próximas iterações.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
