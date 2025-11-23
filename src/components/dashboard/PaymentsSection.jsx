import { motion } from 'framer-motion'
import { CreditCard, Download, Plus, CheckCircle } from 'lucide-react'

function PaymentsSection() {
  const transactions = [
    { id: 1, date: '2025-10-25', description: 'Premium Listing - 1 month', amount: 1500, status: 'Paid' },
    { id: 2, date: '2025-09-25', description: 'Featured Listing', amount: 500, status: 'Paid' },
    { id: 3, date: '2025-08-25', description: 'Premium Listing - 1 month', amount: 1500, status: 'Paid' },
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Payments & Billing</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your payments and subscriptions</p>
      </motion.div>

      {/* Current Plan Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl shadow-xl p-6 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2">Current Plan</h3>
            <p className="text-4xl font-black mb-1">Premium</p>
            <p className="text-primary-100 text-sm">৳1,500 / month</p>
            <div className="mt-6 pt-6 border-t border-primary-400">
              <p className="text-sm font-medium">Next billing: Nov 25, 2025</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Active Listings</h3>
          <p className="text-4xl font-black text-gray-900 dark:text-white">3</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">of 10 available</p>
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 h-2 rounded-full" style={{ width: '30%' }}></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">Total Spent</h3>
          <p className="text-4xl font-black text-gray-900 dark:text-white">৳3,500</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Last 3 months</p>
        </motion.div>
      </div>

      {/* Payment Method */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">Payment Method</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl font-semibold transition-all inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Add New
          </motion.button>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex items-center gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-primary-400 dark:hover:border-primary-600 transition-all"
        >
          <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
            <CreditCard className="text-blue-600 dark:text-blue-400" size={28} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 dark:text-white">Visa ending in 4242</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/2026</p>
          </div>
          <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black rounded-full inline-flex items-center gap-1.5">
            <CheckCircle size={14} />
            Default
          </span>
        </motion.div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">Transaction History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase">Description</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                    ৳{transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold flex items-center gap-1"
                    >
                      <Download size={16} />
                      Download
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentsSection