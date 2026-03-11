import { useNavigate } from 'react-router-dom';
import StudyListSideCard from '../../../atoms/Card/StudyListSideCard';
import StudyListMainCard from '../../../atoms/Card/StudyListMainCard';
import { MEDIA_URL } from '../../../constants/api';
import { MainThumbnail } from '../../../atoms/Images/Common';

// API study_status.name → StudyListMainCard status prop
const STATUS_NAME_MAP = {
  '모집 중': 'recruiting',
  '진행 중': 'in_progress',
  '모집 완료': 'completed',
  '종료': 'closed',
};

/**
 * 메인 피드 우측 "참여 중인 스터디" 섹션 (Frame 1028.png 기반)
 * StudyListSideCard + StudyListMainCard 아이템들을 조합한 섹션 컴포넌트
 *
 * @param {Array}  studies    API 응답 스터디 목록 (빈 배열 허용)
 * @param {string} [className] 추가 Tailwind 클래스
 *
 * @example
 * <StudySideList studies={participatingStudies} />
 *
 * studies 배열 형식:
 * [{ id, title, thumbnail, study_status: { name }, d_day?, ... }]
 */
function StudySideList({ studies = [], className = '' }) {
  const navigate = useNavigate();
  return (
    <div className={`flex flex-col items-start gap-5 w-[290px] ${className}`}>
      {/* 섹션 제목 */}
      <p className="text-2xl font-bold text-black">
        참여 중인 스터디{' '}
        <span className="text-primary">{studies.length}개</span>
      </p>

      {/* 카드 컨테이너 */}
      <StudyListSideCard>
        {studies.length === 0 ? (
          <div className="py-8 flex items-center justify-center">
            <p className="text-sm text-text-muted">참여 중인 스터디가 없어요</p>
          </div>
        ) : (
          studies.map((study) => (
            <div
              key={study.id}
              className="cursor-pointer"
              onClick={() => navigate(`/study/${study.id}`)}
            >
              <StudyListMainCard
                status={STATUS_NAME_MAP[study.study_status?.name]}
                dDay={study.d_day}
                title={study.title}
                thumbnailSrc={
                  study.thumbnail
                    ? study.thumbnail.startsWith('http')
                      ? study.thumbnail
                      : `${MEDIA_URL}${study.thumbnail}`
                    : MainThumbnail
                }
              />
            </div>
          ))
        )}
      </StudyListSideCard>
    </div>
  );
}

export default StudySideList;
