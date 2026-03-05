import { CommentArrow, Crown, Lock } from '../../../atoms/Icon/Common';

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
  onReply,
  onEdit,
  onDelete,
  onReport,
}) => {
  // 멘션 파싱
  const renderContent = () => {
    if (mention) {
      return (
        <>
          <span className="text-[16px] font-medium text-primary">@{mention}</span>
          <span className="text-[16px] font-normal text-text ml-[8px]">{content}</span>
        </>
      );
    }
    return <span className="text-[16px] font-normal text-text">{content}</span>;
  };

  return (
    <div className="w-[824px] flex gap-[12px] ml-[16px]">
      {/* 대댓글 화살표 */}
      <CommentArrow className="w-[22px] h-[26px] text-border shrink-0" />

      {/* 대댓글 내용 */}
      <div className="w-[790px] flex flex-col gap-[16px]">
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
                <span className={`text-[14px] font-bold ${isDeleted ? 'text-secondary' : 'text-text'}`}>
                  {isDeleted ? '미지의 사용자' : nickname}
                </span>
                {isLeader && !isDeleted && <Crown className="w-[20px] h-[20px] text-accent" />}
                {isMine && !isDeleted && (
                  <span className="px-[8px] py-[4px] text-[12px] font-normal text-primary border border-primary rounded-[4px]">
                    내댓글
                  </span>
                )}
                {!isMine && !isDeleted && (
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
          {!isDeleted && (
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
          )}
        </div>

        {/* 내용 */}
        <div className="flex items-start gap-[8px]">
          {isSecret && canViewSecret && (
            <Lock className="w-[24px] h-[24px] text-info shrink-0" />
          )}
          {isDeleted ? (
            <p className="text-[16px] font-normal text-secondary">탈퇴한 사용자의 댓글</p>
          ) : isSecret && !canViewSecret ? (
            <p className="text-[16px] font-normal text-secondary">비밀 댓글입니다.</p>
          ) : (
            <div>{renderContent()}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;