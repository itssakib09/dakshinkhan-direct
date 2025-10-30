import { Input, Button } from '../ui'
import { useAuth } from '../../context/AuthContext'

function ProfileSection() {
  const { currentUser } = useAuth()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Profile Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold mb-4">Profile Picture</h3>
          <div className="text-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl font-bold text-blue-600">
                {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
              </span>
            </div>
            <Button variant="outline" size="sm">
              Change Photo
            </Button>
          </div>
        </div>

        {/* Account Info */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="font-bold mb-4">Account Information</h3>
          <form className="space-y-4">
            <Input
              label="Full Name"
              defaultValue={currentUser?.displayName || ''}
              placeholder="Enter your name"
            />
            <Input
              label="Email"
              type="email"
              defaultValue={currentUser?.email || ''}
              disabled
              helperText="Email cannot be changed"
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+880 XXX-XXXXXXX"
            />
            <Input
              label="Location"
              placeholder="Dakshinkhan, Dhaka"
            />
            <div className="pt-4">
              <Button variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="font-bold mb-4">Security</h3>
        <div className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
          />
          <Button variant="secondary">
            Update Password
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfileSection