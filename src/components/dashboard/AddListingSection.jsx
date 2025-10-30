import { Input, Button } from '../ui'

function AddListingSection() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Add New Listing</h2>
        <p className="text-gray-600 mt-1">Create a new business listing</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Business Name"
              placeholder="Enter business name"
              required
            />
            <Input
              label="Category"
              placeholder="Select category"
              required
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+880 XXX-XXXXXXX"
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="business@example.com"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Describe your business..."
            />
          </div>

          <Input
            label="Address"
            placeholder="Full address"
            required
          />

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Opening Time"
              type="time"
            />
            <Input
              label="Closing Time"
              type="time"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-2">Drag & drop images here, or click to select</p>
              <input type="file" multiple className="hidden" id="file-upload" />
              <label htmlFor="file-upload">
                <Button variant="outline" type="button">
                  Choose Files
                </Button>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button variant="primary" fullWidth>
              Submit Listing
            </Button>
            <Button variant="ghost" fullWidth type="button">
              Save as Draft
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddListingSection