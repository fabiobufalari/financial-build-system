import { useTranslation } from 'react-i18next'
import { FiSettings, FiUsers, FiMapPin, FiPhone, FiMail, FiEdit3, FiSave } from 'react-icons/fi'
import { mockCompanyData } from '../../utils/mockData'
import { useState } from 'react'

/**
 * Página de informações da empresa
 * Company information page
 */
const CompanyPage = () => {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [companyData, setCompanyData] = useState(mockCompanyData)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simula salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('company.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('company.subtitle')}
          </p>
        </div>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t('company.saving')}
            </>
          ) : isEditing ? (
            <>
              <FiSave className="w-4 h-4" />
              {t('company.save')}
            </>
          ) : (
            <>
              <FiEdit3 className="w-4 h-4" />
              {t('company.edit')}
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações da Empresa */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiSettings className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('company.information')}
            </h2>
          </div>

          <div className="space-y-6">
            {/* Nome da Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('company.fields.name')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={companyData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">
                  {companyData.name}
                </div>
              )}
            </div>

            {/* CNPJ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('company.fields.cnpj')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={companyData.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {companyData.cnpj}
                </div>
              )}
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('company.fields.address')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={companyData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {companyData.address}
                </div>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('company.fields.phone')}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={companyData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                  <FiPhone className="w-4 h-4 text-gray-500" />
                  {companyData.phone}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('company.fields.email')}
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={companyData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                  <FiMail className="w-4 h-4 text-gray-500" />
                  {companyData.email}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiUsers className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('company.statistics')}
            </h2>
          </div>

          <div className="space-y-6">
            {/* Total de Funcionários */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {companyData.employees}
              </div>
              <div className="text-sm text-blue-700">
                {t('company.stats.employees')}
              </div>
            </div>

            {/* Projetos Ativos */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {companyData.activeProjects}
              </div>
              <div className="text-sm text-green-700">
                {t('company.stats.activeProjects')}
              </div>
            </div>

            {/* Receita Mensal */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                ${companyData.monthlyRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-purple-700">
                {t('company.stats.monthlyRevenue')}
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <FiMapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{t('company.location')}</span>
            </div>
            <div className="text-sm text-gray-900">
              Toronto, Ontario, Canada
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyPage

