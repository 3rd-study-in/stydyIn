import { useState } from 'react';
import TagSize from '../../../atoms/Tag/TagSize';
import { Crown } from '../../../atoms/Icon/Common';
import UserInfoModal from '../Modal/UserInfoModal';

/**
 * 상세 페이지 그룹장 소개 틀
 */
const LeaderProfile = ({
  userId,
  profileImage = '',
  nickname = '',
  location = '',
  introduction = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full max-w-[840px]">
      {/* 타이틀 */}
      <h2 className="text-[30px] font-bold text-text">
        그룹장 소개
      </h2>

      {/* 프로필 영역 */}
      <div className="mt-[30px] flex gap-[30px]">
        {/* 프로필 이미지 */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-[130px] h-[130px] shrink-0 rounded-full overflow-hidden bg-bg-muted cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img
            src={profileImage}
            alt="그룹장 프로필"
            className="w-full h-full object-cover"
          />
        </button>

        {/* 우측 콘텐츠 */}
        <div className="flex flex-col">
          {/* 닉네임 + 왕관 + 지역 태그 */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-[18px] font-bold text-text hover:underline cursor-pointer"
            >
              {nickname}
            </button>
            <Crown className="w-[26px] h-[26px] ml-[6px] text-accent" />
            {location && (
              <div className="ml-[10px]">
                <TagSize size="S" variant="lightgray">
                  {location}
                </TagSize>
              </div>
            )}
          </div>

          {/* 말풍선 */}
          <div
            className="mt-[10px] bg-accent-light py-[20px] px-[30px] w-[680px]"
            style={{ borderRadius: '2px 30px 30px 30px' }}
          >
            <p className="text-[14px] font-normal text-text leading-[20px]">
              {introduction}
            </p>
          </div>
        </div>
      </div>

      <UserInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
      />
    </div>
  );
};

export default LeaderProfile;