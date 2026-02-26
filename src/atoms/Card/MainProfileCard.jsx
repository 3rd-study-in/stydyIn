/**
 * 메인 페이지 프로필 카드 (main-profile-box.png 기반)
 * 크기: 290×300px 고정 (너비+높이 모두 고정)
 *
 * @param {boolean} hasUser          true → 프로필 표시, false → 플레이스홀더 표시
 * @param {string} [profileImage]    프로필 이미지 src (hasUser=true일 때)
 * @param {string} [nickname]        닉네임 (hasUser=true일 때)
 * @param {() => void} [onButtonClick]  버튼 클릭 콜백
 * @param {string} [className]       추가 Tailwind 클래스
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
      className={`w-[290px] h-[300px] bg-bg-muted border border-border rounded-lg overflow-hidden flex flex-col items-center justify-between py-8 px-5 font-sans ${className}`}
    >
      {/* 프로필 이미지 영역 */}
      <div className="flex flex-col items-center gap-3">
        {hasUser ? (
          <>
            {/* 프로필 이미지 */}
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border border-border bg-secondary-light shrink-0">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={nickname ?? '프로필'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <></>
              )}
            </div>
            {/* 닉네임 */}
            <p className="text-base font-bold text-text text-center">
              {nickname}
            </p>
          </>
        ) : (
          <>
            {/* 플레이스홀더 아이콘 */}
            <div className="w-[100px] h-[100px] rounded-full bg-secondary-light flex items-center justify-center shrink-0">

            </div>
            {/* 안내 문구 */}
            <p className="text-sm text-text-disabled text-center leading-snug">
              스터디를 만들어<br />사람들과 함께 공부할 수 있어요!
            </p>
          </>
        )}
      </div>

      {/* 버튼 */}
      <button
        type="button"
        onClick={onButtonClick}
        className="w-[250px] h-[50px] bg-primary text-white text-base font-medium rounded-md hover:bg-[#1649b8] active:bg-[#1138a0] transition-colors shrink-0"
      >
        {hasUser ? '스터디 만들기' : '시작하기'}
      </button>
    </div>
  )
}


export default MainProfileCard
