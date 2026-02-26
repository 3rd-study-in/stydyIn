/**
 * 마이페이지 프로필 카드 (mypage-profile-box.png 기반)
 * 크기: 600×286px 고정 (너비+높이 모두 고정)
 *
 * @param {boolean} hasUser          true → 프로필 표시, false → 플레이스홀더 표시
 * @param {string} [profileImage]    프로필 이미지 src (hasUser=true일 때)
 * @param {string} [nickname]        닉네임 (hasUser=true일 때)
 * @param {React.ReactNode} [children]  소개 텍스트 박스 슬롯 (hasUser=true일 때)
 * @param {string} [className]       추가 Tailwind 클래스
 */
function MypageProfileCard({
  hasUser = false,
  profileImage,
  nickname,
  children,
  className = '',
}) {
  return (
    <div
      className={`w-[600px] h-[286px] bg-white overflow-hidden flex flex-col items-center gap-[20px] font-sans ${className}`}
    >
      {/* 프로필 이미지 + 닉네임 */}
      <div className="flex flex-col items-center gap-5">
        {hasUser ? (
          <>
            {/* 프로필 이미지 */}
            <div className="w-[130px] h-[130px] rounded-full overflow-hidden border border-border bg-secondary-light shrink-0">
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
            <p className="text-lg font-bold text-text text-center">{nickname}</p>
          </>
        ) : (
          <>
            {/* 플레이스홀더 */}
            <div className="w-[130px] h-[130px] rounded-full bg-secondary-light flex items-center justify-center shrink-0">

            </div>
            <p className="text-lg font-bold text-text-disabled text-center">
              (프로필 등록을 완료해주세요)
            </p>
          </>
        )}
      </div>

      {/* 하단 콘텐츠 */}
      {hasUser ? (
        /* 소개 텍스트 슬롯 */
        <div className="w-full bg-bg-muted rounded-[10px] px-8 py-5 text-sm text-text leading-normal text-center overflow-hidden">
          {children}
        </div>
      ) : (
        /* 고정 안내 박스 */
        <div className="w-full bg-bg-muted rounded-[10px] px-8 py-5 text-sm text-text-disabled text-center">
          프로필 등록을 완료하면 스터디에 참여할 수 있어요!
        </div>
      )}
    </div>
  )
}



export default MypageProfileCard
