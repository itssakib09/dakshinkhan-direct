// src/components/onboarding/ServiceStepServices.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  HiArrowLeft, HiArrowRight,
  HiCheck, HiPlus, HiX
} from 'react-icons/hi'
import { PROFESSION_SERVICES } from '../../data/professionServices'

function ServiceStepServices({ formData, updateFormData, onNext, onBack }) {
  const [error, setError] = useState('')
  const [customServiceName, setCustomServiceName] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const professionServices = PROFESSION_SERVICES[formData.profession] || []

  const isSelected = (serviceName) => {
    return (formData.servicesOffered || []).some(s => s.name === serviceName)
  }

  const getServiceData = (serviceName) => {
    return (formData.servicesOffered || []).find(s => s.name === serviceName)
  }

  const toggleService = (serviceName) => {
    const existing = formData.servicesOffered || []
    const found = existing.find(s => s.name === serviceName)
    if (found) {
      updateFormData({
        servicesOffered: existing.filter(s => s.name !== serviceName)
      })
    } else {
      updateFormData({
        servicesOffered: [
          ...existing,
          { name: serviceName, priceFrom: '', priceTo: '' }
        ]
      })
    }
  }

  const updatePrice = (serviceName, field, value) => {
    updateFormData({
      servicesOffered: (formData.servicesOffered || []).map(s =>
        s.name === serviceName ? { ...s, [field]: value } : s
      )
    })
  }

  const addCustomService = () => {
    const name = customServiceName.trim()
    if (!name) return
    const existing = formData.servicesOffered || []
    if (existing.some(s => s.name === name)) return
    updateFormData({
      servicesOffered: [
        ...existing,
        { name, priceFrom: '', priceTo: '' }
      ]
    })
    setCustomServiceName('')
    setShowCustomInput(false)
  }

  const handleNext = () => {
    if (!formData.servicesOffered?.length) {
      setError('Please select at least one service')
      return
    }
    setError('')
    onNext()
  }

  const customServices = (formData.servicesOffered || [])
    .filter(s => !professionServices.includes(s.name))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
        Services & Prices
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Select services you offer as a {formData.profession} and set prices
      </p>

      {(formData.servicesOffered || []).length > 0 && (
        <p className="mb-4 text-sm font-semibold text-primary-600 dark:text-primary-400">
          {formData.servicesOffered.length} services selected
        </p>
      )}

      {professionServices.length > 0 && (
        <div className="max-h-96 overflow-y-auto scrollbar-hide space-y-2 mb-4">
          {professionServices.map(service => {
            const selected = isSelected(service)
            const data = getServiceData(service)
            return (
              <div
                key={service}
                className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div
                  onClick={() => toggleService(service)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                    selected ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                    selected ? 'bg-primary-600' : 'border-2 border-gray-300 dark:border-gray-600'
                  }`}>
                    {selected && <HiCheck size={12} className="text-white" />}
                  </div>
                  <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {service}
                  </span>
                </div>

                {selected && (
                  <div className="px-3 pb-3 bg-primary-50 dark:bg-primary-900/20">
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">
                      Price range (optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="৳ Min"
                        value={data?.priceFrom || ''}
                        onChange={(e) => updatePrice(service, 'priceFrom', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                      />
                      <input
                        type="number"
                        placeholder="৳ Max"
                        value={data?.priceTo || ''}
                        onChange={(e) => updatePrice(service, 'priceTo', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {professionServices.length === 0 && (
        <div className="text-center py-6 text-sm text-gray-400 dark:text-gray-500 mb-4">
          No predefined services found for this profession.
          Add your own services below.
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        {!showCustomInput ? (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-semibold"
          >
            <HiPlus size={16} />
            Add Custom Service
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={customServiceName}
              onChange={(e) => setCustomServiceName(e.target.value)}
              placeholder="Enter service name"
              className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white"
            />
            <button
              type="button"
              onClick={addCustomService}
              className="bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => { setShowCustomInput(false); setCustomServiceName('') }}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2.5 rounded-xl"
            >
              <HiX size={16} />
            </button>
          </div>
        )}

        {customServices.length > 0 && (
          <div className="mt-3 space-y-2">
            {customServices.map(service => {
              const selected = true
              const data = getServiceData(service.name)
              return (
                <div
                  key={service.name}
                  className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div
                    onClick={() => toggleService(service.name)}
                    className="flex items-center gap-3 p-3 cursor-pointer transition-colors bg-primary-50 dark:bg-primary-900/20"
                  >
                    <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 bg-primary-600">
                      <HiCheck size={12} className="text-white" />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {service.name}
                    </span>
                  </div>

                  <div className="px-3 pb-3 bg-primary-50 dark:bg-primary-900/20">
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">
                      Price range (optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="৳ Min"
                        value={data?.priceFrom || ''}
                        onChange={(e) => updatePrice(service.name, 'priceFrom', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                      />
                      <input
                        type="number"
                        placeholder="৳ Max"
                        value={data?.priceTo || ''}
                        onChange={(e) => updatePrice(service.name, 'priceTo', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600 dark:text-red-400 font-semibold">
          {error}
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-4 px-6 rounded-xl shadow flex items-center justify-center gap-2 transition-all"
        >
          <HiArrowLeft size={20} />
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          Continue
          <HiArrowRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ServiceStepServices