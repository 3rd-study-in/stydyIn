/**
 * 세로형 스터디 목록 카드 (study-list.png 기반)
 * 크기: 280×480px 고정 (너비+높이 모두 고정)
 *
 * @param {'recruiting'|'in_progress'|'completed'|'closed'} status  스터디 상태
 * @param {string} [location]      위치 뱃지 텍스트 (없으면 숨김)
 * @param {string} category        주제 태그 (예: '프로젝트')
 * @param {string} difficulty      난이도 태그 ('초급'/'중급'/'고급')
 * @param {string} title           스터디 제목
 * @param {number} currentCount    현재 참가자 수
 * @param {() => void} [onClick]   카드 클릭 콜백
 * @param {React.ReactNode} children  썸네일 영역 슬롯
 * @param {string} [className]     추가 Tailwind 클래스
 */

import Icon from '../Icon/Common/Icon';

// 상태 → 텍스트/색상 매핑
const STATUS_MAP = {
  recruiting: { label: '모집 중!', color: 'text-primary' },
  in_progress: { label: '진행 중', color: 'text-primary' },
  completed: { label: '모집 완료', color: 'text-text-disabled' },
  closed: { label: '종료', color: 'text-text-disabled' },
};

function StudyListCard({
  status = 'recruiting',
  location,
  category,
  difficulty,
  title,
  currentCount,
  onClick,
  children,
  className = '',
}) {
  const { label, color } = STATUS_MAP[status] ?? STATUS_MAP.recruiting;

  return (
    <div
      onClick={onClick}
      className={`relative w-[280px] h-[480px] bg-white  overflow-hidden font-sans ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
    >
      {/* 헤더 — 상태 뱃지 + 위치 뱃지 */}
      <div className="absolute top-0 left-0 w-full h-[52px] px-4 flex items-center justify-between">
        {/* 상태 */}
        <div
          className={`flex items-center gap-1.5 text-base font-bold ${color}`}
        >
          {/* 스피커 아이콘 */}
          <Icon name="Speaker" />
          <span>{label}</span>
        </div>
        {/* 위치 뱃지 */}
        {location && (
          <span className="px-[13px] py-[5px] bg-bg-muted rounded-[26px] text-xs text-text">
            {location}
          </span>
        )}
      </div>

      {/* 썸네일 영역 */}
      <div className="absolute top-[52px] left-0 w-full h-[280px] bg-bg-muted border-y border-border overflow-hidden">
        {children}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="absolute top-[332px] left-0 w-full h-[148px] px-4 py-3 flex flex-col justify-between">
        {/* 태그 뱃지 */}
        <div className="flex items-center gap-2">
          {category && (
            <span className="px-[14px] py-[6px] border border-border rounded-xl text-xs text-text-muted">
              {category}
            </span>
          )}
          {difficulty && (
            <span className="px-[14px] py-[6px] border border-border rounded-xl text-xs text-text-muted">
              {difficulty}
            </span>
          )}
        </div>

        {/* 제목 */}
        <p className="text-base font-bold text-text leading-snug line-clamp-2">
          {title}
        </p>

        {/* 참가자 수 */}
        {currentCount !== undefined && (
          <div className="flex items-center gap-1 text-sm text-text-muted">
            {/* 사람 아이콘 */}

            <span>
              현재{' '}
              <strong className="font-bold text-text">{currentCount}명</strong>
              이 신청했어요.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyListCard;
