function Admin() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Admin Panel – Dakshinkhan Direct</h1>
      <p className="text-red-600 mb-6">⚠️ Admin only (Protected route)</p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-bold mb-2">Manage Stores</h3>
          <p className="text-gray-600">Approve, edit, or remove store listings</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-bold mb-2">Manage Users</h3>
          <p className="text-gray-600">View and manage user accounts</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-bold mb-2">Categories</h3>
          <p className="text-gray-600">Add or edit business categories</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-bold mb-2">Analytics</h3>
          <p className="text-gray-600">View site statistics</p>
        </div>
      </div>
    </div>
  )
}

export default Admin