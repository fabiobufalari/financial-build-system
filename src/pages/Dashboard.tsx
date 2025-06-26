import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { 
  FiDollarSign, 
  FiTrendingUp, 
  FiUsers, 
  FiFileText,
  FiBarChart,
  FiCreditCard
} from 'react-icons/fi';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const stats = [
    {
      title: t('dashboard.totalRevenue'),
      value: '$45,231.89',
      change: '+20.1%',
      icon: FiDollarSign,
      color: 'text-green-600'
    },
    {
      title: t('dashboard.totalExpenses'),
      value: '$12,234.56',
      change: '+4.3%',
      icon: FiCreditCard,
      color: 'text-red-600'
    },
    {
      title: t('dashboard.activeEmployees'),
      value: '2,350',
      change: '+180.1%',
      icon: FiUsers,
      color: 'text-blue-600'
    },
    {
      title: t('dashboard.completedProjects'),
      value: '12,234',
      change: '+19%',
      icon: FiFileText,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('dashboard.welcome')}, {user?.firstName || user?.username}!
        </h1>
        <p className="text-gray-600 mt-2">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${stat.color}`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                {t('dashboard.fromLastMonth')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('dashboard.revenueOverview')}
            </h3>
            <FiBarChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">{t('dashboard.chartPlaceholder')}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('dashboard.recentActivity')}
            </h3>
            <FiTrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {t('dashboard.activityItem')} {item}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item} {t('dashboard.hoursAgo')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('dashboard.quickActions')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'addEmployee', icon: FiUsers, path: '/employees' },
            { key: 'createProject', icon: FiFileText, path: '/projects' },
            { key: 'viewReports', icon: FiBarChart, path: '/reports' },
            { key: 'manageFinances', icon: FiDollarSign, path: '/cash-flow' }
          ].map((action) => (
            <button
              key={action.key}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => window.location.href = action.path}
            >
              <action.icon className="w-8 h-8 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                {t(`dashboard.${action.key}`)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

