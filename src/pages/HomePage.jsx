import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { CATEGORIES } from '../constants/categories';
import { MEDIA_URL } from '../constants/api';
import { getStudyList } from '../features/study/api';
import { getMyParticipatingStudies } from '../features/study/api';
import { getProfile } from '../features/profile/api';
import useGeoLocation from '../features/location/hooks/useGeoLocation';
import useLikeStore from '../stores/likeStore';
import BannerSlider from '../shared/components/Banner/BannerSlider';
import MainProfileCard from '../shared/components/Cards/MainProfileCard';
import StudySideList from '../shared/components/Cards/StudySideList';
import StudyListCard from '../shared/components/Cards/StudyListCard';
import StudyListCardSkeleton from '../shared/components/Cards/StudyListCardSkeleton';
import CategoryIcon from '../shared/components/Category/MainCategoryIcon';
import NoContents from '../shared/components/NoContents/NoContents';
import Pagination from '../shared/components/Pagination/Pagination';
import FlexibleButton from '../atoms/Button/FlexibleButton';
import FilterDropdown from '../atoms/DropdownSelect/FilterDropdown';
import ScrollToTopButton from '../shared/components/ScrollToTopButton';

const TABS = [
  { id: 'latest', label: '최신 스터디' },
  { id: 'recruiting', label: '모집 중 스터디' },
  { id: 'in_progress', label: '진행 중 스터디' },
  // { id: 'closed', label: '종료' }
];

const STUDY_STATUS_FILTER = {
  recruiting: '모집 중',
  in_progress: '진행 중',
  // closed: '종료'
};

