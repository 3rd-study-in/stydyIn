import TagSize from '../../../atoms/Tag/TagSize';
import { Crown } from '../../../atoms/Icon/Common';

/**
 * 상세 페이지 그룹장 소개 틀
 */
const LeaderProfile = ({
  profileImage = '',
  nickname = '',
  location = '',
  introduction = '',
}) => {
  return (
    <div className="w-full max-w-[840px]">
      {/* 타이틀 */}
      <h2 className="text-[30px] font-bold text-text">
        그룹장 소개
      </h2>

      {/* 프로필 영역 */}
      <div className="mt-[30px] flex gap-[30px]">
        {/* 프로필 이미지 */}
        <div className="w-[130px] h-[130px] shrink-0 rounded-full overflow-hidden bg-bg-muted">
          <img
            src={profileImage}
            alt="그룹장 프로필"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 우측 콘텐츠 */}
        <div className="flex flex-col">
          {/* 닉네임 + 왕관 + 지역 태그 */}
          <div className="flex items-center">
            <span className="text-[18px] font-bold text-text">{nickname}</span>
            <Crown className="w-[26px] h-[26px] ml-[6px]" />
            {location && (
              <div className="ml-[10px]">
                <TagSize size="M" variant="lightgray">
                  {location}
                </TagSize>
              </div>
            )}
          </div>

          {/* 말풍선 */}
          <div className="mt-[10px] relative">
            {/* 말풍선 꼬리 */}
            <div 
              className="absolute top-[10px] left-0 w-0 h-0"
              style={{
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderRight: '10px solid #FFE187',
                marginLeft: '-10px',
              }}
            />
            {/* 말풍선 본체 */}
            <div className="bg-accent-light rounded-lg py-[20px] px-[30px] max-w-[620px]">
              <p className="text-[14px] font-normal text-text leading-relaxed">
                {introduction}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderProfile;