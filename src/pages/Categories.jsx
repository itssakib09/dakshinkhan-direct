import { Link } from 'react-router-dom'

function Categories() {
  const mockCategories = ['restaurants', 'shops', 'services', 'real-estate']

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Categories – Dakshinkhan Direct</h1>
      <p className="text-gray-600 mb-6">Browse all business categories</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mockCategories.map(cat => (
          <Link 
            key={cat}
            to={`/categories/${cat}`}
            className="bg-blue-100 p-6 rounded-lg hover:bg-blue-200 transition"
          >
            <h3 className="text-xl font-semibold capitalize">{cat}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Categories