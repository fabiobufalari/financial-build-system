import React, { useState } from 'react';
import { FiPlus, FiX, FiUpload, FiPaperclip, FiMapPin, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { dashboardService } from '../../services/dashboardService';

/**
 * Interface para dados do modal
 * Interface for modal data
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Componente de modal para registro rápido de despesas
 * Quick expense registration modal component
 */
const ExpenseModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [expenseData, setExpenseData] = useState({
    projectId: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    supplierId: '',
    supplierName: '',
    attachments: [] as File[]
  });
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  
  // Lista simulada de projetos
  // Simulated project list
  const projects = [
    { id: 'proj-001', name: 'Residência Maple Heights' },
    { id: 'proj-002', name: 'Condomínio Riverside' },
    { id: 'proj-003', name: 'Reforma Commercial Plaza' }
  ];
  
  // Lista simulada de categorias
  // Simulated category list
  const categories = [
    { id: 'cat-001', name: 'Materiais de Construção' },
    { id: 'cat-002', name: 'Mão de Obra' },
    { id: 'cat-003', name: 'Equipamentos' },
    { id: 'cat-004', name: 'Licenças e Taxas' },
    { id: 'cat-005', name: 'Transporte' }
  ];
  
  // Lista simulada de fornecedores
  // Simulated supplier list
  const suppliers = [
    { id: 'sup-001', name: 'Canadian Building Supplies' },
    { id: 'sup-002', name: 'Toronto Tools & Equipment' },
    { id: 'sup-003', name: 'Quebec Lumber Co.' }
  ];
  
  // Função para lidar com mudanças nos campos
  // Function to handle field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpenseData(prev => ({ ...prev, [name]: value }));
  };
  
  // Função para lidar com mudanças nos campos do novo fornecedor
  // Function to handle new supplier field changes
  const handleSupplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({ ...prev, [name]: value }));
  };
  
  // Função para lidar com upload de arquivos
  // Function to handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setExpenseData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };
  
  // Função para remover um arquivo anexado
  // Function to remove an attached file
  const removeFile = (index: number) => {
    setExpenseData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };
  
  // Função para adicionar um novo fornecedor
  // Function to add a new supplier
  const addNewSupplier = () => {
    // Em um ambiente real, esta seria uma chamada para um endpoint real
    // In a real environment, this would be a call to a real endpoint
    setLoading(true);
    
    // Simulação de adição de fornecedor
    // Simulated supplier addition
    setTimeout(() => {
      const newSupplierId = `sup-${Date.now()}`;
      setExpenseData(prev => ({
        ...prev,
        supplierId: newSupplierId,
        supplierName: newSupplier.name
      }));
      setShowSupplierForm(false);
      setLoading(false);
    }, 1000);
  };
  
  // Função para enviar o formulário
  // Function to submit the form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Em um ambiente real, esta seria uma chamada para um endpoint real
      // In a real environment, this would be a call to a real endpoint
      // await dashboardService.registerExpense(expenseData);
      
      // Simulação de envio
      // Simulated submission
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Erro ao registrar despesa / Error registering expense:', error);
      setLoading(false);
    }
  };
  
  // Se o modal não estiver aberto, não renderiza nada
  // If the modal is not open, render nothing
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Cabeçalho / Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {step === 1 ? 'Registrar Nova Despesa' : 'Anexar Evidências'}
          </h2>
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <FiX className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Conteúdo / Content */}
        <div className="p-6">
          {step === 1 ? (
            <>
              {/* Formulário de despesa / Expense form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Projeto
                  </label>
                  <select
                    name="projectId"
                    value={expenseData.projectId}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um projeto</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    name="category"
                    value={expenseData.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor (CAD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="amount"
                      value={expenseData.amount}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      value={expenseData.date}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fornecedor
                  </label>
                  <div className="flex">
                    <select
                      name="supplierId"
                      value={expenseData.supplierId}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={showSupplierForm}
                      required
                    >
                      <option value="">Selecione um fornecedor</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="ml-2 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      onClick={() => setShowSupplierForm(!showSupplierForm)}
                    >
                      {showSupplierForm ? <FiX /> : <FiPlus />}
                    </button>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={expenseData.description}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    placeholder="Descreva a despesa..."
                    required
                  ></textarea>
                </div>
              </div>
              
              {/* Formulário de novo fornecedor / New supplier form */}
              {showSupplierForm && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-3">Novo Fornecedor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newSupplier.name}
                        onChange={handleSupplierChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={newSupplier.email}
                        onChange={handleSupplierChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={newSupplier.phone}
                        onChange={handleSupplierChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Endereço
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="address"
                          value={newSupplier.address}
                          onChange={handleSupplierChange}
                          className="w-full rounded-lg border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg mr-2 hover:bg-gray-200 transition-colors"
                      onClick={() => setShowSupplierForm(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={addNewSupplier}
                      disabled={loading || !newSupplier.name}
                    >
                      {loading ? 'Adicionando...' : 'Adicionar Fornecedor'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Formulário de anexos / Attachments form */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anexar Evidências
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <FiUpload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Clique para selecionar arquivos ou arraste e solte aqui
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Suporta imagens, PDFs e documentos (máx. 10MB)
                    </p>
                  </label>
                </div>
              </div>
              
              {/* Lista de arquivos anexados / Attached files list */}
              {expenseData.attachments.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2">Arquivos Anexados</h3>
                  <div className="space-y-2">
                    {expenseData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <FiPaperclip className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700 truncate max-w-xs">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                        <button
                          type="button"
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          onClick={() => removeFile(index)}
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Rodapé / Footer */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          {step === 1 ? (
            <>
              <button
                type="button"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setStep(2)}
                disabled={!expenseData.projectId || !expenseData.amount || !expenseData.description}
              >
                Próximo: Anexar Evidências
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setStep(1)}
              >
                Voltar
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrar Despesa'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
