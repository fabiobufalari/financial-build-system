import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { employeeService, Employee } from '../../services/employeeService';
import './MapsPage.css';

interface MapLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  employees: Employee[];
  type: 'OFFICE' | 'REMOTE' | 'HYBRID' | 'FIELD';
}

// Helper function to format address object as string
const formatAddress = (address: any): string => {
  if (typeof address === 'string') {
    return address;
  }
  if (address && typeof address === 'object') {
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  }
  return 'No address';
};

const MapsPage: React.FC = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchQuery, selectedLocation]);

  useEffect(() => {
    generateLocations();
  }, [employees]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAll();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Error loading employees');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    // Filter by search query (name or email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.person.firstName.toLowerCase().includes(query) ||
        emp.person.lastName.toLowerCase().includes(query) ||
        emp.person.email.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query)
      );
    }

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(emp => 
        emp.workLocation?.address?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  };

  const generateLocations = () => {
    const locationMap = new Map<string, MapLocation>();

    employees.forEach(employee => {
      const address = formatAddress(employee.workLocation?.address || employee.company.address || 'Unknown Location');
      const locationType = (employee.workLocation?.type as 'OFFICE' | 'REMOTE' | 'HYBRID' | 'FIELD') || 'OFFICE';
      
      if (!locationMap.has(address)) {
        locationMap.set(address, {
          id: `loc-${locationMap.size + 1}`,
          name: address,
          address: address,
          coordinates: generateRandomCoordinates(),
          employees: [],
          type: locationType
        });
      }
      
      locationMap.get(address)!.employees.push(employee);
    });

    setLocations(Array.from(locationMap.values()));
  };

  const generateRandomCoordinates = () => {
    // Generate random coordinates around a central point (example: São Paulo)
    const baseLat = -23.5505;
    const baseLng = -46.6333;
    const range = 0.1; // ~11km range
    
    return {
      lat: baseLat + (Math.random() - 0.5) * range,
      lng: baseLng + (Math.random() - 0.5) * range
    };
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeDetails(true);
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case 'OFFICE': return '#2196F3';
      case 'REMOTE': return '#4CAF50';
      case 'HYBRID': return '#FF9800';
      case 'FIELD': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'OFFICE': return '🏢';
      case 'REMOTE': return '🏠';
      case 'HYBRID': return '🔄';
      case 'FIELD': return '🚗';
      default: return '📍';
    }
  };

  if (loading) {
    return (
      <div className="maps-page">
        <div className="loading">Loading employee locations...</div>
      </div>
    );
  }

  return (
    <div className="maps-page">
      <div className="page-header">
        <h1>{t('maps.title', 'Employee Locations')}</h1>
        <div className="maps-stats">
          <span className="stat">
            <strong>{employees.length}</strong> {t('maps.totalEmployees', 'Total Employees')}
          </span>
          <span className="stat">
            <strong>{locations.length}</strong> {t('maps.locations', 'Locations')}
          </span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="maps-controls">
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder={t('maps.searchEmployees', 'Search employees by name, position, or department...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-section">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="location-filter"
            >
              <option value="">{t('maps.allLocations', 'All Locations')}</option>
              {locations.map(location => (
                <option key={location.id} value={location.address}>
                  {location.name} ({location.employees.length} employees)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="maps-content">
        {/* Map Visualization */}
        <div className="map-section">
          <div className="map-container">
            <div className="map-placeholder">
              <h3>{t('maps.mapView', 'Map View')}</h3>
              <p>{t('maps.mapPlaceholder', 'Interactive map would be displayed here')}</p>
              
              {/* Location Markers */}
              <div className="location-markers">
                {locations.map(location => (
                  <div 
                    key={location.id} 
                    className="location-marker"
                    style={{ backgroundColor: getLocationTypeColor(location.type) }}
                    onClick={() => setSelectedLocation(location.address)}
                  >
                    <span className="marker-icon">
                      {getLocationTypeIcon(location.type)}
                    </span>
                    <div className="marker-info">
                      <strong>{location.name}</strong>
                      <span>{location.employees.length} employees</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="map-legend">
            <h4>{t('maps.legend', 'Location Types')}</h4>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#2196F3' }}></span>
                <span>🏢 Office</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#4CAF50' }}></span>
                <span>🏠 Remote</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#FF9800' }}></span>
                <span>🔄 Hybrid</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#9C27B0' }}></span>
                <span>🚗 Field</span>
              </div>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="employee-list-section">
          <h3>{t('maps.employeeList', 'Employee List')} ({filteredEmployees.length})</h3>
          
          {filteredEmployees.length === 0 ? (
            <div className="no-employees">
              {t('maps.noEmployeesFound', 'No employees found matching your criteria')}
            </div>
          ) : (
            <div className="employee-cards">
              {filteredEmployees.map(employee => (
                <div 
                  key={employee.id} 
                  className="employee-card"
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <div className="employee-avatar">
                    {employee.person.firstName[0]}{employee.person.lastName[0]}
                  </div>
                  
                  <div className="employee-info">
                    <h4>{employee.person.firstName} {employee.person.lastName}</h4>
                    <p className="employee-position">{employee.position}</p>
                    <p className="employee-department">{employee.department}</p>
                    <p className="employee-company">{employee.company.name}</p>
                  </div>
                  
                  <div className="employee-location">
                    <span className="location-type" style={{ color: getLocationTypeColor(employee.workLocation?.type || 'OFFICE') }}>
                      {getLocationTypeIcon(employee.workLocation?.type || 'OFFICE')}
                    </span>
                    <span className="location-address">
                      {formatAddress(employee.workLocation?.address || employee.company.address) || 'No address'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Employee Details Modal */}
      {showEmployeeDetails && selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal employee-details-modal">
            <div className="modal-header">
              <h2>
                {selectedEmployee.person.firstName} {selectedEmployee.person.lastName}
              </h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowEmployeeDetails(false);
                  setSelectedEmployee(null);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="employee-details-grid">
                <div className="detail-section">
                  <h3>{t('maps.personalInfo', 'Personal Information')}</h3>
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedEmployee.person.firstName} {selectedEmployee.person.lastName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedEmployee.person.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedEmployee.person.phone || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>{t('maps.workInfo', 'Work Information')}</h3>
                  <div className="detail-item">
                    <label>Employee ID:</label>
                    <span>{selectedEmployee.employeeId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Position:</label>
                    <span>{selectedEmployee.position}</span>
                  </div>
                  <div className="detail-item">
                    <label>Department:</label>
                    <span>{selectedEmployee.department}</span>
                  </div>
                  <div className="detail-item">
                    <label>Company:</label>
                    <span>{selectedEmployee.company.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status ${selectedEmployee.status.toLowerCase()}`}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>{t('maps.locationInfo', 'Location Information')}</h3>
                  <div className="detail-item">
                    <label>Work Type:</label>
                    <span>
                      {getLocationTypeIcon(selectedEmployee.workLocation?.type || 'OFFICE')} 
                      {selectedEmployee.workLocation?.type || 'OFFICE'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Work Address:</label>
                    <span>{formatAddress(selectedEmployee.workLocation?.address || selectedEmployee.company.address) || 'No address'}</span>
                  </div>
                  {selectedEmployee.workLocation?.coordinates && (
                    <div className="detail-item">
                      <label>Coordinates:</label>
                      <span>
                        {selectedEmployee.workLocation.coordinates.latitude}, 
                        {selectedEmployee.workLocation.coordinates.longitude}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowEmployeeDetails(false);
                  setSelectedEmployee(null);
                }}
              >
                {t('common.close', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapsPage;

