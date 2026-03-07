import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import Icon from '../../../atoms/Icon/Common/Icon';

/**
 * 스터디 생성/수정 페이지 사이드바 카드
 * StudyStateCard와 유사한 구조, AI 생성 + 제출 버튼 포함
 *
 * @param {boolean} [isEdit]          수정 모드 여부
 * @param {string} [title]            스터디 제목 (AI 버튼 활성화 조건)
 * @param {boolean} [isSubmitting]    제출 중 여부
 * @param {boolean} [isGenerating]    AI 생성 중 여부
 * @param {boolean} [hasGenerated]    AI 생성 완료 여부
 * @param {string} [aiError]          AI 에러 메시지
 * @param {() => void} [onSubmit]     제출 콜백
 * @param {() => void} [onAiGenerate] AI 생성 콜백
 * @param {string} [className]        추가 Tailwind 클래스
 */
function StudyFormSideCard({
  isEdit = false,
  title = '',
  isSubmitting = false,
  isGenerating = false,
  hasGenerated = false,
  aiError = '',
  onSubmit,
  onAiGenerate,
  className = '',
}) {
  return (
    <div className={`w-[290px] font-sans tracking-wide ${className}`}>
      {/* 헤더 */}
      <div className="bg-primary-dark rounded-t-[12px] pt-sm flex items-center pb-2xl gap-xxs px-md -mb-lg relative z-10">
        <Icon name="Speaker" color="white" size={24} />
        <span className="text-base font-bold text-white">
          {isEdit ? '스터디 수정' : '스터디 만들기'}
        </span>
      </div>

      {/* 바디 */}
      <div className="bg-white border border-border rounded-lg pt-xl pb-5 px-5 flex flex-col gap-xl z-30 relative drop-shadow-lg">
        {/* AI 생성 영역 */}
        <div className="flex flex-col gap-sm">
          <p className="text-sm text-text-muted text-center leading-relaxed">
            스터디 제목을 입력하면
            <br />
            AI가 내용을 자동으로 채워드려요!
          </p>
          <FlexibleButton
            variant="white"
            size="L"
            width="100%"
            onClick={onAiGenerate}
            disabled={!title || isGenerating}
          >
            <span className="flex items-center justify-center gap-xs text-lg font-medium">
              {isGenerating ? (
                'AI 생성 중...'
              ) : (
                <>
                  <Icon name="Star" size={18} />
                  {hasGenerated ? '다시 생성' : 'AI로 내용 채우기'}
                </>
              )}
            </span>
          </FlexibleButton>
          {aiError && (
            <p className="text-sm text-error text-center">{aiError}</p>
          )}
        </div>

        <div className="border-t-2 border-secondary-light" />

        {/* 스터디 만들기 / 저장하기 버튼 */}
        <FlexibleButton
          variant="blue"
          size="L"
          width="100%"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          <span className="text-lg font-medium">
            {isEdit ? '저장하기' : '스터디 만들기'}
          </span>
        </FlexibleButton>
      </div>
    </div>
  );
}

export default StudyFormSideCard;
