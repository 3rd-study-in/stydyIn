// 아이콘 컴포넌트 테스트 페이지

import Icon from './Icon';

function IconTestPage() {
    return (
    <div className="p-10 space-y-8">
        <h1 className="text-2xl font-bold">아이콘 컴포넌트 테스트</h1>

      {/* 1. 기본 렌더링 확인 */}
        <section>
        <h2 className="text-lg font-semibold mb-4">기본 크기 및 렌더링</h2>
        <div className="flex gap-4">
            <Icon name="Home" />
            <Icon name="Heart" />
            <Icon name="Search" />
            <Icon name="Project" />
        </div>
        </section>

      {/* 2. 테일윈드 색상 및 크기 조절 확인 */}
        <section>
        <h2 className="text-lg font-semibold mb-4">스타일 적용</h2>
        <div className="flex gap-4 items-center">
            <Icon name="HeartFill" size={40} className="text-red-500" />
            <Icon name="Check" size={30} className="text-green-500 stroke-2" />
            <Icon name="Alert" className="text-yellow-500 animate-bounce" />
        </div>
        </section>

      {/* 3. 클릭 이벤트 작동 확인 */}
        <section>
        <h2 className="text-lg font-semibold mb-4">클릭 이벤트</h2>
        <Icon 
            name="Meatball" 
            size={32} 
            className="hover:bg-gray-100 rounded-full p-1"
            onClick={() => alert('클릭했습니다.')} 
        />
        </section>
    </div>
    );
}

export default IconTestPage;