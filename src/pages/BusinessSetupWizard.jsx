import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, updateUserProfile } from '../services/userService'
import WizardLayout from '../components/onboarding/WizardLayout'
import StepStoreInfo from '../components/onboarding/StepStoreInfo'
import StepAreas from '../components/onboarding/StepAreas'
import StepHours from '../components/onboarding/StepHours'
import StepFinish from '../components/onboarding/StepFinish'

function BusinessSetupWizard() {
  const { currentUser, userProfile } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    storeName: '',
    businessType: '',
    serviceAreas: [],
    openingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: false },
    },
    defaultHours: { open: '09:00', close: '18:00' },
    storeActive: true,
  })

  useEffect(() => {
    async function checkOnboarding() {
      if (!currentUser) {
        navigate('/login')
        return
      }

      try {
        const profile = await getUserProfile(currentUser.uid)
        
        if (profile?.onboardingComplete) {
          navigate('/dashboard')
          return
        }

        if (profile?.role === 'customer') {
          navigate('/')
          return
        }

        setLoading(false)
      } catch (error) {
        console.error('Error checking onboarding:', error)
        setLoading(false)
      }
    }

    checkOnboarding()
  }, [currentUser, navigate])

  const totalSteps = 4

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = async () => {
    try {
      setSaving(true)

      await updateUserProfile(currentUser.uid, {
        storeSettings: {
          storeName: formData.storeName,
          storePhone: userProfile?.phone || '',
          businessType: formData.businessType,
          serviceAreas: formData.serviceAreas,
          openingHours: formData.openingHours,
          defaultHours: formData.defaultHours,
          storeActive: formData.storeActive,
        },
        onboardingComplete: true,
      })

      navigate('/dashboard')
    } catch (error) {
      console.error('Error completing setup:', error)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading setup...</p>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepStoreInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        )
      case 2:
        return (
          <StepAreas
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 3:
        return (
          <StepHours
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 4:
        return (
          <StepFinish
            formData={formData}
            updateFormData={updateFormData}
            onFinish={handleFinish}
            onBack={prevStep}
            saving={saving}
          />
        )
      default:
        return null
    }
  }

  return (
    <WizardLayout currentStep={currentStep} totalSteps={totalSteps}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </WizardLayout>
  )
}

export default BusinessSetupWizard