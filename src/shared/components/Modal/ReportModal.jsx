import Modal from '../../../atoms/Modal/Modal'

/**
 * 신고 모달 껍데기 (경고창-4.png 기반)
 * 크기: 390×430px / 상단 타이틀 + 하단 2버튼 + children 슬롯
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {() => void} [onConfirm]            왼쪽(신고) 버튼 콜백
 * @param {() => void} [onCancel]             오른쪽(취소) 버튼 콜백 (없으면 onClose)
 * @param {string} [title='신고하기']         상단 타이틀
 * @param {string} [confirmText='신고하기']   왼쪽 버튼 레이블
 * @param {string} [cancelText='취소']        오른쪽 버튼 레이블
 * @param {boolean} [hasOverlay=true]
 * @param {React.ReactNode} [children]        선택 항목 등 콘텐츠 슬롯
 */
function ReportModal({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title = '신고하기',
  confirmText = '신고하기',
  cancelText = '취소',
  hasOverlay = true,
  children,
}) {
  const handleCancel = onCancel ?? onClose

  return (
    <Modal isOpen={isOpen} onClose={onClose} hasOverlay={hasOverlay}>
      <div className="w-[390px] min-h-[430px] bg-white border border-[#D9DBE0] rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.1)] overflow-hidden flex flex-col font-['Spoqa_Han_Sans_Neo']">
        {/* 상단 타이틀 */}
        <div className="pt-6 pb-4 px-6 flex items-center justify-center shrink-0">
          <h2 className="text-2xl font-normal text-[#121314]">{title}</h2>
        </div>

        {/* 콘텐츠 슬롯 */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* 하단 버튼 바 */}
        <div className="h-[50px] flex border-t border-[#D9DBE0] shrink-0">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 border-r border-[#D9DBE0] bg-white text-[#47494D] text-base font-medium hover:bg-[#F3F5FA] transition-colors"
          >
            {confirmText}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-[#F3F5FA] text-[#47494D] text-base font-medium hover:bg-[#E5E7EB] transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ReportModal
