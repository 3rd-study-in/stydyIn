import { useState } from 'react';
import { SquareCheck, SquareCheckFill } from '../../../atoms/Icon/Common';

/**
 * 댓글 입력창
 */
const CommentInput = ({
  onSubmit,
  placeholder = "다른 사람의 권리를 침해하거나 명예를 훼손하는 댓글은 관련 법률에 의해 제재를 받을 수 있습니다.",
  maxLength = 300,
}) => {
  const [content, setContent] = useState('');
  const [isSecret, setIsSecret] = useState(false);

  const handleSubmit = () => {
    if (content.trim() && onSubmit) {
      onSubmit({ content, isSecret });
      setContent('');
      setIsSecret(false);
    }
  };

  return (
    <div className="w-[840px] h-[150px] border border-border rounded-[10px] flex overflow-hidden">
      {/* 좌측 텍스트 입력 영역 */}
      <div className="w-[690px] h-full p-[24px]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          className="w-full h-full resize-none text-[16px] font-normal text-text placeholder:text-secondary outline-none"
        />
      </div>

      {/* 우측 버튼 영역 */}
      <div className="w-[150px] h-full border-l border-border flex flex-col">
        {/* 글자수 */}
        <div className="flex justify-center pt-[20px]">
          <span className="text-[16px] font-medium text-text-muted">
            {content.length}/{maxLength}
          </span>
        </div>

        {/* 비밀댓글 체크박스 */}
        <div 
          className="flex items-center justify-center gap-[4px] mt-[20px] cursor-pointer"
          onClick={() => setIsSecret(!isSecret)}
        >
          {isSecret ? (
            <SquareCheckFill className="w-[20px] h-[20px] text-primary" />
          ) : (
            <SquareCheck className="w-[20px] h-[20px] text-secondary-light" />
          )}
          <span className={`text-[14px] ${isSecret ? 'font-medium text-primary' : 'font-normal text-secondary'}`}>
            비밀댓글
          </span>
        </div>

        {/* 등록 버튼 */}
        <button
          onClick={handleSubmit}
          className={`w-full h-[50px] mt-auto border-t border-border text-[16px] font-medium text-text-muted
            ${isSecret ? 'bg-bg-muted' : 'bg-bg'} hover:bg-bg-muted transition-colors`}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default CommentInput;