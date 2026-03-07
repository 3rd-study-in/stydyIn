import Modal from '../../../atoms/Modal/Modal';
import UserProfile from '../UserProfile/UserProfile';
import UserProfileDefault from '../UserProfile/UserProfileDefault';
import TagSize from '../../../atoms/Tag/TagSize';

/**
 * 사용자 정보 시트 모달 (userinfomodal.png 기반)
 * 크기: 390×694px
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {() => void} [onReport]
 * @param {string} [location='']       좌상단 지역 태그 (예: '애월읍')
 * @param {boolean} [hasOverlay=true]
 * @param {string|null} [profileImage] 프로필 이미지 URL (없으면 기본 이미지)
 * @param {string} [nickname='']
 * @param {string} [bio='']            자기소개
 * @param {string[]} [tags=[]]         관심 분야 태그 목록
 */
function UserInfoModal({
  isOpen,
  onClose,
  onReport,
  location = '',
  hasOverlay = true,
  profileImage = null,
  nickname = '',
  bio = '',
  tags = [],
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} hasOverlay={hasOverlay}>
      {/* overflow-visible: X 버튼이 모달 테두리 밖으로 10px 삐져나옴 */}
      <div className="relative w-[390px] h-[694px] font-sans">
        {/* 모달 카드 본체 */}
        <div className="w-full h-full bg-white border border-border rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.1)] overflow-hidden relative">
          {/* 좌상단 지역 태그 */}
          {location && (
            <span className="absolute left-[30px] top-[30px] flex items-center px-[13px] py-[5px] bg-bg-muted rounded-[26px] text-xs text-text z-10">
              {location}
            </span>
          )}

          {/* 우상단 신고하기 링크 */}
          {onReport && (
            <button
              type="button"
              onClick={onReport}
              className="absolute right-[75px] top-[34px] text-xs underline text-text-disabled hover:text-text-muted transition-colors z-10"
            >
              신고하기
            </button>
          )}

          {/* 스크롤 가능한 콘텐츠 영역 */}
          <div className="absolute inset-0 top-[60px] overflow-y-auto px-[30px] pb-[30px]">
            {/* 프로필 이미지 */}
            <div className="flex justify-center pt-4">
              {profileImage ? (
                <UserProfile src={profileImage} alt={`${nickname} 프로필`} />
              ) : (
                <UserProfileDefault />
              )}
            </div>

            {/* 닉네임 */}
            {nickname && (
              <p className="text-center font-bold text-lg mt-4 text-text">
                {nickname}
              </p>
            )}

            {/* 자기소개 */}
            {bio && (
              <div className="mt-4 px-[18px] py-[18px] border border-border rounded-[10px] text-sm text-text leading-relaxed">
                {bio}
              </div>
            )}

            {/* 잔디 농사 */}
            <section className="mt-6">
              <h3 className="flex items-center gap-1.5 text-sm font-bold text-text mb-3">
                잔디 농사
                <span
                  className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-[10px] text-text-disabled cursor-help leading-none"
                  title="GitHub Contributions 잔디 현황"
                >
                  ?
                </span>
              </h3>
              <div className="h-[80px] bg-bg-muted rounded-[10px]" />
            </section>

            {/* 관심 분야 */}
            {tags.length > 0 && (
              <section className="mt-6">
                <h3 className="text-sm font-bold text-text mb-3">관심 분야</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <TagSize key={tag} size="M" variant="blue">
                      {tag}
                    </TagSize>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* X 닫기 버튼 — 우상단 테두리 밖으로 살짝 삐져나옴 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="모달 닫기"
          className="absolute -right-[10px] -top-[10px] w-9 h-9 bg-primary rounded-full flex items-center justify-center [filter:drop-shadow(2px_2px_6px_rgba(0,0,0,0.1))] hover:bg-[#1649b8] transition-colors z-10"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </Modal>
  );
}

export default UserInfoModal;
