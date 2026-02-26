import React, { useState } from 'react';
import ProfileCircle from './ProfileCircle'; // 경로 확인 필요!

const Header = () => {
  // 테스트를 위해 로그인 상태를 토글할 수 있게 State를 만듭니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 테스트용 토끼 이미지 경로 (실제 public 폴더에 있는 이미지나 외부 URL)
  const userImageUrl =
    'https://img.freepik.com/free-vector/cute-rabbit-with-heart-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3507.jpg';

  return (
    <header className="p-4 border-b flex items-center justify-between">
      <h1 className="text-xl font-bold">My Project</h1>

      <div className="flex items-center gap-4">
        {/* 테스트용 버튼: 클릭할 때마다 로그인 상태가 바뀝니다 */}
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
        >
          {isLoggedIn ? '로그아웃 시뮬레이션' : '로그인 시뮬레이션'}
        </button>

        {/* ProfileCircle 컴포넌트 테스트 */}
        <ProfileCircle isLoggedIn={isLoggedIn} src={userImageUrl} size={50} />
      </div>
    </header>
  );
};

export default Header;
