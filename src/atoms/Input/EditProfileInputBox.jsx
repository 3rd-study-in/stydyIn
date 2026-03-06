import { useState } from 'react'

// Edit-profile-input-box.png 기반

function EditProfileInputBox({
  label,
  required = false,
  value = '',
  onChange,
  placeholder = '',
  disabled = false,
  width = '282px',
  labelWidth = 'auto',
  className = '',
}) {
  const [isFocused, setIsFocused] = useState(false)

  const borderStyle = isFocused && !disabled
    ? 'border-2 border-info'
    : 'border border-border'

  return (
    <div className={`font-['Spoqa_Han_Sans_Neo'] flex items-center gap-[64px] ${className}`}>
      {label && (
        <label className="text-sm text-text shrink-0" style={{ minWidth: labelWidth }}>
          {label}
          {required && <span className="text-error">*</span>}
        </label>
      )}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        style={{ width }}
        className={`
          h-10 px-[13px] rounded-[8px] outline-none
          text-base text-text placeholder:text-text-disabled
          ${borderStyle}
          ${disabled ? 'bg-bg-muted cursor-not-allowed' : 'bg-white'}
        `}
      />
    </div>
  )
}

export default EditProfileInputBox