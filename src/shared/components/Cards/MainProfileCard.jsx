import Button from '../../../atoms/Button/Button';
import defaultProfile from '../../../asset/images/main-profile.png';

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
}) {
  return (
    <div
      className={`w-[290px] h-[300px] bg-bg-muted border border-border rounded-xl flex flex-col items-center justify-between py-8 px-5 ${className}`}
    >
      {/* 상단: 아바타 + 텍스트 */}
      <div className="flex flex-col items-center gap-3">
        {/* 아바타 영역 */}
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden border border-border bg-secondary-light flex items-center justify-center shrink-0">
          {hasUser && profileImage ? (
            <img
              src={profileImage}
              alt={nickname ?? '프로필'}
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={defaultProfile} alt="기본 프로필" className="w-full h-full object-cover" />
          )}
        </div>

        {/* 텍스트 */}
        {hasUser ? (
          <p className="text-base font-bold text-text text-center leading-6">
            {nickname}
          </p>
        ) : (
          <p className="text-sm font-normal text-text-muted text-center leading-5">
            스터디를 만들어<br />사람들과 함께 공부할 수 있어요!
          </p>
        )}
      </div>

      {/* 하단: 버튼 */}
      <Button variant="blue" size="L" onClick={onButtonClick}>
        {hasUser ? '스터디 만들기' : '시작하기'}
      </Button>
    </div>
  );
}

export default MainProfileCard;
