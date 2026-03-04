import Icon from '../Icon/Common/Icon'

/**
 * 개별 알림 항목 (notice-list-ON 기반)
 * 크기: 910×40px
 *
 * @param {string} text     알림 내용
 * @param {string} time     시간 표시 (예: "방금", "1시간 전")
 * @param {function} onClose 닫기 버튼 클릭 핸들러
 */
function NotificationItem({ text, time, onClose, checked = true }) {
  return (
    <li className="relative flex items-center w-[910px] min-h-[40px] border border-border rounded-lg px-3 py-[10px]">
      {!checked && (
        <span className="absolute top-0 left-0 w-2.5 h-2.5 bg-error rounded-full" />
      )}
      <span className="text-base text-text pr-24 leading-5">{text}</span>
      <span className="absolute right-9 top-[12px] text-sm text-primary whitespace-nowrap">
        {time}
      </span>
      <button
        onClick={onClose}
        className="absolute right-[10px] top-2.75 flex items-center justify-center"
        aria-label="알림 닫기"
      >
        <Icon name="X" size={18} className="text-secondary-light" />
      </button>
    </li>
  )
}

export default NotificationItem
