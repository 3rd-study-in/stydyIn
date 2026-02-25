import Modal from '../../../atoms/Modal/Modal'

/**
 * 사용자 정보 시트 모달 (User-Info.png 기반)
 * 크기: 390×694px / 헤더(태그 + 신고링크 + X버튼) + children 슬롯
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose          X버튼 또는 외부클릭으로 닫기
 * @param {() => void} [onReport]       신고하기 링크 콜백
 * @param {string} [location='']        좌상단 지역 태그 텍스트 (예: '애월읍')
 * @param {boolean} [hasOverlay=true]
 * @param {React.ReactNode} [children]  프로필 콘텐츠 슬롯
 */
function UserInfoModal({
  isOpen,
  onClose,
  onReport,
  location = '',
  hasOverlay = true,
  children,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} hasOverlay={hasOverlay}>
      {/* overflow-visible: X 버튼이 모달 테두리 밖으로 10px 삐져나옴 */}
      <div className="relative w-[390px] h-[694px] font-['Spoqa_Han_Sans_Neo']">
        {/* 모달 카드 본체 */}
        <div className="w-full h-full bg-white border border-[#D9DBE0] rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.1)] overflow-hidden relative">
          {/* 좌상단 지역 태그 */}
          {location && (
            <span className="absolute left-[30px] top-[30px] flex items-center px-[13px] py-[5px] bg-[#F3F5FA] rounded-[26px] text-xs text-[#121314]">
              {location}
            </span>
          )}

          {/* 우상단 신고하기 링크 */}
          {onReport && (
            <button
              type="button"
              onClick={onReport}
              className="absolute right-[75px] top-[34px] text-xs underline text-[#8D9299] hover:text-[#47494D] transition-colors"
            >
              신고하기
            </button>
          )}

          {/* 콘텐츠 슬롯 */}
          <div className="absolute inset-0 top-[60px] overflow-y-auto">{children}</div>
        </div>

        {/* X 닫기 버튼 — 우상단 테두리 밖으로 살짝 삐져나옴 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="모달 닫기"
          className="absolute -right-[10px] -top-[10px] w-9 h-9 bg-[#2E6FF2] rounded-full flex items-center justify-center [filter:drop-shadow(2px_2px_6px_rgba(0,0,0,0.1))] hover:bg-[#1649b8] transition-colors z-10"
        >
          {/* 흰색 X 아이콘 */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </Modal>
  )
}

export default UserInfoModal
