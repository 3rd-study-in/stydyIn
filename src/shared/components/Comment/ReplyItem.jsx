import { CommentArrow, Crown, Lock, Send } from '../../../atoms/Icon/Common';

/**
 * 대댓글 아이템
 */
const ReplyItem = ({
  profileImage = '',
  nickname = '',
  date = '',
  content = '',
  mention = '',
  isLeader = false,
  isMine = false,
  isSecret = false,
  isDeleted = false,
  canViewSecret = false,
  isEditing = false,
  editContent = '',
  onEditChange,
  onEditSubmit,
  onEditCancel,
  onEdit,
  onDelete,
  onReport,
  onReply,
}) => {
  // 멘션 파싱
  const renderContent = () => {
    if (!content) return null;
    if (mention) {
      const mentionText = `@${mention}`;
      const idx = content.indexOf(mentionText);
      if (idx !== -1) {
        return (
          <>
            <span className="text-[16px] font-medium text-primary leading-[24px]">{mentionText}</span>
            <span className="text-[16px] font-normal text-text ml-[4px] leading-[24px]">{content.slice(idx + mentionText.length)}</span>
          </>
        );
      }
    }
    const parts = content.split(/(@\S+)/g);
    return parts.map((part, i) =>
      part.startsWith('@')
        ? <span key={i} className="text-[16px] font-medium text-primary leading-[24px]">{part}</span>
        : <span key={i} className="text-[16px] font-normal text-text leading-[24px]">{part}</span>
    );
  };

  const displayNickname = isDeleted
    ? '미지의 사용자'
    : isSecret && !canViewSecret
    ? '익명'
    : nickname;

  return (
    <div className="w-[824px] flex gap-[12px] ml-[16px]">
      {/* 대댓글 화살표 */}
      <CommentArrow className="w-[22px] h-[26px] text-border shrink-0" />

      {/* 대댓글 내용 */}
      <div className="w-[790px] flex flex-col gap-[8px]">
        {/* 상단: 프로필 + 버튼 */}
        <div className="flex justify-between items-start">
          {/* 좌측: 프로필 */}
          <div className="flex items-center gap-[10px]">
            {isDeleted ? (
              <div className="w-[40px] h-[40px] rounded-full border border-border bg-bg" />
            ) : (
              <img
                src={profileImage}
                alt="프로필"
                className="w-[40px] h-[40px] rounded-full border border-border object-cover"
              />
            )}
            <div className="flex flex-col gap-[2px]">
              <div className="flex items-center gap-[6px]">
                <span className={`text-[14px] font-bold leading-[20px] ${isDeleted || (isSecret && !canViewSecret) ? 'text-secondary' : 'text-text'}`}>
                  {displayNickname}
                </span>
                {isLeader && !isDeleted && !(isSecret && !canViewSecret) && (
                  <Crown className="w-[20px] h-[20px] text-accent" />
                )}
                {isMine && !isDeleted && (
                  <span className="w-[50px] h-[24px] px-[8px] text-[12px] font-normal text-primary border border-primary rounded-[4px] flex items-center justify-center whitespace-nowrap shrink-0">
                    내댓글
                  </span>
                )}
                {/* 답글달기 버튼 없음 - 최초 댓글에만 표시 */}
              </div>
              <span className="text-[12px] font-normal text-secondary leading-[16px]">{date}</span>
            </div>
          </div>

          {/* 우측: 버튼 */}
          {!isDeleted && !(isSecret && !canViewSecret) && (
            <div className="flex items-center gap-[12px]">
              {isMine ? (
                isEditing ? (
                  <>
                    <span
                      className="text-[14px] font-normal text-text-muted underline cursor-pointer leading-[20px]"
                      onClick={onEditCancel}
                    >
                      취소
                    </span>
                    <span
                      className="text-[14px] font-normal text-text-muted underline cursor-pointer leading-[20px]"
                      onClick={onDelete}
                    >
                      삭제
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className="text-[14px] font-normal text-text-muted underline cursor-pointer leading-[20px]"
                      onClick={onEdit}
                    >
                      수정
                    </span>
                    <span
                      className="text-[14px] font-normal text-text-muted underline cursor-pointer leading-[20px]"
                      onClick={onDelete}
                    >
                      삭제
                    </span>
                  </>
                )
              ) : (
                <span
                  className="text-[14px] font-normal text-text-muted underline cursor-pointer leading-[20px]"
                  onClick={onReport}
                >
                  신고
                </span>
              )}
            </div>
          )}
        </div>

        {/* 내용 */}
        {isEditing ? (
          <div className="flex border border-border rounded-[8px] overflow-hidden">
            <input
              type="text"
              value={editContent}
              onChange={onEditChange}
              autoFocus
              placeholder={isSecret ? '비밀 대댓글 수정하기' : '대댓글 수정하기'}
              className="flex-1 px-[16px] h-[50px] text-[16px] font-normal text-text placeholder:text-secondary outline-none"
            />
            <button
              onClick={onEditSubmit}
              className="w-[50px] h-[50px] bg-secondary-light flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-[26px] h-[26px] text-bg" />
            </button>
          </div>
        ) : (
          <div className="flex items-start gap-[8px]">
            {isSecret && canViewSecret && (
              <Lock className="w-[24px] h-[24px] text-info shrink-0" />
            )}
            {isDeleted ? (
              <p className="text-[16px] font-normal text-secondary leading-[24px]">탈퇴한 사용자의 댓글</p>
            ) : isSecret && !canViewSecret ? (
              <div className="flex items-center gap-[8px]">
                <Lock className="w-[24px] h-[24px] text-info" />
                <p className="text-[16px] font-normal text-secondary leading-[24px]">비밀 댓글입니다.</p>
              </div>
            ) : (
              <div>{renderContent()}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyItem;