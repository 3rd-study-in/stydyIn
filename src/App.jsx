
// function App() {

//   return <></>;
// }

// export default App;


import BannerSlider from './shared/components/Banner/BannerSlider';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-10">
      <h1 className="text-2xl font-bold mb-8 text-text">메인 배너 컴포넌트 테스트</h1>
      
      {/*배너 슬라이더 */}
      <BannerSlider />
      
      <div className="mt-10 text-text-disabled text-sm">
        5초마다 자동으로 다음 슬라이드로 넘어갑니다.
      </div>
    </div>
  );
}

export default App;