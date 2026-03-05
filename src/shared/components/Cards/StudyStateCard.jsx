import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import Icon from '../../../atoms/Icon/Common/Icon';

/**
 * 스터디 상태 카드 (study-state-card-ON/OFF/frame.png 기반)
 * 너비: 290px 고정 / 높이: 콘텐츠에 따라 유동
 *
 * @param {'recruiting'|'in_progress'|'completed'|'closed'} status  상태
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

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

function formatDDay(dDay) {
  if (dDay === undefined || dDay === null) return ' (D-)';
  if (dDay > 0) return ` (D+${dDay})`;
  if (dDay < 0) return ` (D${dDay})`;
  return ' (D-day)';
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
  onEdit,
  onLike,
  isLiked = false,
  isOwner = false,
  className = '',
}) {
  const STATUS_CONFIG = {
    recruiting: {
      label: '모집 중!',
      headerBg: 'bg-primary-dark',
      canParticipate: true,
    },
    in_progress: {
      label: '진행 중!',
      headerBg: 'bg-accent',
      canParticipate: true,
    },
    completed: {
      label: '모집 완료',
      headerBg: 'bg-secondary',
      canParticipate: false,
    },
    closed: { label: '종료', headerBg: 'bg-secondary', canParticipate: false },
  };

  const {
    label: statusLabel,
    headerBg,
    canParticipate,
  } = STATUS_CONFIG[status] ?? STATUS_CONFIG.recruiting;

  const handleShareLink = () => {
    if (onShare) onShare();
  };

  const handleLikeToggle = () => {
    if (onLike) onLike();
  };

  return (
    <div className={`w-[290px] font-sans tracking-wide ${className}`}>
      {/* 헤더 */}
      <div
        className={`${headerBg} rounded-t-[12px] pt-sm flex items-center pb-2xl gap-xxs px-md -mb-lg relative z-10`}
      >
        <Icon name="Speaker" color="white" size={24} />
        <span className="text-base font-bold text-white">
          {statusLabel}
          {formatDDay(dDay)}
        </span>
      </div>

      {/* 바디 */}
      <div className="bg-white border border-border rounded-lg pt-xl pb-5 px-5 flex flex-col gap-xl z-30 relative drop-shadow-lg">
        {/* 제목 */}
        <h3 className="text-2xl font-bold text-text text-center w-full">
          스터디 일정
        </h3>

        {/* 요일 선택기 추후에 tag컴포넌트가 들어갈거임*/}
        <div className="flex items-center justify-between w-full">
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <div
                key={day}
                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-base font-regular ${
                  isSelected
                    ? 'bg-primary-dark text-white'
                    : 'bg-bg-muted text-secondary'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* 시작일 */}
        <div className="border-t-2 border-secondary-light pt-lg flex items-center justify-between">
          <span className="text-lg font-bold text-primary">시작일</span>
          <span className="text-lg text-primary">{startDate ?? ''}</span>
        </div>

        {/* 시간 */}
        <div className="border-t-2 border-secondary-light pt-lg flex items-start justify-between">
          <span className="text-lg font-bold text-text">시간</span>
          <div className="text-right">
            {(startTime || endTime) && (
              <p className="text-lg text-text">
                {startTime ?? ''} ~ {endTime ?? ''}
              </p>
            )}
            {duration && (
              <p className="text-base font-regular text-secondary mt-0.5">
                {duration}
              </p>
            )}
          </div>
        </div>

        {/* 모집 인원 */}
        <div className="border-t-2 border-secondary-light pt-lg flex items-center justify-between">
          <span className="text-lg font-bold text-text">모집 인원</span>
          <span className="text-lg text-text-muted">
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

        <div className="flex flex-col gap-sm">
          {/* 참여하기 버튼 */}
          <FlexibleButton
            variant="blue"
            size="L"
            width="100%"
            onClick={canParticipate ? onParticipate : undefined}
            disabled={!canParticipate}
            className="transition-transform"
          >
            <span className="text-lg font-medium">참여하기</span>
          </FlexibleButton>

          {/* 하단 버튼 행 */}
          <div className="flex w-full gap-2">
            {isOwner ? (
              <FlexibleButton
                variant="white"
                size="L"
                width="100%"
                onClick={onEdit}
                className="flex-1 border-secondary-light transition-transform cursor-pointer"
              >
                <span className="text-lg font-medium">수정</span>
              </FlexibleButton>
            ) : (
              <FlexibleButton
                variant="white"
                size="L"
                width="200px"
                onClick={handleShareLink}
                className="flex-1 border-secondary-light transition-transform cursor-pointer"
              >
                <span className="flex items-center justify-center gap-xs">
                  <Icon name="Share" size={20} />
                  <span className="text-lg font-medium">공유하기</span>
                </span>
              </FlexibleButton>
            )}

            {isOwner && (
              <FlexibleButton
                variant="white"
                size="L"
                width="50px"
                onClick={handleShareLink}
                className="border-secondary-light cursor-pointer transition-transform px-0! shrink-0"
              >
                <div className="flex items-center justify-center w-full h-full">
                  <Icon
                    name="Share"
                    size={20}
                    className="text-secondary-dark"
                  />
                </div>
              </FlexibleButton>
            )}

            <FlexibleButton
              variant="white"
              size="L"
              width="50px"
              onClick={handleLikeToggle}
              className="border-secondary-light cursor-pointer transition-transform px-0! shrink-0"
            >
              <div className="flex items-center justify-center w-full h-full">
                {isLiked ? (
                  <Icon
                    name="HeartFill"
                    size={20}
                    className="text-accent-dark"
                  />
                ) : (
                  <Icon name="Heart" size={20} className="text-secondary" />
                )}
              </div>
            </FlexibleButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyStateCard;
