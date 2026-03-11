import { Crown, Lock, Send } from '../../../atoms/Icon/Common';

/**
 * 댓글 아이템
 */
const CommentItem = ({
  profileImage = '',
  nickname = '',
  date = '',
  content = '',
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
  onReply,
  onEdit,
  onDelete,
  onReport,
}) => {

  const renderContent = (text) => {
  const parts = text.split(/(@\S+)/g);
  return parts.map((part, i) =>
    part.startsWith('@')
      ? <span key={i} className="text-[16px] font-medium text-primary leading-[24px]">{part}</span>
      : <span key={i} className="text-[16px] font-normal text-text leading-[24px]">{part}</span>
  );
};

  // 탈퇴한 사용자
  if (isDeleted) {
    const isActuallyDeleted = nickname === '삭제된 댓글';
    return (
      <div className="w-[840px] flex flex-col gap-[8px]">
        <div className="flex items-center gap-[10px]">
          <div className="w-[40px] h-[40px] rounded-full border border-border bg-bg" />
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-[10px]">
              <span className="text-[14px] font-bold text-secondary leading-[20px]">
                {isActuallyDeleted ? '삭제된 댓글' : nickname}
              </span>
              <span className="w-[52px] h-[20px] text-[14px] font-normal text-text-muted underline cursor-pointer shrink-0 flex items-center leading-[20px]" onClick={onReply}>답글달기</span>
            </div>
            {/* 삭제된 댓글은 날짜 미표시 */}
            {!isActuallyDeleted && (
              <span className="text-[12px] font-normal text-secondary leading-[16px]">{date}</span>
            )}
          </div>
        </div>
        <p className="text-[16px] font-normal text-secondary ml-[50px] leading-[24px]">{content}</p>
      </div>
    );
  }

  // 비밀댓글 (볼 수 없는 경우)
  if (isSecret && !canViewSecret) {
    return (
      <div className="w-[840px] flex flex-col gap-[8px]">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-[10px]">
            <div className="w-[40px] h-[40px] rounded-full border border-border bg-bg" />
            <div className="flex flex-col gap-[2px]">
              <span className="text-[14px] font-bold text-secondary leading-[20px]">익명</span>
              <span className="text-[12px] font-normal text-secondary leading-[16px]">{date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[8px] ml-[50px]">
          <Lock className="w-[24px] h-[24px] text-info" />
          <p className="text-[16px] font-normal text-secondary leading-[24px]">비밀 댓글입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[840px] flex flex-col gap-[8px]">
      {/* 상단: 프로필 + 버튼 */}
      <div className="flex justify-between items-start">
        {/* 좌측: 프로필 */}
        <div className="flex items-center gap-[10px]">
          <img
            src={profileImage}
            alt="프로필"
            className="w-[40px] h-[40px] rounded-full border border-border object-cover"
          />
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-[10px]">
              <span className="text-[14px] font-bold text-text leading-[20px]">{nickname}</span>
              {isLeader && <Crown className="w-[20px] h-[20px] text-accent" />}
              {isMine && (
                <span className="w-[50px] h-[24px] px-[8px] text-[12px] font-normal text-primary border border-primary rounded-[4px] flex items-center justify-center whitespace-nowrap shrink-0">
                  내댓글
                </span>
              )}
              <span 
                className="w-[52px] h-[20px] text-[14px] font-normal text-text-muted underline cursor-pointer shrink-0 flex items-center leading-[20px]"
                onClick={onReply}
              >
                답글달기
              </span>
            </div>
            <span className="text-[12px] font-normal text-secondary leading-[16px]">{date}</span>
          </div>
        </div>

        {/* 우측: 버튼 */}
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
      </div>

      {/* 내용 or 인라인 수정 입력창 */}
      {isEditing ? (
        <div className="flex border border-border rounded-[8px] overflow-hidden ml-[50px]">
          <input
            type="text"
            value={editContent}
            onChange={onEditChange}
            autoFocus
            placeholder={isSecret ? '비밀 댓글 수정하기' : '댓글 수정하기'}
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
        <div className="flex items-start gap-[8px] ml-[50px]">
          {isSecret && canViewSecret && (
            <Lock className="w-[24px] h-[24px] text-info shrink-0" />
          )}
          <p className="text-[16px] font-normal text-text leading-[24px]">{renderContent(content)}</p>
        </div>
      )}
    </div>
  );
};

export default CommentItem;