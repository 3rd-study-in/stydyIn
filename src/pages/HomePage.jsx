import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { MOCK_PROFILE } from '../constants/mockUpData'
import { CATEGORIES } from '../constants/categories'
import { getStudyList } from '../features/study/api'
import BannerSlider from '../shared/components/Banner/BannerSlider'
import MainProfileCard from '../shared/components/Cards/MainProfileCard'
import StudySideList from '../shared/components/Cards/StudySideList'
import StudyListCard from '../shared/components/Cards/StudyListCard'
import CategoryIcon from '../shared/components/Category/MainCategoryIcon'
import NoContents from '../shared/components/NoContents/NoContents'
import Pagination from '../shared/components/Pagination/Pagination'

const PAGE_SIZE = 6

const TABS = [
    { id: 'latest', label: '최신 스터디' },
    { id: 'recruiting', label: '모집 중 스터디' },
    { id: 'in_progress', label: '진행 중 스터디' },
]

const TAB_STATUS_MAP = {
    latest: null,
    recruiting: 1,
    in_progress: 3,
}

const STATUS_MAP = {
    '모집 중': 'recruiting',
    '진행 중': 'in_progress',
    '모집 완료': 'completed',
    '종료': 'closed',
}

export default function HomePage() {
    const navigate = useNavigate()
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

    const [activeTab, setActiveTab] = useState('latest')
    const [currentPage, setCurrentPage] = useState(1)
    const [studies, setStudies] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const params = { page: currentPage, limit: PAGE_SIZE }
        const statusId = TAB_STATUS_MAP[activeTab]
        if (statusId) params.study_status = statusId

        getStudyList(params)
            .then((res) => {
                setStudies(res.data.results)
                setTotalCount(res.data.count)
            })
            .catch(() => setStudies([]))
            .finally(() => setLoading(false))
    }, [activeTab, currentPage])
    // TODO: activeTab 변경 시 API status 필터 파라미터 추가 예정

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

    function handlePageChange(page) {
        setCurrentPage(page)
        window.scrollTo(0, 0)
    }

    function handleTabChange(tabId) {
        setActiveTab(tabId)
        setCurrentPage(1)
    }

    return (
        <div className="flex justify-center w-full py-5xl ">
            <div className="flex gap-xl w-full max-w-max-width-lg min-w-max-width-lg ">
                <div className="flex-1 min-w-0 flex flex-col gap-5xl">
                    <BannerSlider />
                    <div className="flex justify-around">
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
                    <section>
                        <h2 className="text-2xl font-bold text-text mb-xl">스터디 둘러보기</h2>
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
                                <div className="grid grid-cols-3 gap-xl">
                                    {studies.map((study) => (
                                        <StudyListCard
                                            key={study.id}
                                            status={STATUS_MAP[study.study_status?.name] ?? 'recruiting'}
                                            location={study.is_offline ? study.study_location?.location : null}
                                            category={study.subject?.name}
                                            difficulty={study.difficulty?.name}
                                            title={study.title}
                                            currentCount={study.participant_count}
                                            isLiked={study.user_liked}
                                            onClick={() => navigate(`/study/${study.id}`)}
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

                                {totalPages > 1 && (
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
                <aside className="w-72.5 shrink-0 flex flex-col gap-5xl">
                    <MainProfileCard
                        hasUser={isLoggedIn}
                        profileImage={isLoggedIn ? MOCK_PROFILE.profile_img ?? undefined : undefined}
                        nickname={isLoggedIn ? MOCK_PROFILE.nickname : undefined}
                        onButtonClick={() => navigate(isLoggedIn ? '/study/create' : '/login')}
                    />

                    {isLoggedIn && <StudySideList studies={[]} />}
                </aside>

            </div>
        </div>
    )
}
