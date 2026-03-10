import Icon from '../Icon/Common/Icon';
import { OptionList } from './OptionList';
import { useDisclosure } from '../../shared/hooks/useDisclosure';

// filter-dropdown-OFF.png / filter-dropdown-ON.png 기반
// 렌더: [🔽 FilterIcon] [label] [▼ / ▲]
// width 기본값: 170px (Figma 스펙)

/**
 * @param {{ value: string, label: string }[]} options  옵션 목록
 * @param {string | null} value                         현재 선택값
 * @param {(value: string) => void} onChange
 * @param {string} label                                칩 레이블 텍스트
 * @param {string} width                                컨테이너 너비 (예: '170px')
 * @param {string} className                            추가 Tailwind 클래스
 * @param {boolean} disabled
 */
function FilterDropdown({
  options = [],
  value = null,
  onChange,
  label = '검색 필터',
  width = '170px',
  className = '',
  disabled = false,
  iconName = 'Filter',
}) {
  const { isOpen, toggle, close, containerRef, triggerBorderClass } =
    useDisclosure({ disabled });

  const handleSelect = (option) => {
    onChange?.(option.value);
    close();
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block font-sans ${className}`}
      style={{ width }}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 h-10 px-3 w-full bg-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${triggerBorderClass}`}
      >
        <Icon name={iconName} />
        <span className="flex-1 text-left text-base font-medium text-text-muted">
          {label}
        </span>
        {isOpen ? (
          <Icon name="TriangleUpIcon" />
        ) : (
          <Icon name="TriangleDownIcon" />
        )}
      </button>

      {isOpen && options.length > 0 && (
        <OptionList options={options} value={value} onSelect={handleSelect} />
      )}
    </div>
  );
}

export default FilterDropdown;