const STATUS_MAP = {
  '모집 중': 'recruiting',
  '진행 중': 'in_progress',
  완료: 'completed',
  // 종료: 'closed',
};

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userId = useAuthStore((s) => s.userId);
  const { likedMap, initLikes, toggleLike } = useLikeStore();

  const location = useLocation();
  const activeTab = searchParams.get('tab') ?? 'latest';
  const activeFilter = searchParams.get('filter') ?? 'latest';
  const [currentPage, setCurrentPage] = useState(1);
  const [allStudies, setAllStudies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState(null);
  const [participatingStudies, setParticipatingStudies] = useState([]);

  const { detectRegion, consent, setConsent, isDetecting, geoError } =
    useGeoLocation();
  const [detectedRegion, setDetectedRegion] = useState(null);

  // local 탭 진입 시 consent가 있으면 자동 감지
  useEffect(() => {
    if (activeTab !== 'local' || detectedRegion || isDetecting || !consent)
      return;
    detectRegion()
      .then((region) => setDetectedRegion(region))
      .catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, consent, detectedRegion]);

  // 탭 변경 또는 페이지 재진입 시 리셋 + 스터디 목록 전체 fetch
  useEffect(() => {
    let cancelled = false;
    setCurrentPage(1);
    setAllStudies([]);
    setLoading(true);

    const fetchAll = async () => {
      const fullWidth = activeTab === 'local' || activeTab === 'online';
      const params = { page_size: 100 };
      if (activeTab === 'local') params.is_offline = 1;
      else if (activeTab === 'online') params.is_offline = 0;

      const statusFilter = fullWidth
        ? STUDY_STATUS_FILTER[activeFilter]
        : STUDY_STATUS_FILTER[activeTab];

      let all = [];
      let page = 1;
      let hasNext = true;

      try {
        while (hasNext) {
          const res = await getStudyList({ ...params, page });
          all = [...all, ...res.data.results];
          hasNext = !!res.data.next;
          page++;
        }
        if (!cancelled) {
          const sorted = [...all].sort((a, b) => b.id - a.id);
          const filtered = statusFilter
            ? sorted.filter((s) => s.study_status?.name === statusFilter)
            : sorted;
          setAllStudies(filtered);
          initLikes(filtered);
        }
      } catch {
        if (!cancelled) setAllStudies([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [activeTab, activeFilter, location.key]);

  const isFullWidth = activeTab === 'local' || activeTab === 'online';
  const pageSize = isFullWidth ? 8 : 6;

  // 클라이언트 페이지네이션 (local 탭은 감지된 지역으로 필터링)
  const visibleStudies =
    activeTab === 'local' && detectedRegion
      ? allStudies.filter(
        (s) => s.study_location?.location === detectedRegion.location,
      )
      : allStudies;
  const totalCount = visibleStudies.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const studies = visibleStudies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // 로그인 시 프로필 + 참여 중인 스터디 fetch
  useEffect(() => {
    if (!isLoggedIn || !userId) return;
    Promise.all([
      getProfile(userId).then((res) => res.data),
      getMyParticipatingStudies().then((res) => res.data),
    ])
      .then(([profileData, studyData]) => {
        setProfile(profileData);
        const studies = Array.isArray(studyData)
          ? studyData
          : (studyData?.results ?? []);
        setParticipatingStudies(studies);
      })
      .catch(() => { });
  }, [isLoggedIn, userId]);

  const regionOptions = [{ value: 'redetect', label: '내 지역 재인증' }];

  function handleRegionSelect(value) {
    if (value === 'redetect') {
      setDetectedRegion(null);
      setConsent(true);
    }
  }

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  function handleTabChange(tabId) {
    if (isFullWidth) {
      navigate(`/?tab=${activeTab}&filter=${tabId}`);
    } else {
      navigate(`/?tab=${tabId}`);
    }
  }

  return (
    <>
      <div className="flex gap-xl w-max-width-lg shrink-0 mx-auto py-5xl">
        <div className="flex-1 flex flex-col gap-5xl">
            {!isFullWidth && <BannerSlider />}
            {!isFullWidth && (
              <div className="flex justify-around w-[770px] mx-auto">
                {CATEGORIES.map(({ id, icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => navigate(`/search?subject=${id}`)}
                    className="cursor-pointer hover:opacity-70 transition-opacity bg-transparent border-0 p-0"
                  >
                    <CategoryIcon icon={icon} label={label} />
                  </button>
                ))}
              </div>
            )}
            <section>
              <div className="flex items-center justify-between mb-xl">
                <h2 className="text-2xl font-bold text-text">
                  {activeTab === 'local'
                    ? '내 지역 스터디'
                    : activeTab === 'online'
                      ? '온라인 스터디'
                      : '스터디 둘러보기'}
                </h2>
                {activeTab === 'local' && detectedRegion && (
                  <FilterDropdown
                    iconName="Location"
                    label={detectedRegion.detailLocation}
                    options={regionOptions}
                    onChange={handleRegionSelect}
                    width="160px"
                  />
                )}
              </div>
              <div className="flex gap-xs mb-xl">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={
                      (isFullWidth ? activeFilter : activeTab) === tab.id
                        ? 'px-xl py-xs rounded-xl bg-primary text-white text-sm font-medium'
                        : 'px-xl py-xs rounded-xl border border-border text-text-muted text-sm font-medium hover:border-primary hover:text-primary transition-colors'
                    }
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'local' && !detectedRegion ? (
                <div className="py-5xl flex flex-col items-center gap-xl">
                  {isDetecting ? (
                    <span className="text-text-muted text-sm">
                      위치 감지 중...
                    </span>
                  ) : (
                    <>
                      <p className="text-xl text-text">
                        내 지역 스터디를 확인하려면 인증이 필요해요.
                      </p>
                      <FlexibleButton
                        variant="blue"
                        size="L"
                        onClick={() => setConsent(true)}
                        className="w-[250px]"
                      >
                        내 지역 인증하기
                      </FlexibleButton>
                      {/* {geoError && (
                      <p className="text-sm text-error">{geoError}</p>
                    )} */}
                    </>
                  )}
                </div>
              ) : loading ? (
                <div
                  className={`grid gap-xl ${isFullWidth ? 'grid-cols-4' : 'grid-cols-3'}`}
                >
                  {Array.from({ length: isFullWidth ? 8 : 6 }).map((_, i) => (
                    <StudyListCardSkeleton key={i} />
                  ))}
                </div>
              ) : studies.length > 0 ? (
                <>
                  <div
                    className={`grid gap-xl ${isFullWidth ? 'grid-cols-4' : 'grid-cols-3'}`}
                  >
                    {studies.map((study) => (
                      <StudyListCard
                        key={study.id}
                        status={
                          STATUS_MAP[study.study_status?.name] ?? 'recruiting'
                        }
                        location={
                          study.is_offline ? study.study_location?.location : null
                        }
                        category={study.subject?.name}
                        difficulty={study.difficulty?.name}
                        title={study.title}
                        currentCount={study.participant_count}
                        isLiked={likedMap[study.id] ?? !!study.user_liked}
                        onClick={() => navigate(`/study/${study.id}`)}
                        onLike={() => toggleLike(study.id, isLoggedIn, navigate)}
                      >
                        {study.thumbnail ? (
                          <img
                            src={
                              study.thumbnail.startsWith('http')
                                ? study.thumbnail
                                : `${MEDIA_URL}${study.thumbnail}`
                            }
                            alt={study.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log('img failed:', e.currentTarget.src);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-bg-muted" />
                        )}
                      </StudyListCard>
                    ))}
                  </div>

                  {studies.length > 0 && (
                    <div className="mt-5xl">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <NoContents
                  title="아직 열린 스터디가 없어요"
                  description="첫 스터디를 직접 만들어 보세요!"
                  buttonText="스터디 만들기"
                  onButtonClick={() => navigate('/study/create')}
                  className="py-5xl"
                />
              )}
            </section>
          </div>

          {/* ────────── 사이드바 ────────── */}
          {!isFullWidth && (
            <aside className="w-72.5 shrink-0 flex flex-col gap-5xl">
              <MainProfileCard
                hasUser={isLoggedIn}
                profileImage={(() => {
                  const img = isLoggedIn ? profile?.profile_img : undefined;
                  if (!img) return undefined;
                  return img.startsWith('http') ? img : `${MEDIA_URL}${img}`;
                })()}
                nickname={isLoggedIn ? profile?.nickname : undefined}
                onButtonClick={() =>
                  navigate(isLoggedIn ? '/study/create' : '/login')
                }
              />

              {isLoggedIn && <StudySideList studies={participatingStudies} />}
            </aside>
          )}
        </div>
      <ScrollToTopButton />
    </>
  );
}
