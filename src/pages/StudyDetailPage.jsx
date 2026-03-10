import { useParams, useNavigate } from 'react-router-dom';
import { MEDIA_URL } from '../constants/api';
import { useState } from 'react';
import useStudyDetail from '../features/study/hooks/useStudyDetail';
import useStudyParticipate from '../features/study/hooks/useStudyParticipate';
import useAuthStore from '../stores/authStore';
import DetailBarTopContainer from '../shared/components/StudyDetail/DetailBarTopContainer';
import DetailBarTopContent from '../shared/components/StudyDetail/DetailBarTopContent';
import StudyStateCard from '../shared/components/Cards/StudyStateCard';
import LeaderProfile from '../shared/components/StudyDetail/LeaderProfile';
import Modal from '../atoms/Modal/Modal';
import Image from '../atoms/Images/Common/Image';
import Button from '../atoms/Button/Button';
import { CommentSection } from '../shared/components/Comment';

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
  const userId = useAuthStore((s) => s.userId);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [isLiked, setIsLiked] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

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

  const isOwner = study.leader?.id === userId;
  const isParticipant = (study.participants ?? []).some(
    (p) => p.id === userId,
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
      <Modal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        className="bg-bg rounded-2xl px-xl py-lg flex flex-col items-center gap-y-md shadow-lg min-w-[280px]"
      >
        <Image
          name="NotFound"
          alt="준비중"
          className="w-[100px] h-[100px] rounded-full object-cover"
        />
        <p className="text-text text-base font-medium">채팅 기능은 준비중입니다.</p>
        <Button variant="blue" size="M" onClick={() => setIsChatModalOpen(false)}>
          확인
        </Button>
      </Modal>
      {/* 배너 */}
      <DetailBarTopContainer
        image={
          study.thumbnail
            ? study.thumbnail.startsWith('http')
              ? study.thumbnail
              : `${MEDIA_URL}${study.thumbnail}`
            : undefined
        }
      >
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
        <div className="w-[840px] shrink-0 flex flex-col">
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
            userId={study.leader?.id}
            profileImage={(() => {
              const img = study.leader?.profile?.profile_img;
              if (!img) return undefined;
              return img.startsWith('http') ? img : `${MEDIA_URL}${img}`;
            })()}
            nickname={study.leader?.profile?.nickname ?? ''}
            location={study.leader?.profile?.preferred_region?.location ?? ''}
            introduction={study.leader?.profile?.introduction ?? ''}
          />

          <hr className="border-border my-3xl" />

          <CommentSection
            studyPk={studyId}
            leaderId={study.leader?.id}
            currentUserId={userId}
          />
        </div>

        {/* 사이드바 */}
        <div className="shrink-0 sticky top-10">
          <StudyStateCard
            {...cardProps}
            status={status}
            dDay={dDay}
            isOwner={isOwner}
            isParticipant={isParticipant}
            isLiked={isLiked}
            onParticipate={handleParticipateClick}
            onChatRoom={() => setIsChatModalOpen(true)}
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
