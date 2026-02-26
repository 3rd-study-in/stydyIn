    import { useState, useEffect, useCallback } from 'react';
    import Icon from '../../../atoms/Icon/Common/Icon';

    const BANNER_DATA = [
    {
        id: 1,
        tag: "스터디 모집",
        title: "집혼자 공부하기 지치셨나요?\n함께하면 더 오래 갑니다",
        desc: "내 지역, 내 관심사에 딱 맞는 스터디를 찾아보세요",
        img: "/src/asset/images/banner-smile.png", // 임시 이미지
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
        img: "/src/asset/images/banner-happy.png",
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
        img: "/src/asset/images/banner-study.png",
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
        <div className="relative w-[880px] h-[300px] overflow-hidden rounded-2xl group mx-auto">

        {/* 슬라이드 트랙 */}
        <div 
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
        >
            {BANNER_DATA.map((banner) => (
            <div 
                key={banner.id}
                className={`flex-shrink-0 w-full h-full flex items-center justify-between px-16 ${banner.bgColor} ${banner.dark ? 'text-white' : 'text-text'}`}
            >
                {/* 텍스트 영역 */}
            <div className="z-10 text-left pl-lg">
                <span className={`inline-block px-sm py-xs text-xs font-bold mb-md rounded-full ${banner.tagStyle}`}>
                {banner.tag}
                </span>
                <h2 className={`text-3xl font-medium leading-tight whitespace-pre-line mb-lg ${banner.titleColor}`}>
                {banner.title}
                </h2>
                <p className={`text-sm ${banner.dark ? 'text-white' : 'text-text-muted'}`}>
                {banner.desc}
                </p>
            </div>

                <div className="relative h-full flex items-end pr-lg">
                <img src={banner.img} alt="banner" className="h-[250px] w-auto object-contain" />
                </div>
            </div>
            ))}
        </div>

        {/* 컨트롤 버튼 */}
        <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover: transition-all"
        >
            <Icon name="LeftArrow" size={36} className={BANNER_DATA[current].dark ? "text-white" : "text-slate-800"} />
        </button>
        <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2  hover: transition-all"
        >
            <Icon name="RightArrow" size={36} className={BANNER_DATA[current].dark ? "text-white" : "text-slate-800"} />
        </button>

        {/* 인디케이터 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
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