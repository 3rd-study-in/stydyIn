import Button from '../../../atoms/Button/Button';

/**NoContents
 * 빈 상태(Empty State) 공통 컴포넌트
 * 부모 컨테이너 기준 항상 중앙에 배치됩니다.
 *
 * @param {string}       title          본문 메시지 (필수)
 * @param {string}       [keyword]      title 앞에 강조될 검색어 (빨간색)
 * @param {string}       [description]  부제목
 * @param {string}       [buttonText]   버튼 텍스트 (없으면 버튼 숨김)
 * @param {() => void}   [onButtonClick] 버튼 클릭 콜백
 * @param {string}       [className]    추가 Tailwind 클래스
 *
 * @example
 * // 스터디 없음
 * <NoContents
 *   title="아직 열린 스터디가 없어요"
 *   description="첫 스터디를 직접 만들어 보세요!"
 *   buttonText="스터디 만들기"
 *   onButtonClick={() => navigate('/study/create')}
 * />
 *
 * @example
 * // 검색 결과 없음
 * <NoContents
 *   keyword={searchQuery}
 *   title="에 대한 검색결과가 없습니다."
 *   description="원하시는 스터디가 없나요? 스터디를 직접 만들어 보세요!"
 *   buttonText="스터디 만들기"
 *   onButtonClick={() => navigate('/study/create')}
 * />
 */
function NoContents({
  title,
  keyword,
  description,
  buttonText,
  onButtonClick,
  className = '',
}) {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center gap-5 ${className}`}>
      {/* 텍스트 영역 */}
      <div className="flex flex-col items-center gap-[10px]">
        <p className="text-lg font-bold text-text text-center font-['Spoqa_Han_Sans_Neo']">
          {keyword && (
            <span className="text-error">{keyword}</span>
          )}
          {title}
        </p>
        {description && (
          <p className="text-base font-normal text-text-muted text-center font-['Spoqa_Han_Sans_Neo']">
            {description}
          </p>
        )}
      </div>

      {/* 액션 버튼 */}
      {buttonText && onButtonClick && (
        <Button variant="blue" size="L" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}

export default NoContents;
