import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useStudyDetail from '../features/study/hooks/useStudyDetail';
import useStudyParticipate from '../features/study/hooks/useStudyParticipate';
import useAuthStore from '../stores/authStore';
import DetailBarTopContainer from '../shared/components/StudyDetail/DetailBarTopContainer';
import DetailBarTopContent from '../shared/components/StudyDetail/DetailBarTopContent';
import StudyStateCard from '../shared/components/Cards/StudyStateCard';
import LeaderProfile from '../shared/components/StudyDetail/LeaderProfile';
import FlexibleButton from '../atoms/Button/FlexibleButton';

const STATUS_NAME_MAP = {
  '모집 중': 'recruiting',
  '진행 중': 'in_progress',
  '모집 완료': 'completed',
  종료: 'closed',
};

function calcDDay(startDateStr) {
  if (!startDateStr) return undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);
  return Math.floor((today - start) / (1000 * 60 * 60 * 24));
}

function StudyDetailPage() {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const { study, cardProps, isLoading, error, refetch } =
    useStudyDetail(studyId);
  const { handleJoin, handleLeave } = useStudyParticipate(studyId, {
    onSuccess: refetch,
  });
  const email = useAuthStore((s) => s.email);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert('링크가 클립보드에 복사되었습니다!'))
      .catch(() => alert('링크 복사에 실패했습니다.'));
  };

  const handleLike = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setIsLiked((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-text-muted">
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-text">
        {error}
      </div>
    );
  }

  if (!study || !cardProps) return null;

  const isOwner = study.leader?.email === email;
  const isParticipant = (study.participants ?? []).some(
    (p) => p.email === email,
  );
  const dDay = calcDDay(study.start_date);
  const hashtags = (study.search_tag ?? []).map((t) => `#${t.name}`);
  const categories = [study.subject?.name, study.difficulty?.name].filter(
    Boolean,
  );
  const status = STATUS_NAME_MAP[study.study_status?.name] ?? 'recruiting';

  const handleParticipateClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (isParticipant) handleLeave();
    else handleJoin();
  };

  return (
    <div className="max-w-max-width-lg mx-auto px-5 py-10">
      {/* 배너 */}
      <DetailBarTopContainer image={study.thumbnail}>
        <DetailBarTopContent
          categories={categories}
          title={study.title}
          hashtags={hashtags}
          location={study.is_offline ? study.study_location?.location : ''}
          isLiked={isLiked}
          onLike={handleLike}
          onShare={handleShare}
        />
      </DetailBarTopContainer>

      {/* 본문 + 사이드바 */}
      <div className="flex gap-6xl mt-10 items-start">
        {/* 본문 */}
        <div className="flex-1 min-w-0 flex flex-col">
          <section>
            <h2 className="text-[30px] font-bold text-text mb-3xl">
              스터디 소개
            </h2>
            <p className="text-base text-text leading-relaxed whitespace-pre-wrap">
              {study.study_info || '스터디 소개가 없습니다.'}
            </p>
          </section>

          <hr className="border-border my-3xl" />

          <section>
            <h2 className="text-[30px] font-bold text-text mb-3xl">
              스터디 일정
            </h2>
            <p className="text-base text-text leading-relaxed whitespace-pre-wrap">
              {study.schedule || '스터디 일정이 없습니다.'}
            </p>
          </section>

          <hr className="border-border my-3xl" />

          <LeaderProfile
            profileImage={study.leader?.profile_image ?? ''}
            nickname={study.leader?.nickname ?? ''}
            location={study.leader?.location?.name ?? ''}
            introduction={study.leader?.introduction ?? ''}
          />

          <hr className="border-border my-3xl" />

          <section>
            <h2 className="text-[30px] font-bold text-text mb-3xl">
              그룹장에게 질문하기
            </h2>
            <div className="border border-border rounded-lg p-[16px] flex gap-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="다른 사람의 권리를 침해하거나 명예를 훼손하는 댓글은 관련 법률에 의해 제재를 받을 수 있습니다."
                maxLength={300}
                className="flex-1 h-17.5 text-sm text-text placeholder:text-text-disabled outline-none resize-none"
              />
              <div className="flex flex-col items-end justify-between shrink-0">
                <span className="text-sm text-text-disabled">
                  {comment.length}/300
                </span>
                <FlexibleButton
                  variant="blue"
                  size="S"
                  width="60px"
                  disabled={!comment.trim()}
                >
                  등록
                </FlexibleButton>
              </div>
            </div>
          </section>
        </div>

        {/* 사이드바 */}
        <div className="shrink-0 sticky top-10">
          <StudyStateCard
            {...cardProps}
            status={status}
            dDay={dDay}
            isOwner={isOwner}
            isLiked={isLiked}
            onParticipate={handleParticipateClick}
            onEdit={() => navigate(`/study/${studyId}/edit`)}
            onShare={handleShare}
            onLike={handleLike}
          />
        </div>
      </div>
    </div>
  );
}

export default StudyDetailPage;
