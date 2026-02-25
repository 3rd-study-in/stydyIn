import { TriangleDownIcon, TriangleUpIcon } from '../Icon'
import { OptionList } from './OptionList'
import { useDisclosure } from '../../shared/hooks/useDisclosure'

// Dropdown.png / Dropdown-ON.png 기반
// 렌더: [placeholder or 선택값] [▼ / ▲]
// width 기본값: 280px (Figma 스펙)

/**
 * @param {{ value: string, label: string }[]} options  옵션 목록
 * @param {string | null} value                         현재 선택값
 * @param {(value: string) => void} onChange
 * @param {string} placeholder                          미선택 시 텍스트
 * @param {string} width                                컨테이너 너비 (예: '280px')
 * @param {string} className                            추가 Tailwind 클래스
 * @param {boolean} disabled
 */
function Dropdown({
  options = [],
  value = null,
  onChange,
  placeholder = '선택하세요',
  width = '280px',
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
      className={`relative font-['Spoqa_Han_Sans_Neo'] ${className}`}
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
          className={`flex-1 text-sm text-left ${selectedOption ? 'text-[#121314]' : 'text-[#8D9299]'
            }`}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <span className="ml-2 shrink-0">
          {isOpen ? <TriangleUpIcon /> : <TriangleDownIcon />}
        </span>
      </button>

      {isOpen && <OptionList options={options} value={value} onSelect={handleSelect} />}
    </div>
  )
}

export default Dropdown
