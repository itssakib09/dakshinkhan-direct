// src/pages/ServiceProviderSetupWizard.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, updateUserProfile } from '../services/userService'
import WizardLayout from '../components/onboarding/WizardLayout'
import ServiceStepBasicInfo from '../components/onboarding/ServiceStepBasicInfo'
import ServiceStepServices from '../components/onboarding/ServiceStepServices'
import ServiceStepProfessionalInfo from '../components/onboarding/ServiceStepProfessionalInfo'
import ServiceStepAreasAvailability from '../components/onboarding/ServiceStepAreasAvailability'
import ServiceStepFinish from '../components/onboarding/ServiceStepFinish'

function ServiceProviderSetupWizard() {
  const { currentUser, userProfile, refreshUserProfile } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    profession: '',
    coverPhoto: '',
    profilePhoto: '',
    servicesOffered: [],
    coverageAreas: [],
    visitCharge: '',
    experience: '',
    completedJobs: '',
    responseTime: '',
    availability: {
      availableNow: true,
      schedule: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '18:00', closed: false },
        sunday: { open: '09:00', close: '18:00', closed: true },
      }
    }
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

        if (profile?.role === 'business') {
          navigate('/business-setup')
          return
        }

        if (profile?.role === 'customer') {
          navigate('/')
          return
        }

        setFormData(prev => ({
          ...prev,
          fullName: profile?.displayName || '',
          phone: profile?.phone || ''
        }))

        setLoading(false)
      } catch (error) {
        console.error('Error checking onboarding:', error)
        setLoading(false)
      }
    }

    checkOnboarding()
  }, [currentUser, navigate])

  const totalSteps = 5

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

      console.log('[Service Wizard] Saving setup data...')
      await updateUserProfile(currentUser.uid, {
        displayName: formData.fullName,
        displayNameLower: formData.fullName.trim().toLowerCase(),
        phone: formData.phone,
        serviceProfile: {
          profession: formData.profession,
          professionLower: formData.profession.trim().toLowerCase(),
          coverPhoto: formData.coverPhoto,
          profilePhoto: formData.profilePhoto,
          bio: '',
          servicesOffered: formData.servicesOffered,
          coverageAreas: formData.coverageAreas,
          availability: formData.availability,
          visitCharge: formData.visitCharge,
          experience: formData.experience,
          completedJobs: formData.completedJobs,
          responseTime: formData.responseTime,
          recentWorkPhotos: [],
        },
        onboardingComplete: true,
      })

      console.log('[Service Wizard] Setup saved to Firestore')

      console.log('[Service Wizard] Refreshing AuthContext profile state...')
      await refreshUserProfile()
      console.log('[Service Wizard] Profile state refreshed')

      console.log('[Service Wizard] Redirecting to dashboard...')
      navigate('/dashboard')
    } catch (error) {
      console.error('[Service Wizard] Error completing setup:', error)
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
          <ServiceStepBasicInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        )
      case 2:
        return (
          <ServiceStepServices
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 3:
        return (
          <ServiceStepProfessionalInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 4:
        return (
          <ServiceStepAreasAvailability
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )
      case 5:
        return (
          <ServiceStepFinish
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
    <WizardLayout currentStep={currentStep} totalSteps={totalSteps} isService={true}>
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

export default ServiceProviderSetupWizard