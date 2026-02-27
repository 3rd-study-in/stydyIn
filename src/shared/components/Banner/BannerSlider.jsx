    import { useState, useEffect, useCallback } from 'react';
    import Icon from '../../../atoms/Icon/Common/Icon';
    import Image from '../../../atoms/Images/Common/Image';

    const BANNER_DATA = [
    {
        id: 1,
        tag: "스터디 모집",
        title: "집혼자 공부하기 지치셨나요?\n함께하면 더 오래 갑니다",
        desc: "내 지역, 내 관심사에 딱 맞는 스터디를 찾아보세요",
        img: "BannerSmile",
        bgColor: "bg-[#FFDEE3]",
        tagStyle: "bg-black text-white",
        titleColor: "text-text",
        dark: false,
    },
    {
        id: 2,
        tag: "인기 스터디",
        title: "이번 주 가장 핫한\n스터디를 확인해 보세요 🔥",
        desc: "지금 가장 많은 사람들이 참여하고 있는 스터디",
        img: "BannerHappy",
        bgColor: "bg-[#607FFF]",
        tagStyle: "bg-white text-text",
        titleColor: "text-white",
        dark: true,
    },
    {
        id: 3,
        tag: "서비스 소개",
        title: "스터디인에서 같이 코딩할\n스터디원을 구해보세요!",
        desc: "장소 제약 없이, 전국 어디서든 함께 공부해요",
        img: "BannerStudy",
        bgColor: "bg-[#2B3444]",
        tagStyle: "bg-white text-text",
        titleColor: "text-white",
        dark: true,
    }
    ];

    export default function BannerSlider() {
    const [current, setCurrent] = useState(0);

    // 다음 슬라이드 이동
    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev === BANNER_DATA.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? BANNER_DATA.length - 1 : prev - 1));
    };



    useEffect(() => {
        const timer = setInterval(() => {
        nextSlide();
        }, 5000); // 5초 마다 전환

        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <div className="relative w-[880px] h-[300px] overflow-hidden rounded-lg group mx-auto">

        {/* 슬라이드 트랙 */}
        <div 
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
        >
            {BANNER_DATA.map((banner) => (
            <div 
                key={banner.id}
                className={`flex-shrink-0 w-full h-full flex items-start justify-between px-16 ${banner.bgColor} ${banner.dark ? 'text-white' : 'text-text'}`}
            >
                {/* 텍스트 영역 */}
            <div className="z-10 text-left pl-3 pt-13.5">
                <span className={`inline-block px-sm py-xxs text-xs font-bold mb-md rounded-full ${banner.tagStyle}`}>
                {banner.tag}
                </span>
                <h2 className={`text-3xl font-medium leading-tight whitespace-pre-line mb-lg ${banner.titleColor}`}>
                {banner.title}
                </h2>
                <p className={`text-sm ${banner.dark ? 'text-white' : 'text-text-muted'}`}>
                {banner.desc}
                </p>
            </div>

                <div className="relative h-full flex items-center pr-lg">
                <Image 
                name={banner} alt="banner" className="h-[220px] w-auto object-contain" />
                </div>
            </div>
            ))}
        </div>

        {/* 컨트롤 버튼 */}
        <button 
            onClick={prevSlide}
            className="absolute left-1 top-1/2 -translate-y-1/2 cursor-pointer drop-shadow-md hover: transition-all"
        >
            <Icon
            name="LeftArrow" size={36} className={`${BANNER_DATA[current].dark ? "text-white" : "text-text"} drop-shadow-md`}
            />
        </button>
        <button 
            onClick={nextSlide}
            className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer drop-shadow-md hover: transition-all"
        >
            <Icon name="RightArrow" size={36} className={`${BANNER_DATA[current].dark ? "text-white" : "text-text"} drop-shadow-md`} />
        </button>

        {/* 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 drop-shadow-md flex gap-1.5">
            {BANNER_DATA.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                    current === idx 
                    ? (BANNER_DATA[current].dark ? 'bg-white w-5': 'bg-white     w-5') 
                    : 'bg-white/40 w-1.5'
                }`}
            />
            ))}
        </div>
        </div>
    );
    }



    // App.jsx에서 테스트
//     import BannerSlider from './shared/components/Banner/BannerSlider';

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-10">
//       <h1 className="text-2xl font-bold mb-8 text-text">메인 배너 컴포넌트 테스트</h1>

//       {/*배너 슬라이더 */}
//       <BannerSlider />

//       <div className="mt-10 text-text-disabled text-sm">
//         5초마다 자동으로 다음 슬라이드로 넘어갑니다.
//       </div>
//     </div>
//   );
// }

// export default App;