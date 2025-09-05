import { useTranslation } from 'react-i18next'

const PAGE_NAME = () => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          MENU_KEY
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">
          Página em desenvolvimento. Funcionalidades serão implementadas em breve.
        </p>
      </div>
    </div>
  )
}

export default PAGE_NAME
