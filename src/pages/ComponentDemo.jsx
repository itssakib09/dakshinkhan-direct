import { useState } from 'react'
import { Button, Input, Modal } from '../components/ui'

function ComponentDemo() {
  const [modalOpen, setModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  function validateEmail() {
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email')
    } else {
      setEmailError('')
    }
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-2">Component Library Demo</h1>
        <p className="text-gray-600">Test all UI components</p>
      </div>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Buttons</h2>
        
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>

        <Button fullWidth>Full Width Button</Button>
      </section>

      {/* Inputs */}
      <section className="space-y-4 max-w-md">
        <h2 className="text-2xl font-bold">Inputs</h2>
        
        <Input 
          label="Username" 
          placeholder="Enter username"
          helperText="Choose a unique username"
        />

        <Input 
          label="Email" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
          error={emailError}
          required
        />

        <Input 
          label="Password" 
          type="password"
          placeholder="Enter password"
          required
        />

        <Input 
          label="Disabled Input" 
          disabled
          value="Cannot edit"
        />
      </section>

      {/* Modal */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Modal</h2>
        
        <div className="flex gap-4">
          <Button onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
        </div>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Example Modal"
          size="md"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p>
              This is a keyboard-accessible modal. Try these keyboard shortcuts:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Press <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> to close</li>
              <li>Press <kbd className="px-2 py-1 bg-gray-100 rounded">Tab</kbd> to navigate</li>
              <li>Focus stays trapped within the modal</li>
            </ul>
          </div>
        </Modal>
      </section>

      {/* Accessibility Info */}
      <section className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Accessibility Features ♿</h2>
        <ul className="space-y-2">
          <li>✅ All components are keyboard accessible</li>
          <li>✅ Clear focus indicators for keyboard navigation</li>
          <li>✅ Proper ARIA labels and roles</li>
          <li>✅ Modal traps focus and closes with Escape key</li>
          <li>✅ Form inputs have associated labels</li>
          <li>✅ Error messages are announced to screen readers</li>
        </ul>
      </section>
    </div>
  )
}

export default ComponentDemo