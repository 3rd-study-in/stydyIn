import React from 'react';

const ProfileCircle = ({ src, isLoggedIn, size = 40 }) => {
  // 1. 로그인 상태이고 + src 문자열이 실제로 존재할 때만 true
  // 빈 문자열("")이나 null, undefined는 모두 false가 됩니다.
  const showUserImage = isLoggedIn && src && src.trim() !== '';

  return (
    <div
      className="relative inline-flex cursor-pointer overflow-hidden rounded-full border border-gray-200 shadow-sm bg-white flex items-center justify-center"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {showUserImage ? (
        <img
          src={src}
          alt="User Profile"
          className="h-full w-full object-cover"
          // 이미지 로드 실패 시 다시 한 번 엑박을 방지하는 안전장치
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        // 2. 로그인 전이거나 이미지가 없으면 아예 빈 div만 렌더링
        // 여기에 bg-bg가 있으므로 깨끗한 배경색 원이 나옵니다.
        <div className="w-full h-full bg-bg" />
      )}
    </div>
  );
};

export default ProfileCircle;
