import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { CATEGORIES } from '../constants/categories';
import { getStudyList } from '../features/study/api';
import { getMyParticipatingStudies } from '../features/study/api';
import { getProfile } from '../features/profile/api';
import BannerSlider from '../shared/components/Banner/BannerSlider';
import MainProfileCard from '../shared/components/Cards/MainProfileCard';
import StudySideList from '../shared/components/Cards/StudySideList';
import StudyListCard from '../shared/components/Cards/StudyListCard';
import CategoryIcon from '../shared/components/Category/MainCategoryIcon';
import NoContents from '../shared/components/NoContents/NoContents';
import Pagination from '../shared/components/Pagination/Pagination';

const PAGE_SIZE = 6;

const TABS = [
  { id: 'latest', label: '최신 스터디' },
  { id: 'recruiting', label: '모집 중' },
  { id: 'in_progress', label: '진행 중' },
];

const STUDY_STATUS_FILTER = {
  recruiting: '모집 중',
  in_progress: '진행 중',
};

const STATUS_MAP = {
  '모집 중': 'recruiting',
  '진행 중': 'in_progress',
  '모집 완료': 'completed',
  종료: 'closed',
};

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userId = useAuthStore((s) => s.userId);
  const authUser = useAuthStore((s) => s.user);

  const activeTab = searchParams.get('tab') ?? 'latest';
  const [currentPage, setCurrentPage] = useState(1);
  const [allStudies, setAllStudies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState(null);
  const [participatingStudies, setParticipatingStudies] = useState([]);

  // activeTab 변경 시 리셋
  useEffect(() => {
    setCurrentPage(1);
    setAllStudies([]);
  }, [activeTab]);

  // 스터디 목록 fetch (탭 변경 시에만)
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeTab === 'local') params.is_offline = 1;
    else if (activeTab === 'online') params.is_offline = 0;

    const statusFilter = STUDY_STATUS_FILTER[activeTab];

    getStudyList(params)
      .then((res) => {
        const all = res.data.results;
        setAllStudies(
          statusFilter
            ? all.filter((s) => s.study_status?.name === statusFilter)
            : all,
        );
      })
      .catch(() => setAllStudies([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  // 클라이언트 페이지네이션
  const totalCount = allStudies.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const studies = allStudies.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
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
        setParticipatingStudies(Array.isArray(studyData) ? studyData : []);
      })
      .catch(() => {});
  }, [isLoggedIn, userId]);

  const isFullWidth = activeTab === 'local' || activeTab === 'online';

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  function handleTabChange(tabId) {
    navigate(`/?tab=${tabId}`);
  }

  return (
    <div className="flex justify-center w-full py-5xl ">
      <div className="flex gap-xl w-full max-w-max-width-lg min-w-max-width-lg ">
        <div className="flex-1 min-w-0 flex flex-col gap-5xl">
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
            <h2 className="text-2xl font-bold text-text mb-xl">
              스터디 둘러보기
            </h2>
            <div className="flex gap-xs mb-xl">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={
                    activeTab === tab.id
                      ? 'px-xl py-xs rounded-xl bg-primary text-white text-sm font-medium'
                      : 'px-xl py-xs rounded-xl border border-border text-text-muted text-sm font-medium hover:border-primary hover:text-primary transition-colors'
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="py-5xl flex justify-center">
                <span className="text-text-muted text-sm">불러오는 중...</span>
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
                      isLiked={study.user_liked}
                      onClick={() => navigate(`/study/${study.id}`)}
                      onLike={() => {
                        if (!isLoggedIn) navigate('/login');
                      }}
                    >
                      {study.thumbnail ? (
                        <img
                          src={study.thumbnail}
                          alt={study.title}
                          className="w-full h-full object-cover"
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
              profileImage={
                isLoggedIn
                  ? (authUser?.profile_img ?? profile?.profile_img)
                  : undefined
              }
              nickname={
                isLoggedIn
                  ? (authUser?.nickname ?? profile?.nickname)
                  : undefined
              }
              onButtonClick={() =>
                navigate(isLoggedIn ? '/study/create' : '/login')
              }
            />

            {isLoggedIn && <StudySideList studies={participatingStudies} />}
          </aside>
        )}
      </div>
    </div>
  );
}
