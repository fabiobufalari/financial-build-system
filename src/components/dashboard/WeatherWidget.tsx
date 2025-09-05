import React, { useState, useEffect } from 'react';
import { FiCloud, FiSun, FiCloudRain, FiCloudSnow, FiWind, FiAlertTriangle } from 'react-icons/fi';
import apiClient from '../../services/apiClient';

interface WeatherForecast {
  location: string;
  projectId: string;
  projectName: string;
  currentTemp: number;
  currentCondition: string;
  dailyForecasts: {
    date: string;
    condition: string;
    tempHigh: number;
    tempLow: number;
    precipitation: number;
  }[];
  alerts: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
  }[];
}

/**
 * Componente de previsão do tempo para projetos
 * Weather forecast component for projects
 */
const WeatherWidget: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  // Efeito para carregar dados de previsão do tempo
  // Effect to load weather forecast data
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente real, esta chamada seria para um endpoint real
        // In a real environment, this call would be to a real endpoint
        // const response = await apiClient.get('/api/weather/forecasts');
        // setForecasts(response.data);
        
        // Simulação de dados para desenvolvimento
        // Simulated data for development
        setTimeout(() => {
          setForecasts([
            {
              location: 'Toronto, ON',
              projectId: 'proj-001',
              projectName: 'Residência Maple Heights',
              currentTemp: -2,
              currentCondition: 'snow',
              dailyForecasts: [
                { date: '2025-05-20', condition: 'snow', tempHigh: 0, tempLow: -5, precipitation: 70 },
                { date: '2025-05-21', condition: 'snow', tempHigh: -1, tempLow: -7, precipitation: 80 },
                { date: '2025-05-22', condition: 'cloudy', tempHigh: 2, tempLow: -3, precipitation: 20 },
                { date: '2025-05-23', condition: 'partly-cloudy', tempHigh: 5, tempLow: -1, precipitation: 10 },
                { date: '2025-05-24', condition: 'sunny', tempHigh: 8, tempLow: 1, precipitation: 0 },
                { date: '2025-05-25', condition: 'sunny', tempHigh: 10, tempLow: 3, precipitation: 0 },
                { date: '2025-05-26', condition: 'partly-cloudy', tempHigh: 9, tempLow: 4, precipitation: 10 }
              ],
              alerts: [
                { type: 'snow', severity: 'high', message: 'Alerta de nevasca para quinta-feira. Considere realocar equipe externa.' }
              ]
            },
            {
              location: 'Vancouver, BC',
              projectId: 'proj-002',
              projectName: 'Condomínio Riverside',
              currentTemp: 12,
              currentCondition: 'rain',
              dailyForecasts: [
                { date: '2025-05-20', condition: 'rain', tempHigh: 14, tempLow: 8, precipitation: 90 },
                { date: '2025-05-21', condition: 'rain', tempHigh: 13, tempLow: 9, precipitation: 95 },
                { date: '2025-05-22', condition: 'rain', tempHigh: 12, tempLow: 8, precipitation: 80 },
                { date: '2025-05-23', condition: 'cloudy', tempHigh: 15, tempLow: 10, precipitation: 40 },
                { date: '2025-05-24', condition: 'partly-cloudy', tempHigh: 17, tempLow: 11, precipitation: 20 },
                { date: '2025-05-25', condition: 'partly-cloudy', tempHigh: 18, tempLow: 12, precipitation: 30 },
                { date: '2025-05-26', condition: 'cloudy', tempHigh: 16, tempLow: 11, precipitation: 50 }
              ],
              alerts: [
                { type: 'rain', severity: 'high', message: 'Chuva forte prevista para os próximos 3 dias. Trabalhos externos devem ser reprogramados.' }
              ]
            },
            {
              location: 'Montreal, QC',
              projectId: 'proj-003',
              projectName: 'Reforma Commercial Plaza',
              currentTemp: 5,
              currentCondition: 'partly-cloudy',
              dailyForecasts: [
                { date: '2025-05-20', condition: 'partly-cloudy', tempHigh: 7, tempLow: 2, precipitation: 20 },
                { date: '2025-05-21', condition: 'cloudy', tempHigh: 6, tempLow: 1, precipitation: 30 },
                { date: '2025-05-22', condition: 'rain', tempHigh: 5, tempLow: 0, precipitation: 60 },
                { date: '2025-05-23', condition: 'rain', tempHigh: 4, tempLow: -1, precipitation: 70 },
                { date: '2025-05-24', condition: 'cloudy', tempHigh: 6, tempLow: 0, precipitation: 40 },
                { date: '2025-05-25', condition: 'partly-cloudy', tempHigh: 8, tempLow: 2, precipitation: 20 },
                { date: '2025-05-26', condition: 'sunny', tempHigh: 10, tempLow: 3, precipitation: 10 }
              ],
              alerts: []
            }
          ]);
          
          setSelectedProject('proj-001');
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Erro ao carregar dados de clima / Error loading weather data:', error);
        setLoading(false);
      }
    };
    
    fetchWeatherData();
  }, []);
  
  // Obter o ícone de condição climática
  // Get weather condition icon
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <FiSun className="h-5 w-5" />;
      case 'partly-cloudy':
        return <FiCloud className="h-5 w-5" />;
      case 'cloudy':
        return <FiCloud className="h-5 w-5" />;
      case 'rain':
        return <FiCloudRain className="h-5 w-5" />;
      case 'snow':
        return <FiCloudSnow className="h-5 w-5" />;
      default:
        return <FiCloud className="h-5 w-5" />;
    }
  };
  
  // Obter a cor de fundo baseada na condição
  // Get background color based on condition
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return 'bg-yellow-100 text-yellow-700';
      case 'partly-cloudy':
        return 'bg-blue-50 text-blue-600';
      case 'cloudy':
        return 'bg-gray-100 text-gray-600';
      case 'rain':
        return 'bg-blue-100 text-blue-700';
      case 'snow':
        return 'bg-indigo-50 text-indigo-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  // Obter a previsão selecionada
  // Get selected forecast
  const selectedForecast = forecasts.find(f => f.projectId === selectedProject);
  
  // Formatar data
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric' }).format(date);
  };
  
  return (
    <div className="h-full flex flex-col">
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Seletor de projeto / Project selector */}
          <div className="mb-4">
            <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-1">
              Selecionar Projeto
            </label>
            <select
              id="project-select"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {forecasts.map((forecast) => (
                <option key={forecast.projectId} value={forecast.projectId}>
                  {forecast.projectName} ({forecast.location})
                </option>
              ))}
            </select>
          </div>
          
          {selectedForecast && (
            <>
              {/* Condição atual / Current condition */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{selectedForecast.location}</h3>
                  <p className="text-sm text-gray-500">{selectedForecast.projectName}</p>
                </div>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${getConditionColor(selectedForecast.currentCondition)}`}>
                    {getWeatherIcon(selectedForecast.currentCondition)}
                  </div>
                  <span className="text-2xl font-bold ml-2">{selectedForecast.currentTemp}°C</span>
                </div>
              </div>
              
              {/* Alertas / Alerts */}
              {selectedForecast.alerts.length > 0 && (
                <div className="mb-4">
                  {selectedForecast.alerts.map((alert, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg flex items-start mb-2 ${
                        alert.severity === 'high' ? 'bg-red-50 border-l-4 border-red-500' : 
                        alert.severity === 'medium' ? 'bg-amber-50 border-l-4 border-amber-500' : 
                        'bg-blue-50 border-l-4 border-blue-500'
                      }`}
                    >
                      <FiAlertTriangle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                        alert.severity === 'high' ? 'text-red-500' : 
                        alert.severity === 'medium' ? 'text-amber-500' : 
                        'text-blue-500'
                      }`} />
                      <p className="text-sm text-gray-700">{alert.message}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Previsão diária / Daily forecast */}
              <div className="flex-grow">
                <h3 className="font-medium text-gray-800 mb-2">Previsão para 7 dias</h3>
                <div className="grid grid-cols-7 gap-2">
                  {selectedForecast.dailyForecasts.map((day, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-2 text-center">
                      <p className="text-xs font-medium text-gray-500">{formatDate(day.date)}</p>
                      <div className={`mx-auto my-2 p-1 rounded-full w-8 h-8 flex items-center justify-center ${getConditionColor(day.condition)}`}>
                        {getWeatherIcon(day.condition)}
                      </div>
                      <p className="text-sm font-medium">{day.tempHigh}°</p>
                      <p className="text-xs text-gray-500">{day.tempLow}°</p>
                      {day.precipitation > 0 && (
                        <p className="text-xs text-blue-600 mt-1">{day.precipitation}%</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Sugestões / Suggestions */}
              <div className="mt-4">
                <h3 className="font-medium text-gray-800 mb-2">Sugestões</h3>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-sm text-gray-700">
                    {selectedForecast.alerts.length > 0 ? (
                      <>
                        <span className="font-medium">Recomendação:</span> Considere realocar a equipe para trabalhos internos ou em outros projetos durante os dias de condições climáticas adversas.
                      </>
                    ) : (
                      <>
                        <span className="font-medium">Condições favoráveis:</span> As condições climáticas estão adequadas para trabalhos externos nos próximos dias.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherWidget;

