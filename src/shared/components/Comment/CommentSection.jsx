import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import ReplyItem from './ReplyItem';
import ReplyInput from './ReplyInput';

/**
 * 그룹장에게 질문하기 섹션
 */
const CommentSection = ({
  comments = [],
  isMyPost = false,
  currentUserId = '',
  leaderId = '',
  onCommentSubmit,
  onReplySubmit,
  onEdit,
  onDelete,
  onReport,
}) => {
  return (
    <div className="w-[840px] flex flex-col gap-[30px]">
      {/* 타이틀 */}
      <h2 className="text-[30px] font-bold text-text">
        그룹장에게 질문하기
      </h2>

      {/* 댓글 입력창 */}
      <CommentInput onSubmit={onCommentSubmit} />

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
              isMine={comment.userId === currentUserId}
              isSecret={comment.isSecret}
              isDeleted={comment.isDeleted}
              canViewSecret={isMyPost || comment.userId === currentUserId}
              onReply={() => {}}
              onEdit={() => onEdit?.(comment.id)}
              onDelete={() => onDelete?.(comment.id)}
              onReport={() => onReport?.(comment.id)}
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
                isMine={reply.userId === currentUserId}
                isSecret={reply.isSecret}
                isDeleted={reply.isDeleted}
                canViewSecret={isMyPost || reply.userId === currentUserId || comment.userId === currentUserId}
                onReply={() => {}}
                onEdit={() => onEdit?.(reply.id)}
                onDelete={() => onDelete?.(reply.id)}
                onReport={() => onReport?.(reply.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;