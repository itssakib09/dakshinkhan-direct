import { useParams } from 'react-router-dom'

function Store() {
  const { id } = useParams()

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Store #{id} – Dakshinkhan Direct</h1>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-2">Store Name</h2>
        <p className="text-gray-600 mb-4">Category: Restaurants</p>
        <p>Address: Dakshinkhan, Dhaka</p>
        <p>Phone: +880 123-456-7890</p>
        <p className="mt-4">Full store details will be displayed here.</p>
      </div>
    </div>
  )
}

export default Store