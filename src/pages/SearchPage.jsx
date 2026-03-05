import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../constants/categories'
import { getStudyList } from '../features/study/api'
import StudyListCard from '../shared/components/Cards/StudyListCard'
import SearchFilter from '../shared/components/SearchFilter/SearchFilter'
import NoContents from '../shared/components/NoContents/NoContents'
import Pagination from '../shared/components/Pagination/Pagination'

const PAGE_SIZE = 9

const STATUS_MAP = {
    '모집 중': 'recruiting',
    '진행 중': 'in_progress',
    '모집 완료': 'completed',
    '종료': 'closed',
}

export default function SearchPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const subjectId = searchParams.get('subject')
    const searchQuery = searchParams.get('search')

    const [studies, setStudies] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const activeCategory = CATEGORIES.find((c) => String(c.id) === subjectId)

    useEffect(() => {
        setCurrentPage(1)
    }, [subjectId, searchQuery])

    useEffect(() => {
        setLoading(true)
        const params = { page: currentPage, limit: PAGE_SIZE }
        if (subjectId) params.subject = subjectId
        if (searchQuery) params.search = searchQuery

        getStudyList(params)
            .then((res) => {
                setStudies(res.data.results)
                setTotalCount(res.data.count)
            })
            .catch(() => setStudies([]))
            .finally(() => setLoading(false))
    }, [subjectId, searchQuery, currentPage])

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

    return (
        <div className="max-w-max-width-lg mx-auto py-5xl px-xl">

            {/* 필터 */}
            <SearchFilter />

            {/* 활성 필터 chip */}
            {(activeCategory || searchQuery) && (
                <div className="flex items-center gap-xs mt-xl">
                    <span className="text-sm text-text-muted">필터:</span>
                    {activeCategory && (
                        <span className="px-xs py-xxxs bg-primary-light text-primary text-sm rounded-xl">
                            {activeCategory.label}
                        </span>
                    )}
                    {searchQuery && (
                        <span className="px-xs py-xxxs bg-primary-light text-primary text-sm rounded-xl">
                            "{searchQuery}"
                        </span>
                    )}
                </div>
            )}

            {/* 결과 수 */}
            {!loading && (
                <p className="mt-xl mb-xl text-sm text-text-muted">
                    검색 결과 <strong className="text-text font-bold">{totalCount}개</strong>
                </p>
            )}

            {/* 카드 그리드 or 빈 상태 */}
            {loading ? (
                <div className="py-5xl flex justify-center">
                    <span className="text-text-muted text-sm">불러오는 중...</span>
                </div>
            ) : studies.length > 0 ? (
                <>
                    <div className="grid grid-cols-4 gap-xl">
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
                                onPageChange={(p) => {
                                    setCurrentPage(p)
                                    window.scrollTo(0, 0)
                                }}
                            />
                        </div>
                    )}
                </>
            ) : (
                <NoContents
                    title="에 대한 검색결과가 없습니다."
                    keyword={activeCategory?.label ?? searchQuery ?? ''}
                    description="원하시는 스터디가 없나요?"
                    buttonText="스터디 만들기"
                    onButtonClick={() => navigate('/study/create')}
                    className="py-5xl"
                />
            )}
        </div>
    )
}
