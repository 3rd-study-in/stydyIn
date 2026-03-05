import { Crown, Lock } from '../../../atoms/Icon/Common';

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
  onReply,
  onEdit,
  onDelete,
  onReport,
}) => {
  // 탈퇴한 사용자
  if (isDeleted) {
    return (
      <div className="w-[840px] flex flex-col gap-[16px]">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-[10px]">
            <div className="w-[40px] h-[40px] rounded-full border border-border bg-bg" />
            <div className="flex flex-col gap-[2px]">
              <div className="flex items-center gap-[10px]">
                <span className="text-[14px] font-bold text-secondary">미지의 사용자</span>
                <span className="text-[14px] font-normal text-text-muted underline cursor-pointer">답글달기</span>
              </div>
              <span className="text-[12px] font-normal text-secondary">{date}</span>
            </div>
          </div>
        </div>
        <p className="text-[16px] font-normal text-secondary ml-[50px]">탈퇴한 사용자의 댓글</p>
      </div>
    );
  }

  // 비밀댓글 (볼 수 없는 경우)
  if (isSecret && !canViewSecret) {
    return (
      <div className="w-[840px] flex flex-col gap-[16px]">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-[10px]">
            <div className="w-[40px] h-[40px] rounded-full border border-border bg-bg" />
            <div className="flex flex-col gap-[2px]">
              <span className="text-[14px] font-bold text-secondary">익명</span>
              <span className="text-[12px] font-normal text-secondary">{date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[8px] ml-[50px]">
          <Lock className="w-[24px] h-[24px] text-info" />
          <p className="text-[16px] font-normal text-secondary">비밀 댓글입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[840px] flex flex-col gap-[16px]">
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
            <div className="flex items-center gap-[6px]">
              <span className="text-[14px] font-bold text-text">{nickname}</span>
              {isLeader && <Crown className="w-[20px] h-[20px] text-accent" />}
              {isMine && (
                <span className="px-[8px] py-[4px] text-[12px] font-normal text-primary border border-primary rounded-[4px]">
                  내댓글
                </span>
              )}
              {!isMine && (
                <span 
                  className="text-[14px] font-normal text-text-muted underline cursor-pointer"
                  onClick={onReply}
                >
                  답글달기
                </span>
              )}
            </div>
            <span className="text-[12px] font-normal text-secondary">{date}</span>
          </div>
        </div>

        {/* 우측: 버튼 */}
        <div className="flex items-center gap-[12px]">
          {isMine ? (
            <>
              <span 
                className="text-[14px] font-normal text-text-muted underline cursor-pointer"
                onClick={onEdit}
              >
                수정
              </span>
              <span 
                className="text-[14px] font-normal text-text-muted underline cursor-pointer"
                onClick={onDelete}
              >
                삭제
              </span>
            </>
          ) : (
            <span 
              className="text-[14px] font-normal text-text-muted underline cursor-pointer"
              onClick={onReport}
            >
              신고
            </span>
          )}
        </div>
      </div>

      {/* 내용 */}
      <div className="flex items-start gap-[8px] ml-[50px]">
        {isSecret && canViewSecret && (
          <Lock className="w-[24px] h-[24px] text-info shrink-0" />
        )}
        <p className="text-[16px] font-normal text-text">{content}</p>
      </div>
    </div>
  );
};

export default CommentItem;