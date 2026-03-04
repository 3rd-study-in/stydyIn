import Icon from '../Icon/Common/Icon'

/**
 * 메인 알림 카드 개별 아이템 (main-notice-list-ON/OFF.png 기반)
 * 크기: 318×80px
 *
 * ON (isRead=false): 흰 배경 + 테두리 + 빨간 점 + 파란 시간 텍스트
 * OFF (isRead=true) : 회색 배경 + 테두리 없음 + 빨간 점 숨김 + 회색 시간 텍스트
 *
 * @param {string}   text       알림 내용
 * @param {string}   time       시간 텍스트 (예: "3분 전", "2022.04.01")
 * @param {boolean}  [isRead]   읽음 여부 — true: OFF(읽음), false: ON(미읽음), 기본값 false
 * @param {function} [onClose]  X 버튼 클릭 핸들러
 */
function MainNoticeItem({ text, time, isRead = false, onClose }) {
  return (
    <li className="relative w-[318px] h-[80px]">
      {/* 미읽음 빨간 점 */}
      {!isRead && (
        <span className="absolute top-0 left-0 w-2 h-2 rounded-full bg-error z-10" />
      )}

      {/* 아이템 본체 */}
      <div
        className={[
          'w-full h-full flex flex-col items-start p-[10px] rounded-lg',
          isRead ? 'bg-bg-muted' : 'bg-bg border border-border',
        ].join(' ')}
      >
        {/* 텍스트 영역 */}
        <div className="flex flex-col gap-1 w-[270px] h-[60px]">
          <p
            className={[
              'text-sm leading-5 line-clamp-2',
              isRead ? 'text-secondary-dark' : 'text-text',
            ].join(' ')}
          >
            {text}
          </p>
          <span
            className={[
              'text-xs leading-4',
              isRead ? 'text-secondary' : 'text-primary',
            ].join(' ')}
          >
            {time}
          </span>
        </div>
      </div>

      {/* X 닫기 버튼 */}
      <button
        type="button"
        onClick={onClose}
        aria-label="알림 닫기"
        className="absolute right-[10px] top-[10px] w-[18px] h-[18px] rounded-full bg-border flex items-center justify-center shrink-0"
      >
        <Icon name="X" size={10} color="#FFFFFF" />
      </button>
    </li>
  )
}

export default MainNoticeItem
