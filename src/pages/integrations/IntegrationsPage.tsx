import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FiRefreshCw, FiDownload, FiFilter, FiLink, FiCheck, FiX, FiSettings, FiExternalLink } from 'react-icons/fi'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts'

// Interfaces
interface Integration {
  id: string
  name: string
  type: 'api' | 'database' | 'file' | 'service'
  description: string
  status: 'active' | 'inactive' | 'error' | 'pending'
  lastSync?: string
  nextSync?: string
  endpoint?: string
  settings?: Record<string, any>
}

interface IntegrationLog {
  id: string
  integrationId: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
  message: string
  details?: string
}

interface IntegrationMetric {
  name: string
  value: number
  trend: 'up' | 'down' | 'stable'
  percentage: number
}

interface SyncHistory {
  date: string
  success: number
  error: number
  warning: number
}

// Mock data
const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'API de Bancos',
    type: 'api',
    description: 'Integração com APIs bancárias para sincronização de transações.',
    status: 'active',
    lastSync: '2025-06-11 08:30',
    nextSync: '2025-06-11 20:30',
    endpoint: 'https://api.banco.exemplo/v1',
    settings: { autoSync: true, syncInterval: '12h' }
  },
  {
    id: '2',
    name: 'Sistema ERP',
    type: 'service',
    description: 'Integração com sistema ERP para sincronização de dados financeiros.',
    status: 'active',
    lastSync: '2025-06-11 06:00',
    nextSync: '2025-06-12 06:00',
    endpoint: 'https://erp.exemplo.com/api',
    settings: { autoSync: true, syncInterval: '24h' }
  },
  {
    id: '3',
    name: 'Planilhas de Orçamento',
    type: 'file',
    description: 'Importação de planilhas de orçamento de projetos.',
    status: 'inactive',
    lastSync: '2025-06-05 14:15',
    settings: { autoSync: false }
  },
  {
    id: '4',
    name: 'API de Fornecedores',
    type: 'api',
    description: 'Integração com sistema de fornecedores para atualização de preços.',
    status: 'error',
    lastSync: '2025-06-10 18:45',
    nextSync: '2025-06-11 18:45',
    endpoint: 'https://fornecedores.exemplo.com/api/v2',
    settings: { autoSync: true, syncInterval: '24h' }
  },
  {
    id: '5',
    name: 'Banco de Dados Legado',
    type: 'database',
    description: 'Conexão com banco de dados legado para migração de dados históricos.',
    status: 'pending',
    settings: { autoSync: false }
  }
];

const mockIntegrationLogs: IntegrationLog[] = [
  {
    id: 'log1',
    integrationId: '1',
    timestamp: '2025-06-11 08:30:15',
    status: 'success',
    message: 'Sincronização concluída com sucesso',
    details: 'Importados 156 registros de transações bancárias.'
  },
  {
    id: 'log2',
    integrationId: '2',
    timestamp: '2025-06-11 06:00:22',
    status: 'success',
    message: 'Sincronização concluída com sucesso',
    details: 'Atualizados 78 registros financeiros no ERP.'
  },
  {
    id: 'log3',
    integrationId: '4',
    timestamp: '2025-06-10 18:45:03',
    status: 'error',
    message: 'Falha na sincronização',
    details: 'Erro de autenticação: Token expirado. Renove o token de acesso.'
  },
  {
    id: 'log4',
    integrationId: '1',
    timestamp: '2025-06-10 20:30:10',
    status: 'warning',
    message: 'Sincronização concluída com avisos',
    details: 'Importados 142 registros, 3 registros com formato inválido foram ignorados.'
  },
  {
    id: 'log5',
    integrationId: '3',
    timestamp: '2025-06-05 14:15:30',
    status: 'success',
    message: 'Importação manual concluída',
    details: 'Importados dados de 5 planilhas de orçamento.'
  }
];

const mockIntegrationMetrics: IntegrationMetric[] = [
  { name: 'Integrações Ativas', value: 2, trend: 'stable', percentage: 0 },
  { name: 'Taxa de Sucesso', value: 75, trend: 'down', percentage: 5 },
  { name: 'Dados Sincronizados', value: 1250, trend: 'up', percentage: 12 },
  { name: 'Tempo Médio de Sincronização', value: 45, trend: 'down', percentage: 8 }
];

const mockSyncHistory: SyncHistory[] = [
  { date: '06/05', success: 12, error: 2, warning: 1 },
  { date: '06/06', success: 10, error: 1, warning: 2 },
  { date: '06/07', success: 14, error: 0, warning: 1 },
  { date: '06/08', success: 13, error: 1, warning: 0 },
  { date: '06/09', success: 11, error: 3, warning: 2 },
  { date: '06/10', success: 9, error: 4, warning: 1 },
  { date: '06/11', success: 8, error: 2, warning: 2 }
];

