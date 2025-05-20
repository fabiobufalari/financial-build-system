import { Link } from 'react-router-dom'

/**
 * Componente da página de Not Found (404)
 * Not Found (404) page component
 */
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Página não encontrada</h2>
        <p className="text-gray-600 mt-2">
          A página que você está procurando não existe ou foi movida.
        </p>
        <p className="text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/dashboard" 
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Voltar ao Dashboard / Back to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound
