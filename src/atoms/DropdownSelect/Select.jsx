import { OptionList } from './OptionList'
import { useDisclosure } from '../../shared/hooks/useDisclosure'

// Select-box-icon.png 기반
// 렌더: [placeholder or 선택값] [icon (고정 — open/close 상태 무관)]
// Dropdown과의 차이: 우측 아이콘이 상태에 따라 바뀌지 않음 (달력 등 SVG 교체 슬롯)
// width 기본값: 250px (Figma 스펙)

/**
 * @param {{ value: string, label: string }[]} options  옵션 목록
 * @param {string | null} value                         현재 선택값
 * @param {(value: string) => void} onChange
 * @param {string} placeholder                          미선택 시 텍스트
 * @param {React.ReactNode} icon                        우측 고정 아이콘 (SVG 교체 슬롯)
 * @param {string} width                                컨테이너 너비 (예: '250px')
 * @param {string} className                            추가 Tailwind 클래스
 * @param {boolean} disabled
 */
function Select({
  options = [],
  value = null,
  onChange,
  placeholder = '선택하세요',
  icon = null,
  width = '250px',
  className = '',
  disabled = false,
}) {
  const { isOpen, toggle, close, containerRef, triggerBorderClass } = useDisclosure({ disabled })

  const selectedOption = options.find((o) => o.value === value)

  const handleSelect = (option) => {
    onChange?.(option.value)
    close()
  }

  return (
    <div
      ref={containerRef}
      className={`relative font-sans ${className}`}
      style={{ width }}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex items-center h-10 px-3.5 w-full bg-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${triggerBorderClass}`}
      >
        <span
          className={`flex-1 text-sm text-left ${selectedOption ? 'text-text' : 'text-text-disabled'
            }`}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        {icon && <span className="ml-2 shrink-0">{icon}</span>}
      </button>

      {isOpen && <OptionList options={options} value={value} onSelect={handleSelect} />}
    </div>
  )
}

export default Select
