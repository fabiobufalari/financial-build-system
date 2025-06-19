import React, { useState, useEffect } from 'react';
import { employeeService, Employee } from '../../services/employeeService';
import './MapsPage.css';

// EN: Maps page with employee search and location functionality
// PT: Página de mapas com busca de funcionários e funcionalidade de localização

interface MapsPageProps {
  // Props can be added here if needed
}

interface EmployeeLocation {
  employee: Employee;
  latitude: number;
  longitude: number;
  address: string;
}

const MapsPage: React.FC<MapsPageProps> = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [mapView, setMapView] = useState<'list' | 'map'>('list');

  // Demo employee locations (in a real app, these would come from the API)
  const employeeLocations: EmployeeLocation[] = [
    {
      employee: {} as Employee, // Will be populated from API
      latitude: -23.5505,
      longitude: -46.6333,
      address: 'São Paulo, SP - Centro'
    },
    {
      employee: {} as Employee,
      latitude: -23.5629,
      longitude: -46.6544,
      address: 'São Paulo, SP - Jardim Paulista'
    },
    {
      employee: {} as Employee,
      latitude: -23.5489,
      longitude: -46.6388,
      address: 'São Paulo, SP - Bela Vista'
    }
  ];

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchQuery]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar funcionários');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    if (!searchQuery) {
      setFilteredEmployees(employees);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = employees.filter(emp => 
      emp.firstName.toLowerCase().includes(query) ||
      emp.lastName.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.employeeId.toLowerCase().includes(query) ||
      emp.position.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query)
    );

    setFilteredEmployees(filtered);
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'ACTIVE': { label: 'Ativo', className: 'status-active' },
      'INACTIVE': { label: 'Inativo', className: 'status-inactive' },
      'ON_LEAVE': { label: 'Licença', className: 'status-leave' },
      'TERMINATED': { label: 'Desligado', className: 'status-terminated' }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, className: 'status-default' };
    
    return (
      <span className={`status-badge ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="maps-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando mapa de funcionários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="maps-page">
      <div className="page-header">
        <h1>🗺️ Mapa de Funcionários</h1>
        <p>Localize e gerencie funcionários por localização</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Search and View Controls */}
      <div className="maps-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar funcionário por nome, cargo, departamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="view-controls">
          <button
            onClick={() => setMapView('list')}
            className={`view-button ${mapView === 'list' ? 'active' : ''}`}
          >
            📋 Lista
          </button>
          <button
            onClick={() => setMapView('map')}
            className={`view-button ${mapView === 'map' ? 'active' : ''}`}
          >
            🗺️ Mapa
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          {searchQuery 
            ? `${filteredEmployees.length} funcionários encontrados para "${searchQuery}"`
            : `${employees.length} funcionários cadastrados`
          }
        </p>
      </div>

      {/* Main Content Area */}
      <div className="maps-content">
        {mapView === 'list' ? (
          /* List View */
          <div className="employee-list-view">
            {filteredEmployees.length > 0 ? (
              <div className="employee-cards-grid">
                {filteredEmployees.map(employee => (
                  <div 
                    key={employee.id} 
                    className={`employee-location-card ${selectedEmployee?.id === employee.id ? 'selected' : ''}`}
                    onClick={() => handleEmployeeSelect(employee)}
                  >
                    <div className="employee-card-header">
                      <div className="employee-avatar">
                        {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                      </div>
                      <div className="employee-info">
                        <h3>{employee.firstName} {employee.lastName}</h3>
                        <p className="employee-position">{employee.position}</p>
                        <p className="employee-department">{employee.department}</p>
                      </div>
                      {getStatusBadge(employee.status)}
                    </div>

                    <div className="location-info">
                      <div className="location-row">
                        <span className="location-icon">📍</span>
                        <span className="location-text">
                          {employee.address.city}, {employee.address.state}
                        </span>
                      </div>
                      <div className="location-row">
                        <span className="location-icon">📧</span>
                        <span className="location-text">{employee.email}</span>
                      </div>
                      <div className="location-row">
                        <span className="location-icon">📞</span>
                        <span className="location-text">{employee.phone}</span>
                      </div>
                    </div>

                    <div className="employee-actions">
                      <button className="action-button view-button-small">
                        👁️ Ver Detalhes
                      </button>
                      <button className="action-button locate-button">
                        🎯 Localizar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Nenhum funcionário encontrado</h3>
                <p>
                  {searchQuery 
                    ? `Não encontramos funcionários para "${searchQuery}". Tente ajustar sua busca.`
                    : 'Nenhum funcionário cadastrado no sistema.'
                  }
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Map View */
          <div className="map-view">
            <div className="map-container">
              <div className="map-placeholder">
                <div className="map-placeholder-content">
                  <h3>🗺️ Visualização do Mapa</h3>
                  <p>Integração com Google Maps ou OpenStreetMap seria implementada aqui</p>
                  <div className="map-features">
                    <div className="feature-item">
                      <span className="feature-icon">📍</span>
                      <span>Localização dos funcionários</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🚗</span>
                      <span>Rotas e direções</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🏢</span>
                      <span>Escritórios e projetos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Sidebar */}
            <div className="map-sidebar">
              <h4>Funcionários Próximos</h4>
              <div className="nearby-employees">
                {filteredEmployees.slice(0, 5).map(employee => (
                  <div key={employee.id} className="nearby-employee-item">
                    <div className="employee-mini-avatar">
                      {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                    </div>
                    <div className="employee-mini-info">
                      <p className="employee-name">{employee.firstName} {employee.lastName}</p>
                      <p className="employee-location">
                        📍 {employee.address.city}, {employee.address.state}
                      </p>
                    </div>
                    <button 
                      className="locate-mini-button"
                      onClick={() => handleEmployeeSelect(employee)}
                    >
                      🎯
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Employee Details Modal */}
      {selectedEmployee && (
        <div className="employee-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Detalhes do Funcionário</h3>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="close-button"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="employee-full-info">
                <div className="employee-avatar-large">
                  {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
                </div>
                
                <div className="employee-details-grid">
                  <div className="detail-section">
                    <h4>Informações Pessoais</h4>
                    <div className="detail-row">
                      <span className="detail-label">Nome:</span>
                      <span className="detail-value">
                        {selectedEmployee.firstName} {selectedEmployee.lastName}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedEmployee.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Telefone:</span>
                      <span className="detail-value">{selectedEmployee.phone}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Informações Profissionais</h4>
                    <div className="detail-row">
                      <span className="detail-label">Cargo:</span>
                      <span className="detail-value">{selectedEmployee.position}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Departamento:</span>
                      <span className="detail-value">{selectedEmployee.department}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">{getStatusBadge(selectedEmployee.status)}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Localização</h4>
                    <div className="detail-row">
                      <span className="detail-label">Endereço:</span>
                      <span className="detail-value">
                        {selectedEmployee.address.street}, {selectedEmployee.address.number}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Cidade:</span>
                      <span className="detail-value">
                        {selectedEmployee.address.city}, {selectedEmployee.address.state}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">CEP:</span>
                      <span className="detail-value">{selectedEmployee.address.zipCode}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="action-button primary-button">
                📧 Enviar Email
              </button>
              <button className="action-button secondary-button">
                📞 Ligar
              </button>
              <button className="action-button secondary-button">
                🗺️ Ver no Mapa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapsPage;

