import { useState, useEffect } from 'react';
import Modal from '../../../atoms/Modal/Modal';
import UserProfile from '../UserProfile/UserProfile';
import UserProfileDefault from '../UserProfile/UserProfileDefault';
import GithubContributions from '../GithubContributions/GithubContributions';
import InterestTags from '../InterestTags/InterestTags';
import { getProfile } from '../../../features/profile/api';
import { MEDIA_URL } from '../../../constants/api';

/**
 * 사용자 정보 시트 모달 (userinfomodal.png 기반)
 * 크기: 390×694px
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {number} userId          조회할 사용자 ID
 * @param {() => void} [onReport]
 * @param {boolean} [hasOverlay=true]
 */
function UserInfoModal({
  isOpen,
  onClose,
  userId,
  onReport,
  hasOverlay = true,
}) {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 모달이 열릴 때만 데이터를 가져옴
    if (!isOpen || !userId) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await getProfile(userId);
        setProfileData(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('사용자를 찾을 수 없습니다.');
        } else {
          setError('프로필을 불러오지 못했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isOpen, userId]);

  // profile_img가 '/media/...' 같은 상대경로로 오므로 MEDIA_URL을 앞에 붙임
  const profileImage = profileData?.profile_img
    ? `${MEDIA_URL}${profileData.profile_img}`
    : null;

  const nickname = profileData?.nickname ?? '';
  const bio = profileData?.introduction ?? '';
  const location = profileData?.preferred_region?.location ?? '';
  const githubUsername = profileData?.github_username ?? '';
  const tags = profileData?.tag ?? [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} hasOverlay={hasOverlay}>
      {/* overflow-visible: X 버튼이 모달 테두리 밖으로 10px 삐져나옴 */}
      <div className="relative w-[390px] h-[694px] font-sans">
        {/* 모달 카드 본체 */}
        <div className="w-full h-full bg-bg border border-border rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.1)] overflow-hidden relative">
          {/* 좌상단 지역 태그 */}
          {location && (
            <span className="absolute left-3xl top-3xl flex items-center px-[13px] py-[5px] bg-bg-muted rounded-[26px] text-xs text-text z-10">
              {location}
            </span>
          )}

          {/* 우상단 신고하기 링크 */}
          <button
            type="button"
            onClick={() => {
              if (onReport) {
                onReport();
              } else {
                alert(`신고 기능은 추후 구현 예정입니다. (ID: ${userId})`);
              }
            }}
            className="absolute right-3xl top-[34px] text-xs underline text-text-disabled hover:text-text-muted transition-colors z-10"
          >
            신고하기
          </button>

          {/* 스크롤 가능한 콘텐츠 영역 */}
          <div className="absolute top-6xl left-3xl right-3xl bottom-0 overflow-y-auto pb-3xl">
            {/* 로딩 상태 */}
            {isLoading && (
              <p className="flex justify-center items-center h-full text-sm text-text-muted">
                불러오는 중...
              </p>
            )}

            {/* 에러 상태 */}
            {error && !isLoading && (
              <p className="flex justify-center items-center h-full text-sm text-text-muted">
                {error}
              </p>
            )}

            {/* 데이터 로드 완료 */}
            {!isLoading && !error && profileData && (
              <div className="flex flex-col gap-10">
                {/* 프로필 섹션: 이미지 + 닉네임 (gap 20px) */}
                <div className="flex flex-col items-center gap-xl pt-lg">
                  {profileImage ? (
                    <UserProfile
                      src={profileImage}
                      alt={`${nickname} 프로필`}
                    />
                  ) : (
                    <UserProfileDefault />
                  )}
                  {nickname && (
                    <p className="text-center font-bold text-lg text-text">
                      {nickname}
                    </p>
                  )}
                </div>

                {/* 정보 섹션: 자기소개 + 잔디 + 관심분야 (gap 20px) */}
                <div className="flex flex-col gap-xl">
                  {/* 자기소개 */}
                  {bio && (
                    <div className="px-base py-1xl border border-border rounded-[10px] text-sm text-text leading-relaxed">
                      {bio}
                    </div>
                  )}

                  {/* 잔디 농사 */}
                  <section>
                    <h3 className="flex items-center gap-xxs text-base font-bold text-text mb-md">
                      잔디 농사
                      <span
                        className="w-lg h-lg rounded-full border border-border flex items-center justify-center text-xs text-text-disabled cursor-help leading-none"
                        title="GitHub Contributions 잔디 현황"
                      >
                        ?
                      </span>
                    </h3>
                    <GithubContributions username={githubUsername} />
                  </section>

                  {/* 관심 분야 */}
                  <h3 className="text-base font-bold text-text mb-3">
                    관심 분야
                  </h3>
                  <InterestTags tags={tags} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* X 닫기 버튼 — 우상단 테두리 밖으로 살짝 삐져나옴 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="모달 닫기"
          className="absolute -right-sm -top-sm w-9 h-9 bg-primary rounded-full flex items-center justify-center [filter:drop-shadow(2px_2px_6px_rgba(0,0,0,0.1))] hover:bg-[#1649b8] transition-colors z-10"
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
