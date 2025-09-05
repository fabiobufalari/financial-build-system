import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiMap, FiLayers, FiMaximize, FiMinimize } from 'react-icons/fi';
import { mockEmployeesData } from '../../utils/mockData';
import { mockProjectMapData } from '../../utils/projectMapData';

// Definição de tipos para o componente MapViewControl
interface MapViewControlProps {
  is3D: boolean;
  mapView: string;
  onApply3D: () => void;
}

// Interface para propriedades de projeto no mapa 3D
interface ProjectProperties {
  name: string;
  status: string;
  height: number;
}

// Interface para feature do GeoJSON
interface ProjectFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: ProjectProperties;
}

/**
 * Componente para o mapa de projetos com subabas e visualizações avançadas
 * Project map component with subtabs and advanced visualizations
 */
const ProjectMapPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [mapView, setMapView] = useState('standard');
  const [is3D, setIs3D] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([43.651070, -79.347015]);
  const [mapZoom, setMapZoom] = useState(12);
  const [mapReady, setMapReady] = useState(false);
  const [mapKey, setMapKey] = useState(Date.now()); // Para forçar re-renderização do mapa

  // Emitir evento para colapsar/expandir o menu lateral
  // Emit event to collapse/expand sidebar
  useEffect(() => {
    // Criar e disparar evento personalizado para o Layout principal
    // Create and dispatch custom event for the main Layout
    const event = new CustomEvent('toggleSidebar', { 
      detail: { collapsed: isMenuCollapsed } 
    });
    window.dispatchEvent(event);
    
    // Salvar preferência no localStorage
    // Save preference in localStorage
    localStorage.setItem('sidebarCollapsed', String(isMenuCollapsed));
  }, [isMenuCollapsed]);

  // Forçar atualização do mapa quando o tipo de visualização mudar
  // Force map update when view type changes
  useEffect(() => {
    setMapKey(Date.now());
  }, [mapView]);

  // Filtrar projetos com base na aba ativa
  // Filter projects based on active tab
  const filteredProjects = mockProjectMapData.filter(project => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return project.status === 'active';
    if (activeTab === 'paused') return project.status === 'paused';
    if (activeTab === 'negotiation') return project.status === 'negotiation';
    return true;
  });

  // Obter nome do funcionário pelo ID
  // Get employee name by ID
  const getEmployeeName = (id: number) => {
    const employee = mockEmployeesData.find(emp => emp.id === id);
    return employee ? employee.name : 'Não atribuído';
  };

  // Obter ícone com base no status do projeto
  // Get icon based on project status
  const getProjectIcon = (status: string) => {
    let iconUrl = '';
    
    switch (status) {
      case 'active':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
        break;
      case 'paused':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
        break;
      case 'negotiation':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png';
        break;
      default:
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
    }
    
    return new Icon({
      iconUrl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  // Aplicar modo 3D
  // Apply 3D mode
  const apply3DMode = () => {
    if (is3D) {
      // Implementação simplificada do modo 3D usando CSS 3D transforms
      return (
        <div 
          className="absolute inset-0 bg-gray-100"
          style={{ 
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/12/1491/2274)`,
              transform: 'rotateX(45deg)',
              transformOrigin: 'center center',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
            }}
          >
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="absolute w-4 h-4 rounded-full transform -translate-x-2 -translate-y-2"
                style={{
                  left: `${50 + (project.coordinates[1] - mapCenter[1]) * 10}%`,
                  top: `${50 - (project.coordinates[0] - mapCenter[0]) * 10}%`,
                  backgroundColor: project.status === 'active' ? 'green' : 
                                  project.status === 'paused' ? 'red' : 'yellow',
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                  height: project.status === 'active' ? '20px' : 
                          project.status === 'paused' ? '10px' : '15px',
                  width: project.status === 'active' ? '20px' : 
                         project.status === 'paused' ? '10px' : '15px',
                  zIndex: 1000,
                  cursor: 'pointer'
                }}
                title={`${project.name} - ${project.client.name}`}
              />
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Componente para alternar a visualização do mapa
  // Component to toggle map view
  const MapViewControl = ({ is3D, mapView, onApply3D }: MapViewControlProps) => {
    const map = useMap();
    
    useEffect(() => {
      if (map && mapReady) {
        // Atualizar centro e zoom do mapa
        setMapCenter([map.getCenter().lat, map.getCenter().lng]);
        setMapZoom(map.getZoom());
        
        // Aplicar modo 3D se ativado
        if (is3D) {
          onApply3D();
        }
      }
    }, [map, is3D, mapView, mapReady, onApply3D]);

    return null;
  };

  // Obter URL do tile com base no tipo de mapa
  // Get tile URL based on map type
  const getTileUrl = () => {
    switch (mapView) {
      case 'satellite':
        // Usando Esri World Imagery para satélite
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        // Usando OpenTopoMap para terreno
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        // Usando OpenStreetMap para padrão
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // Obter atribuição do tile com base no tipo de mapa
  // Get tile attribution based on map type
  const getTileAttribution = () => {
    switch (mapView) {
      case 'satellite':
        return 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      case 'terrain':
        return '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  // Quando o mapa estiver pronto
  // When map is ready
  const handleMapReady = () => {
    setMapReady(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mapa de Projetos</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            {isMenuCollapsed ? <FiMaximize className="w-4 h-4" /> : <FiMinimize className="w-4 h-4" />}
            {isMenuCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
          </button>
        </div>
      </div>

      {/* Controles de visualização do mapa */}
      {/* Map view controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Visualização</label>
            <div className="flex space-x-2">
              <button 
                onClick={() => setMapView('standard')}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${mapView === 'standard' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <FiMap className="w-4 h-4" />
                Padrão
              </button>
              <button 
                onClick={() => setMapView('satellite')}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${mapView === 'satellite' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <FiLayers className="w-4 h-4" />
                Satélite
              </button>
              <button 
                onClick={() => setMapView('terrain')}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${mapView === 'terrain' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <FiLayers className="w-4 h-4" />
                Terreno
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modo de Visualização</label>
            <div className="flex space-x-2">
              <button 
                onClick={() => setIs3D(!is3D)}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${is3D ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <FiMap className="w-4 h-4" />
                {is3D ? 'Modo 3D Ativo' : 'Ativar Modo 3D'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Abas de navegação */}
      {/* Navigation tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Todos os Projetos
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'active' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Em Andamento
        </button>
        <button
          onClick={() => setActiveTab('paused')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'paused' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Pendentes/Parados
        </button>
        <button
          onClick={() => setActiveTab('negotiation')}
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'negotiation' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Em Negociação
        </button>
      </div>

      {/* Mapa */}
      {/* Map */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px', position: 'relative' }}>
        {is3D ? (
          apply3DMode()
        ) : (
          <MapContainer 
            key={mapKey} 
            style={{ height: '100%', width: '100%' }} 
            zoom={12} 
            center={[43.651070, -79.347015]}
            whenReady={handleMapReady}
            ref={mapRef}
          >
            <TileLayer
              url={getTileUrl()}
              attribution={getTileAttribution()}
            />
            
            <MapViewControl is3D={is3D} mapView={mapView} onApply3D={apply3DMode} />
            
            {filteredProjects.map((project) => (
              <Marker 
                key={project.id} 
                position={project.coordinates}
                icon={getProjectIcon(project.status)}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{project.name}</h3>
                    <p className="text-gray-600">{project.address}</p>
                    
                    <div className="mt-2">
                      <p className="font-semibold">Cliente:</p>
                      <p>{project.client.name}</p>
                      <p>{project.client.contact} - {project.client.phone}</p>
                      <p>{project.client.email}</p>
                    </div>
                    
                    {project.status === 'active' && project.assignedEmployees && (
                      <div className="mt-2">
                        <p className="font-semibold">Funcionários Alocados:</p>
                        <ul className="list-disc pl-5">
                          {project.assignedEmployees.map(empId => (
                            <li key={empId}>{getEmployeeName(empId)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {project.status === 'paused' && project.pendingIssues && (
                      <div className="mt-2">
                        <p className="font-semibold">Pendências:</p>
                        <ul className="list-disc pl-5">
                          {project.pendingIssues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {project.status === 'negotiation' && project.requirements && (
                      <div className="mt-2">
                        <p className="font-semibold">Requisitos para Fechamento:</p>
                        <ul className="list-disc pl-5">
                          {project.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <p className="font-semibold">Status: 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'paused' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status === 'active' ? 'Em Andamento' :
                           project.status === 'paused' ? 'Parado' :
                           'Em Negociação'}
                        </span>
                      </p>
                      
                      {project.progress > 0 && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-right mt-1">{project.progress}% concluído</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Legenda */}
      {/* Legend */}
      <div className="mt-4 bg-white rounded-lg shadow-md p-4">
        <h3 className="font-medium text-gray-700 mb-2">Legenda</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span>Projetos em Andamento</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>Projetos Pendentes/Parados</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span>Projetos em Negociação</span>
          </div>
        </div>
      </div>
      
      {/* Versão do sistema */}
      {/* System version */}
      <div className="mt-4 text-right text-xs text-gray-500">
        Versão 1.0.0
      </div>
    </div>
  );
};

export default ProjectMapPage;
