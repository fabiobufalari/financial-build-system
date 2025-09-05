import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { employeeService, Employee } from '../../services/employeeService';
import { companyService } from '../../services/companyService';
import { personService } from '../../services/personService';
import './EmployeePage.css';

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: string;
  hireDate: string;
  companyId: string;
  workLocation: {
    type: 'OFFICE' | 'REMOTE' | 'HYBRID' | 'FIELD';
    address: string;
  };
}

const EmployeePage: React.FC = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form state
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    hireDate: '',
    companyId: '',
    workLocation: {
      type: 'OFFICE',
      address: ''
    }
  });

  useEffect(() => {
    loadEmployees();
  }, []);

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

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.person.firstName.toLowerCase().includes(query) ||
        emp.person.lastName.toLowerCase().includes(query) ||
        emp.person.email.toLowerCase().includes(query) ||
        emp.employeeId.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query)
      );
    }

    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }

    // Filter by company
    if (selectedCompany) {
      filtered = filtered.filter(emp => emp.companyId === selectedCompany);
    }

    return filtered;
  };

  const handleCreateEmployee = async () => {
    try {
      // First create person
      const personData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      };
      
      const person = await personService.createPerson(personData);
      
      // Then create employee
      const employeeData = {
        personId: person.id,
        companyId: formData.companyId,
        position: formData.position,
        department: formData.department,
        salary: parseFloat(formData.salary),
        hireDate: formData.hireDate,
        workLocation: formData.workLocation
      };
      
      await employeeService.create(employeeData);
      await loadEmployees();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Error creating employee');
      console.error('Error creating employee:', err);
    }
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return;
    
    try {
      // Update person data
      const personData = {
        id: editingEmployee.personId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      };
      
      await personService.updatePerson(personData);
      
      // Update employee data
      const employeeData = {
        id: editingEmployee.id,
        companyId: formData.companyId,
        position: formData.position,
        department: formData.department,
        salary: parseFloat(formData.salary),
        hireDate: formData.hireDate,
        workLocation: formData.workLocation
      };
      
      await employeeService.update(editingEmployee.id, employeeData);
      await loadEmployees();
      setShowModal(false);
      setEditingEmployee(null);
      resetForm();
    } catch (err) {
      setError('Error updating employee');
      console.error('Error updating employee:', err);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.delete(id);
        await loadEmployees();
      } catch (err) {
        setError('Error deleting employee');
        console.error('Error deleting employee:', err);
      }
    }
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.person.firstName,
      lastName: employee.person.lastName,
      email: employee.person.email,
      phone: employee.person.phone || '',
      position: employee.position,
      department: employee.department,
      salary: employee.salary.toString(),
      hireDate: employee.hireDate,
      companyId: employee.companyId,
      workLocation: {
        type: (employee.workLocation?.type as 'OFFICE' | 'REMOTE' | 'HYBRID' | 'FIELD') || 'OFFICE',
        address: employee.workLocation?.address || ''
      }
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: '',
      hireDate: '',
      companyId: '',
      workLocation: {
        type: 'OFFICE',
        address: ''
      }
    });
  };

  const filteredEmployees = filterEmployees();
  const departments = [...new Set(employees.map(emp => emp.department))];
  const companies = [...new Set(employees.map(emp => emp.company.name))];

  if (loading) {
    return (
      <div className="employee-page">
        <div className="loading">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="employee-page">
      <div className="page-header">
        <h1>{t('employees.title', 'Employees')}</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          {t('employees.addNew', 'Add New Employee')}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder={t('employees.search', 'Search employees...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-selects">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">{t('employees.allDepartments', 'All Departments')}</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">{t('employees.allCompanies', 'All Companies')}</option>
            {companies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee List */}
      <div className="employee-list">
        {filteredEmployees.length === 0 ? (
          <div className="no-employees">
            {t('employees.noEmployees', 'No employees found')}
          </div>
        ) : (
          <div className="employee-grid">
            {filteredEmployees.map(employee => (
              <div key={employee.id} className="employee-card">
                <div className="employee-header">
                  <h3>{employee.person.firstName} {employee.person.lastName}</h3>
                  <span className={`status ${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </span>
                </div>
                
                <div className="employee-details">
                  <p><strong>ID:</strong> {employee.employeeId}</p>
                  <p><strong>Position:</strong> {employee.position}</p>
                  <p><strong>Department:</strong> {employee.department}</p>
                  <p><strong>Company:</strong> {employee.company.name}</p>
                  <p><strong>Email:</strong> {employee.person.email}</p>
                  <p><strong>Phone:</strong> {employee.person.phone || 'N/A'}</p>
                  <p><strong>Salary:</strong> ${employee.salary.toLocaleString()}</p>
                  <p><strong>Hire Date:</strong> {new Date(employee.hireDate).toLocaleDateString()}</p>
                </div>
                
                <div className="employee-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => openEditModal(employee)}
                  >
                    {t('common.edit', 'Edit')}
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    {t('common.delete', 'Delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingEmployee 
                  ? t('employees.editEmployee', 'Edit Employee')
                  : t('employees.addEmployee', 'Add Employee')
                }
              </h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingEmployee(null);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Salary</label>
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hire Date</label>
                    <input
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Work Location Type</label>
                    <select
                      value={formData.workLocation.type}
                      onChange={(e) => setFormData({
                        ...formData, 
                        workLocation: {
                          ...formData.workLocation,
                          type: e.target.value as 'OFFICE' | 'REMOTE' | 'HYBRID' | 'FIELD'
                        }
                      })}
                    >
                      <option value="OFFICE">Office</option>
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="FIELD">Field</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Work Address</label>
                    <input
                      type="text"
                      value={formData.workLocation.address}
                      onChange={(e) => setFormData({
                        ...formData,
                        workLocation: {
                          ...formData.workLocation,
                          address: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setEditingEmployee(null);
                  resetForm();
                }}
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button 
                className="btn btn-primary"
                onClick={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
              >
                {editingEmployee 
                  ? t('common.update', 'Update')
                  : t('common.create', 'Create')
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;