// Componente principal da página de integrações
// Main component for the integrations page
const IntegrationsPage = () => {
  const { t } = useTranslation();
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [logs, setLogs] = useState<IntegrationLog[]>(mockIntegrationLogs);
  const [metrics, setMetrics] = useState<IntegrationMetric[]>(mockIntegrationMetrics);
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>(mockSyncHistory);
  const [loading, setLoading] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para buscar integrações
  // Function to fetch integrations
  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      // Em produção, substituir por chamada real à API
      // In production, replace with actual API call
      // const response = await fetch('/api/integrations');
      // const data = await response.json();
      
      // Simulando delay de API
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrations(mockIntegrations);
      setLogs(mockIntegrationLogs);
      setMetrics(mockIntegrationMetrics);
      setSyncHistory(mockSyncHistory);
    } catch (err) {
      console.error('Erro ao buscar integrações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  // Filtrar integrações com base nos critérios
  // Filter integrations based on criteria
  const filteredIntegrations = integrations.filter(integration => 
    (integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     integration.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus.length === 0 || filterStatus.includes(integration.status)) &&
    (filterType.length === 0 || filterType.includes(integration.type))
  );

  // Função para sincronizar integração
  // Function to synchronize integration
  const syncIntegration = async (integrationId: string) => {
    try {
      setLoading(true);
      
      // Simulando sincronização
      // Simulating synchronization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar status da integração
      // Update integration status
      const updatedIntegrations = integrations.map(integration => {
        if (integration.id === integrationId) {
          return {
            ...integration,
            status: 'active' as const,
            lastSync: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return integration;
      });
      
      setIntegrations(updatedIntegrations);
      
      // Adicionar novo log
      // Add new log
      const newLog: IntegrationLog = {
        id: `log${Date.now()}`,
        integrationId,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: 'success',
        message: 'Sincronização manual concluída com sucesso',
        details: 'Todos os dados foram sincronizados corretamente.'
      };
      
      setLogs([newLog, ...logs]);
      
      // Mostrar mensagem de sucesso (em produção, usar um sistema de notificações)
      // Show success message (in production, use a notification system)
      alert('Sincronização concluída com sucesso!');
    } catch (err) {
      console.error('Erro ao sincronizar integração:', err);
      alert('Erro ao sincronizar integração. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir modal de configuração
  // Function to open configuration modal
  const openConfigModal = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsConfigModalOpen(true);
  };

  // Função para salvar configurações
  // Function to save configuration
  const saveConfig = () => {
    // Em produção, implementar lógica para salvar configurações
    // In production, implement logic to save configuration
    setIsConfigModalOpen(false);
    alert('Configurações salvas com sucesso!');
  };

  // Função para abrir modal de filtros
  // Function to open filter modal
  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  // Função para aplicar filtros
  // Function to apply filters
  const applyFilters = () => {
    setIsFilterModalOpen(false);
  };

  // Função para limpar filtros
  // Function to clear filters
  const clearFilters = () => {
    setFilterStatus([]);
    setFilterType([]);
    setSearchTerm('');
    setIsFilterModalOpen(false);
  };

  // Função para exportar dados
  // Function to export data
  const exportData = () => {
    const csvContent = [
      ['ID', 'Nome', 'Tipo', 'Descrição', 'Status', 'Última Sincronização', 'Próxima Sincronização', 'Endpoint'].join(','),
      ...filteredIntegrations.map(integration => [
        integration.id,
        integration.name,
        integration.type,
        integration.description,
        integration.status,
        integration.lastSync || '',
        integration.nextSync || '',
        integration.endpoint || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'integracoes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para obter cor do status
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter texto do status
  // Function to get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'error': return 'Erro';
      case 'pending': return 'Pendente';
      case 'success': return 'Sucesso';
      case 'warning': return 'Aviso';
      default: return status;
    }
  };

  // Função para obter texto do tipo
  // Function to get type text
  const getTypeText = (type: string) => {
    switch (type) {
      case 'api': return 'API';
      case 'database': return 'Banco de Dados';
      case 'file': return 'Arquivo';
      case 'service': return 'Serviço';
      default: return type;
    }
  };

  // Função para obter ícone de tendência
  // Function to get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <span className="text-green-600">↑</span>;
      case 'down': return <span className="text-red-600">↓</span>;
      case 'stable': return <span className="text-gray-600">→</span>;
      default: return null;
    }
  };

  // Função para obter logs de uma integração específica
  // Function to get logs for a specific integration
  const getIntegrationLogs = (integrationId: string) => {
    return logs.filter(log => log.integrationId === integrationId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('menu.integrations')}
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie integrações com sistemas externos
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchIntegrations}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            disabled={loading}
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Métricas de Integração */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{metric.name}</p>
                <p className="text-xl font-semibold text-gray-900">
                  {metric.name === 'Taxa de Sucesso' || metric.name === 'Tempo Médio de Sincronização' 
                    ? `${metric.value}${metric.name === 'Taxa de Sucesso' ? '%' : 's'}`
                    : metric.value}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FiLink className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <span className={`text-sm ${metric.trend === 'up' ? metric.name === 'Tempo Médio de Sincronização' ? 'text-red-600' : 'text-green-600' : metric.trend === 'down' ? metric.name === 'Tempo Médio de Sincronização' ? 'text-green-600' : 'text-red-600' : 'text-gray-600'}`}>
                {getTrendIcon(metric.trend)} {metric.percentage}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs. semana anterior</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Histórico de Sincronização */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Histórico de Sincronização (Últimos 7 dias)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={syncHistory}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="success" name="Sucesso" stackId="a" fill="#10B981" />
              <Bar dataKey="warning" name="Aviso" stackId="a" fill="#F59E0B" />
              <Bar dataKey="error" name="Erro" stackId="a" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barra de ações */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar integração..."
            className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={openFilterModal}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <FiFilter className="w-4 h-4" />
            Filtros
            {(filterStatus.length > 0 || filterType.length > 0) && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filterStatus.length + filterType.length}
              </span>
            )}
          </button>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <FiDownload className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Lista de Integrações */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Sincronização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próxima Sincronização
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIntegrations.map((integration) => (
                <tr key={integration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{integration.name}</div>
                    <div className="text-xs text-gray-500">{integration.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getTypeText(integration.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(integration.status)}`}>
                      {getStatusText(integration.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {integration.lastSync || 'Nunca'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {integration.nextSync || 'Não agendado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => syncIntegration(integration.id)}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={loading || integration.status === 'pending'}
                      >
                        Sincronizar
                      </button>
                      <button
                        onClick={() => openConfigModal(integration)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Configurar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs de Integração */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Logs de Integração</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Integração
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mensagem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalhes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => {
                const integration = integrations.find(i => i.id === log.integrationId);
                return (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {integration?.name || log.integrationId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(log.status)}`}>
                        {getStatusText(log.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.details}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Configuração */}
      {isConfigModalOpen && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Configurar Integração: {selectedIntegration.name}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue={selectedIntegration.status}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="pending">Pendente</option>
                </select>
              </div>
              
              {selectedIntegration.endpoint && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endpoint
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    defaultValue={selectedIntegration.endpoint}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sincronização Automática
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoSync"
                    defaultChecked={selectedIntegration.settings?.autoSync}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="autoSync" className="ml-2 text-sm text-gray-700">
                    Ativar sincronização automática
                  </label>
                </div>
              </div>
              
              {selectedIntegration.settings?.autoSync && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intervalo de Sincronização
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    defaultValue={selectedIntegration.settings?.syncInterval}
                  >
                    <option value="1h">1 hora</option>
                    <option value="6h">6 horas</option>
                    <option value="12h">12 horas</option>
                    <option value="24h">24 horas</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logs
                </label>
                <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-md">
                  {getIntegrationLogs(selectedIntegration.id).length > 0 ? (
                    getIntegrationLogs(selectedIntegration.id).map((log, index) => (
                      <div key={index} className={`text-xs p-1 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                        <span className={`inline-block w-20 ${log.status === 'success' ? 'text-green-600' : log.status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                          {log.timestamp}
                        </span>
                        <span className="ml-2">{log.message}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">Nenhum log disponível</p>
                  )}
                </div>
              </div>
              
              {selectedIntegration.type === 'api' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Autenticação
                  </label>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Tipo de Autenticação
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue="oauth2"
                      >
                        <option value="none">Nenhuma</option>
                        <option value="basic">Basic Auth</option>
                        <option value="oauth2">OAuth 2.0</option>
                        <option value="apikey">API Key</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Token de Acesso
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue="••••••••••••••••"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (selectedIntegration.endpoint) {
                      window.open(selectedIntegration.endpoint, '_blank');
                    }
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                  disabled={!selectedIntegration.endpoint}
                >
                  <FiExternalLink className="w-4 h-4" />
                  Abrir Endpoint
                </button>
                <button
                  onClick={saveConfig}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Filtros */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Filtros
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Filtro por Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {['active', 'inactive', 'error', 'pending'].map((status) => (
                    <div key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`filter-status-${status}`}
                        checked={filterStatus.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterStatus([...filterStatus, status]);
                          } else {
                            setFilterStatus(filterStatus.filter(s => s !== status));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`filter-status-${status}`} className="ml-2 text-sm text-gray-700">
                        {getStatusText(status)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Filtro por Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <div className="space-y-2">
                  {['api', 'database', 'file', 'service'].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`filter-type-${type}`}
                        checked={filterType.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterType([...filterType, type]);
                          } else {
                            setFilterType(filterType.filter(t => t !== type));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label htmlFor={`filter-type-${type}`} className="ml-2 text-sm text-gray-700">
                        {getTypeText(type)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Limpar Filtros
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage;
