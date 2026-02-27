/**
 * 메인 피드 우측 "참여 중인 스터디" 섹션 카드 컨테이너 (study-list-main.png 기반)
 * 너비: 290px 고정 / 높이: 아이템 수에 따라 자동 확장
 *
 * @param {React.ReactNode} [children]  내부 study-list 아이템 슬롯
 * @param {string}          [className] 추가 Tailwind 클래스
 */
function StudyListSideCard({ children, className = '' }) {
  return (
    <div
      className={`w-[290px] min-h-[82px] bg-white border border-border rounded-lg  ${className}`}
    >
      {children}
    </div>
  )
}

export default StudyListSideCard
