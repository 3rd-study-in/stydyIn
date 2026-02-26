/**
 * 스터디 상태 카드 (study-state-card-ON/OFF/frame.png 기반)
 * 너비: 290px 고정 / 높이: 콘텐츠에 따라 유동
 *
 * @param {'recruiting'|'closed'} status  상태 ('recruiting'=모집중, 'closed'=모집완료)
 * @param {number} [dDay]                D-day (음수=D-, 양수=D+)
 * @param {string[]} [selectedDays]      선택된 요일 목록 (예: ['수','금','토'])
 * @param {string} [startDate]           시작일 문자열 (예: "2022. 03. 29(화)")
 * @param {string} [startTime]           시작 시간 (예: "오후 14시")
 * @param {string} [endTime]             종료 시간 (예: "16시")
 * @param {string} [duration]            기간 문자열 (예: "8주/총 24회 48시간")
 * @param {number} [currentCount]        현재 참가자 수
 * @param {number} [maxCount]            최대 참가자 수
 * @param {() => void} [onParticipate]   참여하기 콜백
 * @param {() => void} [onShare]         공유하기 콜백
 * @param {() => void} [onLike]          좋아요 콜백
 * @param {boolean} [isLiked]            좋아요 여부
 * @param {string} [className]           추가 Tailwind 클래스
 */

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

function formatDDay(dDay) {
  if (dDay === undefined || dDay === null) return ' (D-)'
  if (dDay > 0) return ` (D+${dDay})`
  if (dDay < 0) return ` (D${dDay})`
  return ' (D-day)'
}

function StudyStateCard({
  status = 'recruiting',
  dDay,
  selectedDays = [],
  startDate,
  startTime,
  endTime,
  duration,
  currentCount,
  maxCount,
  onParticipate,
  onShare,
  onLike,
  isLiked = false,
  className = '',
}) {
  const isRecruiting = status === 'recruiting'

  const headerBg = isRecruiting ? 'bg-primary-dark' : 'bg-secondary'
  const statusLabel = isRecruiting ? '모집 중!' : '모집 완료'
  const participateBg = isRecruiting
    ? 'bg-primary-dark text-white hover:bg-primary cursor-pointer'
    : 'bg-secondary-light text-text-disabled cursor-not-allowed'

  return (
    <div className={`w-[290px] font-sans ${className}`}>
      {/* 헤더 */}
      <div
        className={`${headerBg} h-[60px] rounded-t-[12px] flex items-center gap-2 px-3 -mb-4 relative z-10`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 9H7L12 4V20L7 15H3V9ZM16.5 12C16.5 10.23 15.5 8.71 14 7.97V16.02C15.5 15.29 16.5 13.77 16.5 12ZM14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z"
            fill="white"
          />
        </svg>
        <span className="text-base font-bold text-white">
          {statusLabel}{formatDDay(dDay)}
        </span>
      </div>

      {/* 바디 */}
      <div className="bg-white border border-border rounded-lg pt-[36px] pb-5 px-5 flex flex-col gap-4">
        {/* 제목 */}
        <h3 className="text-2xl font-bold text-[#121314] text-center w-full">
          스터디 일정
        </h3>

        {/* 요일 선택기 추후에 tag컴포넌트가 들어갈거임*/}
        <div className="flex items-center justify-between w-full">
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day)
            return (
              <div
                key={day}
                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-sm font-medium ${isSelected
                  ? 'bg-primary-dark text-white'
                  : 'bg-bg-muted text-text-muted'
                  }`}
              >
                {day}
              </div>
            )
          })}
        </div>

        {/* 시작일 */}
        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="text-sm font-bold text-primary">시작일</span>
          <span className="text-sm text-text-muted">{startDate ?? ''}</span>
        </div>

        {/* 시간 */}
        <div className="border-t border-border pt-4 flex items-start justify-between">
          <span className="text-sm font-bold text-primary shrink-0">시간</span>
          <div className="text-right">
            {(startTime || endTime) && (
              <p className="text-sm text-text-muted">
                {startTime ?? ''} ~ {endTime ?? ''}
              </p>
            )}
            {duration && (
              <p className="text-xs text-text-disabled mt-0.5">{duration}</p>
            )}
          </div>
        </div>

        {/* 모집 인원 */}
        <div className="border-t border-border pt-4 flex items-center justify-between">
          <span className="text-sm font-bold text-primary">모집 인원</span>
          <span className="text-sm text-text-muted">
            {currentCount !== undefined && maxCount !== undefined ? (
              <>
                <span className="text-primary font-medium">{currentCount}</span>
                /{maxCount}
              </>
            ) : (
              '0/0'
            )}
          </span>
        </div>

        {/* 참여하기 버튼 */}


        {/* 하단 버튼 행 */}
        <div className="flex gap-2">
          {/* 공유하기 버튼 */}

          {/* 하트 아이콘 */}
          {isLiked ? (
            <></>
          ) : (
            <></>
          )}

        </div>
      </div>
    </div>
  )
}

export default StudyStateCard
