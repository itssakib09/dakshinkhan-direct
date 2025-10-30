import clsx from 'clsx'

function PasswordStrength({ strength }) {
  if (!strength || strength.score === 0) return null

  const colorClasses = {
    red: { bg: 'bg-red-500', text: 'text-red-600' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-600' },
    yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-600' },
    green: { bg: 'bg-green-500', text: 'text-green-600' },
  }

  const colors = colorClasses[strength.color]

  return (
    <div className="mt-2">
      {/* Progress bar */}
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={clsx(
              'h-1 flex-1 rounded-full transition-all',
              level <= strength.score
                ? colors.bg
                : 'bg-gray-200'
            )}
          />
        ))}
      </div>
      {/* Feedback */}
      <p className="text-sm text-gray-600">
        <span className={clsx('font-semibold', colors.text)}>
          {strength.label}:
        </span>{' '}
        {strength.feedback}
      </p>
    </div>
  )
}

export default PasswordStrength