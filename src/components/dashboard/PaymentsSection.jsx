import { CreditCard, Download } from 'lucide-react'
import { Button } from '../ui'

function PaymentsSection() {
  const transactions = [
    { id: 1, date: '2025-10-25', description: 'Premium Listing - 1 month', amount: 1500, status: 'Paid' },
    { id: 2, date: '2025-09-25', description: 'Featured Listing', amount: 500, status: 'Paid' },
    { id: 3, date: '2025-08-25', description: 'Premium Listing - 1 month', amount: 1500, status: 'Paid' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Payments & Billing</h2>
        <p className="text-gray-600 mt-1">Manage your payments and subscriptions</p>
      </div>

      {/* Current Plan */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
          <p className="text-3xl font-bold mb-1">Premium</p>
          <p className="text-blue-100 text-sm">৳1,500 / month</p>
          <div className="mt-4 pt-4 border-t border-blue-400">
            <p className="text-sm">Next billing: Nov 25, 2025</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Listings</h3>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-sm text-gray-600 mt-1">of 10 available</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-gray-900">৳3,500</p>
          <p className="text-sm text-gray-600 mt-1">Last 3 months</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Payment Method</h3>
          <Button variant="outline" size="sm">
            Add New
          </Button>
        </div>
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <div className="p-3 bg-blue-100 rounded">
            <CreditCard className="text-blue-600" size={24} />
          </div>
          <div className="flex-1">
            <p className="font-medium">Visa ending in 4242</p>
            <p className="text-sm text-gray-500">Expires 12/2026</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Default
          </span>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">Transaction History</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ৳{transaction.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <Download size={16} />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PaymentsSection