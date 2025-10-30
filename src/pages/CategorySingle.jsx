import { useParams, Link } from 'react-router-dom'

function CategorySingle() {
  const { slug } = useParams()

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">
        {slug} – Dakshinkhan Direct
      </h1>
      <p className="text-gray-600 mb-6">
        Showing all businesses in the {slug} category
      </p>

      <div className="space-y-4">
        <Link to="/store/1" className="block bg-white p-4 rounded shadow hover:shadow-md">
          <h3 className="font-bold">Store 1 in {slug}</h3>
          <p className="text-sm text-gray-500">Sample store description</p>
        </Link>
        <Link to="/store/2" className="block bg-white p-4 rounded shadow hover:shadow-md">
          <h3 className="font-bold">Store 2 in {slug}</h3>
          <p className="text-sm text-gray-500">Sample store description</p>
        </Link>
      </div>
    </div>
  )
}

export default CategorySingle