import React, { useState, useEffect } from 'react';
import { employeeService, Employee } from '../../services/employeeService';
import './EmployeePage.css';

// EN: Employee management page with search functionality for Maps feature
// PT: Página de gerenciamento de funcionários com funcionalidade de busca para o recurso Maps

interface EmployeePageProps {
  // Props can be added here if needed
}

const EmployeePage: React.FC<EmployeePageProps> = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Department options
  const departments = ['Engenharia', 'Projetos', 'Produção', 'Administrativo', 'Financeiro', 'RH'];
  const statusOptions = ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'];

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchQuery, selectedDepartment, selectedStatus]);

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
    let filtered = [...employees];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.employeeId.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query)
      );
    }

    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(emp => emp.status === selectedStatus);
    }

    setFilteredEmployees(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setShowCreateModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowCreateModal(true);
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await employeeService.deleteEmployee(id);
        await loadEmployees();
      } catch (err) {
        setError('Erro ao excluir funcionário');
        console.error('Error deleting employee:', err);
      }
    }
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
      <div className="employee-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando funcionários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-page">
      <div className="page-header">
        <h1>Funcionários & Custos</h1>
        <p>Gerencie funcionários e controle custos de pessoal</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nome, email, ID ou cargo..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-container">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Departamentos</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === 'ACTIVE' ? 'Ativo' : 
                 status === 'INACTIVE' ? 'Inativo' :
                 status === 'ON_LEAVE' ? 'Licença' : 'Desligado'}
              </option>
            ))}
          </select>

          <button 
            onClick={handleCreateEmployee}
            className="create-button"
          >
            + Novo Funcionário
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Mostrando {filteredEmployees.length} de {employees.length} funcionários
          {searchQuery && ` para "${searchQuery}"`}
        </p>
      </div>

      {/* Employee Cards Grid */}
      <div className="employee-grid">
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="employee-card">
            <div className="employee-header">
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

            <div className="employee-details">
              <div className="detail-row">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{employee.employeeId}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{employee.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Telefone:</span>
                <span className="detail-value">{employee.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Salário:</span>
                <span className="detail-value">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(employee.salary)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Admissão:</span>
                <span className="detail-value">
                  {new Date(employee.hireDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="employee-actions">
              <button 
                onClick={() => handleEditEmployee(employee)}
                className="action-button edit-button"
              >
                ✏️ Editar
              </button>
              <button 
                onClick={() => handleDeleteEmployee(employee.id)}
                className="action-button delete-button"
                disabled={employee.status === 'TERMINATED'}
              >
                🗑️ Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>Nenhum funcionário encontrado</h3>
          <p>
            {searchQuery || selectedDepartment || selectedStatus
              ? 'Tente ajustar os filtros de busca'
              : 'Comece adicionando um novo funcionário'
            }
          </p>
          {!searchQuery && !selectedDepartment && !selectedStatus && (
            <button onClick={handleCreateEmployee} className="create-button">
              + Adicionar Primeiro Funcionário
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Modal would go here */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
            <p>Modal de criação/edição será implementado aqui</p>
            <button onClick={() => setShowCreateModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;

