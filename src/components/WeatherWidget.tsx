import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiCloud, FiSun, FiCloudRain, FiWind, FiThermometer, FiDroplet } from 'react-icons/fi'

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  forecast: Array<{
    day: string
    temp: number
    condition: string
    icon: string
  }>
  alerts: Array<{
    type: string
    message: string
    severity: 'low' | 'medium' | 'high'
  }>
}

const WeatherWidget = () => {
  const { t } = useTranslation()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar dados do clima
  const fetchWeatherData = async () => {
    try {
      setLoading(true)
      
      // Simulação de dados do clima (substitua por API real)
      // Em produção, use OpenWeatherMap, WeatherAPI, etc.
      const mockWeatherData: WeatherData = {
        temperature: 2,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        forecast: [
          { day: 'Seg', temp: 3, condition: 'Sunny', icon: '☀️' },
          { day: 'Ter', temp: 1, condition: 'Cloudy', icon: '☁️' },
          { day: 'Qua', temp: -2, condition: 'Snow', icon: '❄️' },
          { day: 'Qui', temp: 0, condition: 'Rain', icon: '🌧️' },
          { day: 'Sex', temp: 4, condition: 'Sunny', icon: '☀️' },
          { day: 'Sáb', temp: 6, condition: 'Partly Cloudy', icon: '⛅' },
          { day: 'Dom', temp: 5, condition: 'Cloudy', icon: '☁️' }
        ],
        alerts: [
          {
            type: 'cold',
            message: 'Alerta de frio para quinta-feira. Considere adiar atividades externas.',
            severity: 'medium'
          }
        ]
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setWeather(mockWeatherData)
      setError(null)
    } catch (err) {
      console.error('Erro ao buscar dados do clima:', err)
      setError('Erro ao carregar dados do clima')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()
    
    // Atualizar dados a cada 30 minutos
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Função para obter ícone baseado na condição
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <FiSun className="h-8 w-8 text-yellow-500" />
      case 'cloudy':
      case 'partly cloudy':
        return <FiCloud className="h-8 w-8 text-gray-500" />
      case 'rain':
      case 'rainy':
        return <FiCloudRain className="h-8 w-8 text-blue-500" />
      default:
        return <FiCloud className="h-8 w-8 text-gray-500" />
    }
  }

  // Função para obter cor do alerta
  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-500 text-red-700'
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700'
      case 'low':
        return 'bg-blue-100 border-blue-500 text-blue-700'
      default:
        return 'bg-gray-100 border-gray-500 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <FiCloud className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">{error}</p>
          <button
            onClick={fetchWeatherData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  if (!weather) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('weather.title')}
        </h3>
        <button
          onClick={fetchWeatherData}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          title="Atualizar"
        >
          <FiWind className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Temperatura Atual */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {getWeatherIcon(weather.condition)}
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {weather.temperature}°C
            </div>
            <div className="text-sm text-gray-500">
              Toronto, ON
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">
            Residência Maple Heights
          </div>
          <div className="text-xs text-gray-500">
            {weather.condition}
          </div>
        </div>
      </div>

      {/* Detalhes */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <FiDroplet className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-600">
            Umidade: {weather.humidity}%
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FiWind className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Vento: {weather.windSpeed} km/h
          </span>
        </div>
      </div>

      {/* Alertas */}
      {weather.alerts.length > 0 && (
        <div className="mb-6">
          {weather.alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-3 rounded-md border-l-4 ${getAlertColor(alert.severity)}`}
            >
              <div className="flex items-start">
                <FiThermometer className="h-4 w-4 mt-0.5 mr-2" />
                <p className="text-sm">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Previsão 7 dias */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          {t('weather.forecast')}
        </h4>
        <div className="grid grid-cols-7 gap-2">
          {weather.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 mb-1">
                {day.day}
              </div>
              <div className="text-lg mb-1">
                {day.icon}
              </div>
              <div className="text-sm font-medium text-gray-800">
                {day.temp}°
              </div>
              <div className="text-xs text-gray-500">
                {day.temp > 0 ? '+' : ''}{day.temp}°
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sugestões */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <h5 className="text-sm font-medium text-blue-800 mb-1">
          {t('weather.suggestions')}
        </h5>
        <p className="text-xs text-blue-700">
          Temperaturas baixas previstas. Considere ajustar cronograma de atividades externas.
        </p>
      </div>
    </div>
  )
}

export default WeatherWidget

