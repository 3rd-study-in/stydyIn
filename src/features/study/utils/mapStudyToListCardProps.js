const STATUS_NAME_MAP = {
  '모집 중': 'recruiting',
  '진행 중': 'in_progress',
  '모집 완료': 'completed',
  '종료': 'closed',
};

/**
 * 스터디 API 응답 객체 → StudyListCard props 변환
 *
 * @param {object} study  - API 응답 스터디 객체 (2.1 / 2.19 results 배열 아이템)
 * @returns {{
 *   status, location, category, difficulty,
 *   title, currentCount, isLiked,
 *   thumbnailSrc
 * }}
 *
 * @example
 * const { studies } = useStudyList()
 *
 * {studies.map((study) => {
 *   const props = mapStudyToListCardProps(study)
 *   return (
 *     <StudyListCard
 *       key={study.id}
 *       {...props}
 *       onClick={() => navigate(`/study/${study.id}`)}
 *       onLike={() => handleLike(study.id)}
 *     >
 *       <img src={props.thumbnailSrc} alt={study.title} className="w-full h-full object-cover" />
 *     </StudyListCard>
 *   )
 * })}
 */
function mapStudyToListCardProps(study) {
  return {
    status: STATUS_NAME_MAP[study.study_status?.name] ?? 'recruiting',
    location: study.study_location?.location ?? (study.is_offline ? undefined : '온라인'),
    category: study.subject?.name,
    difficulty: study.difficulty?.name,
    title: study.title,
    currentCount: study.participant_count,
    isLiked: study.user_liked ?? false,
    thumbnailSrc: study.thumbnail,
  };
}

export default mapStudyToListCardProps;
