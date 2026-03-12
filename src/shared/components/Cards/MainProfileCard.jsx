import FlexibleButton from '../../../atoms/Button/FlexibleButton';
import defaultProfile from '../../../asset/images/main-profile.png';
import defaultLoginProfile from '../../../asset/images/UserProfileDefault.png';

/**
 * 메인 피드 우측 프로필 카드
 * - main-profile-box.png / main-profile-box-noUserInfo.png 기반
 *
 * @param {boolean} hasUser          true → 프로필 표시, false → 안내 화면
 * @param {string}  [profileImage]   프로필 이미지 src (hasUser=true 시)
 * @param {string}  [nickname]       닉네임 (hasUser=true 시)
 * @param {() => void} [onButtonClick] 버튼 클릭 콜백
 * @param {string}  [className]      추가 Tailwind 클래스
 */
function MainProfileCard({
  hasUser = false,
  profileImage,
  nickname,
  onButtonClick,
  className = '',
  buttonClassName = '',
}) {
  return (
    <div
      className={`w-[290px] h-[300px] bg-bg-muted border border-border rounded-lg flex flex-col items-center justify-center p-xl ${className}`}
    >
      {/* 상단: 아바타 + 텍스트 */}
      <div className="flex flex-col items-center  pt-4xl">
        {/* 아바타 영역 */}
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden border border-border bg-secondary-light flex items-center justify-center shrink-0">
          {hasUser ? (
            <img
              src={profileImage || defaultLoginProfile}
              alt={nickname ?? '프로필'}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={defaultProfile}
              alt="기본 프로필"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* 텍스트 */}
        {hasUser ? (
          <p className="pt-xl text-lg font-bold text-secondary-dark text-center leading-6">
            {nickname}
          </p>
        ) : (
          <p className="pt-4xl text-base font-Regular text-secondary-dark text-center leading-5">
            스터디를 만들어
            <br />
            사람들과 함께 공부할 수 있어요!
          </p>
        )}
      </div>

      {/* 하단: 버튼 */}
      <FlexibleButton
        variant="blue"
        size="L"
        onClick={onButtonClick}
        className={`w-[250px] mt-3xl mb-xl shrink-0 ${buttonClassName}`}
      >
        {hasUser ? '스터디 만들기' : '시작하기'}
      </FlexibleButton>
    </div>
  );
}

export default MainProfileCard;
