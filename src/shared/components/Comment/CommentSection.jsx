import { useState, useEffect } from 'react';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import ReplyItem from './ReplyItem';
import ReplyInput from './ReplyInput';
import useComment from '../../hooks/useComment';

// 날짜 포맷 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
};

// API 응답 → 컴포넌트용 데이터 변환
const transformComment = (comment) => {
  if (comment.user === "탈퇴한 회원입니다." || comment.is_delete) {
    return {
      id: comment.id,
      isDeleted: true,
      isSecret: false,
      isMine: false,
      nickname: '미지의 사용자',
      profileImage: '',
      content: comment.is_delete ? '삭제된 댓글입니다' : '탈퇴한 사용자의 댓글',
      date: formatDate(comment.created),
      replies: comment.recomments?.map(transformRecomment) || [],
    };
  }
  return {
    id: comment.id,
    userId: comment.user?.id,
    isSecret: comment.is_secret || false,
    isMine: comment.user?.is_author || false,
    nickname: comment.user?.profile?.nickname || '익명',
    profileImage: comment.user?.profile?.profile_img || '',
    content: comment.content,
    date: formatDate(comment.created),
    replies: comment.recomments?.map(transformRecomment) || [],
  };
};

const transformRecomment = (recomment) => {
  if (recomment.user === "탈퇴한 회원입니다.") {
    return {
      id: recomment.id,
      commentId: recomment.comment_id,
      isDeleted: true,
      isSecret: false,
      isMine: false,
      nickname: '미지의 사용자',
      profileImage: '',
      content: '탈퇴한 사용자의 댓글',
      date: formatDate(recomment.created),
      mention: null,
      taggedUserId: null,
    };
  }
  return {
    id: recomment.id,
    commentId: recomment.comment_id,
    userId: recomment.user?.id || recomment.user?.user_id,
    isSecret: recomment.is_secret || false,
    isMine: recomment.user?.is_author || false,
    nickname: recomment.user?.profile?.nickname || '익명',
    profileImage: recomment.user?.profile?.profile_img || '',
    content: recomment.content,
    date: formatDate(recomment.created),
    mention: recomment.tagged_user?.nickname || null,
    taggedUserId: recomment.tagged_user?.user_id || null,
  };
};

/**
 * 그룹장에게 질문하기 섹션
 */
const CommentSection = ({
  studyPk,
  leaderId = '',
}) => {
  const {
    comments: rawComments,
    loading,
    error,
    fetchComments,
    createComment,
    deleteComment,
    createRecomment,
    deleteRecomment,
  } = useComment(studyPk);

  const [replyingTo, setReplyingTo] = useState(null);

  // 댓글 불러오기
  useEffect(() => {
    if (studyPk) {
      fetchComments();
    }
  }, [studyPk, fetchComments]);

  // 데이터 변환
  const comments = rawComments.map(transformComment);

  // 댓글 작성
  const handleCommentSubmit = async ({ content, isSecret }) => {
    const result = await createComment(content, isSecret);
    if (result) {
      alert('댓글이 등록되었습니다.');
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      await deleteComment(commentId);
    }
  };

  // 대댓글 작성
  const handleReplySubmit = async (commentId, content, taggedUserId = null) => {
    const result = await createRecomment(commentId, content, false, taggedUserId);
    if (result) {
      setReplyingTo(null);
    }
  };

  // 대댓글 삭제
  const handleRecommentDelete = async (commentId, recommentId) => {
    if (window.confirm('답글을 삭제하시겠습니까?')) {
      await deleteRecomment(commentId, recommentId);
    }
  };

  // 답글달기 클릭
  const handleReplyClick = (commentId, taggedUserId = null, taggedNickname = null) => {
    setReplyingTo({ commentId, taggedUserId, taggedNickname });
  };

  // 신고
  const handleReport = (id) => {
    alert(`신고 기능은 추후 구현 예정입니다. (ID: ${id})`);
  };

  if (loading) {
    return <div className="w-[840px] text-center py-[30px]">로딩 중...</div>;
  }

  if (error) {
    return <div className="w-[840px] text-center py-[30px] text-error">{error}</div>;
  }

  return (
    <div className="w-[840px] flex flex-col gap-[30px]">
      {/* 타이틀 */}
      <h2 className="text-[30px] font-bold text-text">
        그룹장에게 질문하기
      </h2>

      {/* 댓글 입력창 */}
      <CommentInput onSubmit={handleCommentSubmit} />

      {/* 댓글 목록 */}
      <div className="flex flex-col gap-[30px]">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-[20px]">
            {/* 댓글 */}
            <CommentItem
              profileImage={comment.profileImage}
              nickname={comment.nickname}
              date={comment.date}
              content={comment.content}
              isLeader={comment.userId === leaderId}
              isMine={comment.isMine}
              isSecret={comment.isSecret}
              isDeleted={comment.isDeleted}
              canViewSecret={comment.isMine}
              onReply={() => handleReplyClick(comment.id)}
              onEdit={() => alert('수정 기능 구현 예정')}
              onDelete={() => handleCommentDelete(comment.id)}
              onReport={() => handleReport(comment.id)}
            />

            {/* 대댓글 목록 */}
            {comment.replies?.map((reply) => (
              <ReplyItem
                key={reply.id}
                profileImage={reply.profileImage}
                nickname={reply.nickname}
                date={reply.date}
                content={reply.content}
                mention={reply.mention}
                isLeader={reply.userId === leaderId}
                isMine={reply.isMine}
                isSecret={reply.isSecret}
                isDeleted={reply.isDeleted}
                canViewSecret={reply.isMine || comment.isMine}
                onReply={() => handleReplyClick(comment.id, reply.userId, reply.nickname)}
                onEdit={() => alert('수정 기능 구현 예정')}
                onDelete={() => handleRecommentDelete(comment.id, reply.id)}
                onReport={() => handleReport(reply.id)}
              />
            ))}

            {/* 답글 입력창 */}
            {replyingTo?.commentId === comment.id && (
              <ReplyInput
                placeholder={replyingTo.taggedNickname ? `@${replyingTo.taggedNickname}에게 답글 작성...` : '답글을 입력하세요.'}
                onSubmit={(content) => handleReplySubmit(comment.id, content, replyingTo.taggedUserId)}
                onCancel={() => setReplyingTo(null)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;