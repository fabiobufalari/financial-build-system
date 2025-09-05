import React, { useState } from 'react';
import { FiMap, FiMapPin, FiUsers, FiCalendar, FiCloud, FiDollarSign, FiTrendingUp, FiCamera, FiFileText } from 'react-icons/fi';

/**
 * Componente de mapa interativo para visualização de projetos
 * Interactive map component for project visualization
 */
const ProjectMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  
  // Dados simulados de projetos
  // Simulated project data
  const projects = {
    active: [
      { id: 1, name: 'Residência Maple Heights', address: '123 Maple St, Toronto', lat: 43.6532, lng: -79.3832, team: ['John Doe', 'Mary Smith', 'Robert Johnson'], status: 'Em andamento', progress: 65 },
      { id: 2, name: 'Condomínio Riverside', address: '456 River Ave, Vancouver', lat: 49.2827, lng: -123.1207, team: ['Alice Brown', 'David Wilson'], status: 'Em andamento', progress: 30 },
      { id: 3, name: 'Reforma Commercial Plaza', address: '789 Commerce Rd, Montreal', lat: 45.5017, lng: -73.5673, team: ['Michael Lee', 'Sarah Davis', 'James Miller'], status: 'Em andamento', progress: 80 }
    ],
    negotiation: [
      { id: 4, name: 'Residência Oakwood', address: '234 Oak St, Calgary', lat: 51.0447, lng: -114.0719, team: [], status: 'Em negociação', progress: 0 },
      { id: 5, name: 'Edifício Corporativo Skyline', address: '567 Business Blvd, Ottawa', lat: 45.4215, lng: -75.6972, team: [], status: 'Em negociação', progress: 0 }
    ],
    paused: [
      { id: 6, name: 'Residência Lakeside', address: '890 Lake Dr, Edmonton', lat: 53.5461, lng: -113.4938, team: ['Thomas Clark', 'Jennifer White'], status: 'Pausado', progress: 45 },
      { id: 7, name: 'Centro Comunitário Greenfield', address: '123 Community Way, Winnipeg', lat: 49.8951, lng: -97.1384, team: ['Patricia Green'], status: 'Pausado', progress: 20 }
    ]
  };
  
  // Função para renderizar o mapa (simulado)
  // Function to render the map (simulated)
  const renderMap = () => {
    const currentProjects = projects[activeTab as keyof typeof projects];
    
    return (
      <div className="relative h-full w-full bg-blue-50 rounded-lg overflow-hidden">
        {/* Simulação de mapa / Map simulation */}
        <div className="absolute inset-0 bg-blue-100 opacity-50"></div>
        
        {/* Marcadores de projeto / Project markers */}
        {currentProjects.map((project) => (
          <div 
            key={project.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
              hoveredProject === project.id ? 'z-10 scale-125' : 'z-0'
            }`}
            style={{ 
              left: `${((project.lng + 180) / 360) * 100}%`, 
              top: `${((90 - project.lat) / 180) * 100}%` 
            }}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <div className={`p-2 rounded-full ${
              activeTab === 'active' ? 'bg-green-500' : 
              activeTab === 'negotiation' ? 'bg-blue-500' : 'bg-orange-500'
            }`}>
              <FiMapPin className="h-5 w-5 text-white" />
            </div>
            
            {/* Tooltip de informações / Information tooltip */}
            {hoveredProject === project.id && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-20">
                <h3 className="font-bold text-gray-800">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{project.address}</p>
                
                <div className="flex items-center mb-2">
                  <div className={`h-2 flex-grow rounded-full bg-gray-200 overflow-hidden ${project.progress > 0 ? 'mr-2' : ''}`}>
                    {project.progress > 0 && (
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    )}
                  </div>
                  {project.progress > 0 && (
                    <span className="text-xs font-medium text-gray-600">{project.progress}%</span>
                  )}
                </div>
                
                {project.team.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Equipe:</p>
                    <div className="flex flex-wrap">
                      {project.team.map((member, index) => (
                        <div key={index} className="flex items-center mr-2 mb-1">
                          <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 mr-1">
                            {member.charAt(0)}
                          </div>
                          <span className="text-xs">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-2 flex justify-between">
                  <button className="text-xs text-blue-600 hover:text-blue-800">Ver detalhes</button>
                  <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                    <FiMap className="h-3 w-3 mr-1" />
                    Abrir no GPS
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Abas / Tabs */}
      <div className="flex space-x-2 mb-4">
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('active')}
        >
          Projetos Ativos
        </button>
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'negotiation' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('negotiation')}
        >
          Em Negociação
        </button>
        <button 
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'paused' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('paused')}
        >
          Projetos Parados
        </button>
      </div>
      
      {/* Mapa / Map */}
      <div className="flex-grow">
        {renderMap()}
      </div>
      
      {/* Legenda / Legend */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-1"></span>
          <span>Projetos Ativos ({projects.active.length})</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
          <span>Em Negociação ({projects.negotiation.length})</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block h-3 w-3 rounded-full bg-orange-500 mr-1"></span>
          <span>Projetos Parados ({projects.paused.length})</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectMap;
