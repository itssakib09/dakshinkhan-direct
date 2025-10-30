import clsx from 'clsx'

function RoleCard({ icon: Icon, title, description, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'p-6 rounded-lg border-2 text-left transition-all w-full',
        'hover:border-blue-300 hover:shadow-md',
        selected
          ? 'border-blue-600 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white'
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={clsx(
            'p-3 rounded-lg',
            selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
          )}
        >
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {selected && (
          <div className="text-blue-600 font-bold text-xl">✓</div>
        )}
      </div>
    </button>
  )
}

export default RoleCard