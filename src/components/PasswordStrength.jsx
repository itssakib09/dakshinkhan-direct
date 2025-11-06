import clsx from 'clsx'
import { Check, X } from 'lucide-react'

function PasswordStrength({ strength }) {
  if (!strength) return null

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Password Strength</span>
          <span className={clsx('text-sm font-semibold', strength.textColor)}>
            {strength.label}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={clsx('h-full transition-all duration-300 rounded-full', strength.bgColor)}
            style={{ width: `${strength.percentage}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
        
        <RequirementItem 
          met={strength.requirements.length} 
          text="At least 8 characters" 
        />
        <RequirementItem 
          met={strength.requirements.uppercase} 
          text="One uppercase letter (A-Z)" 
        />
        <RequirementItem 
          met={strength.requirements.lowercase} 
          text="One lowercase letter (a-z)" 
        />
        <RequirementItem 
          met={strength.requirements.number} 
          text="One number (0-9)" 
        />
        <RequirementItem 
          met={strength.requirements.special} 
          text="One special character (!@#$...)" 
        />
      </div>

      {/* Feedback Message */}
      {strength.score < 4 && (
        <p className="text-xs text-gray-600 italic">
          💡 Tip: {strength.feedback}
        </p>
      )}
    </div>
  )
}

function RequirementItem({ met, text }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check size={14} className="text-green-600 flex-shrink-0" />
      ) : (
        <X size={14} className="text-gray-400 flex-shrink-0" />
      )}
      <span className={met ? 'text-green-700 font-medium' : 'text-gray-600'}>
        {text}
      </span>
    </div>
  )
}

export default PasswordStrength