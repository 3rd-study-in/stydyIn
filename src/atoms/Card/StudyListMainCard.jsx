/**
 * 가로형 스터디 목록 카드 (study-list-main.png 기반)
 * 너비: 290px 고정 / 높이: 콘텐츠에 따라 유동
 *
 * @param {'recruiting'|'in_progress'|'completed'|'closed'} status  스터디 상태
 * @param {number} [dDay]          D-day (양수=D+, 음수=D-)
 * @param {string} title           스터디 제목
 * @param {React.ReactNode} [children]  하단 나머지 영역 슬롯
 * @param {string} [className]     추가 Tailwind 클래스
 */

const STATUS_MAP = {
  recruiting: { label: '모집 중!', color: 'text-primary' },
  in_progress: { label: '진행 중', color: 'text-primary' },
  completed: { label: '모집 완료', color: 'text-text-disabled' },
  closed: { label: '종료', color: 'text-text-disabled' },
}

function formatDDay(dDay) {
  if (dDay === undefined || dDay === null) return ''
  if (dDay > 0) return ` (D+${dDay})`
  if (dDay < 0) return ` (D${dDay})`
  return ' (D-day)'
}

function StudyListMainCard({
  status = 'recruiting',
  dDay,
  title,
  children,
  className = '',
}) {
  const { label, color } = STATUS_MAP[status] ?? STATUS_MAP.recruiting

  return (
    <div
      className={`w-[290px] bg-white border border-border rounded-lg overflow-hidden font-sans ${className}`}
    >
      {/* 상단 헤더 — 썸네일 + 상태 + 제목 */}
      <div className="flex items-start gap-[10px] px-3 pt-3 pb-3">
        {/* 썸네일 */}
        <div className="w-[66px] h-[66px] bg-bg-muted border-[0.5px] border-border rounded-lg shrink-0" />

        {/* 정보 컬럼 */}
        <div className="flex flex-col gap-[6px] flex-1 min-w-0">
          {/* 상태 행 */}
          <div className={`flex items-center gap-1 text-xs font-bold ${color}`}>
            {/* 스피커 아이콘 */}

            <span>{label}{formatDDay(dDay)}</span>
          </div>

          {/* 제목 */}
          <p className="text-sm text-text leading-snug line-clamp-2">
            {title}
          </p>
        </div>
      </div>

      {/* 하단 슬롯 */}
      {children && <div>{children}</div>}
    </div>
  )
}

export default StudyListMainCard
