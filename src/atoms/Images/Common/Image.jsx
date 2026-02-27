    import React from 'react';
    import * as ImageAssets from './index';

    /**
     * @param {string} name - 이미지 변수명 (ex: 'MainLogo', 'UserProfile')
     * @param {number|string} width - 가로 크기
     * @param {number|string} height - 세로 크기 (생략 시 width와 동일하거나 비율 유지)
     * @param {string} className - Tailwind CSS 클래스
     * @param {string} alt - 이미지 설명 (접근성을 위해 필수!)
     * @param {function} onClick - 클릭 이벤트
     */

    const Image = ({ 
    name, 
    width, 
    height, 
    className = "", 
    alt = "", 
    onClick, 
    ...rest 
    }) => {

    // index.js에서 가져온 이미지 경로 확인
    const src = ImageAssets[name]; 

    if (!src) {
        console.warn(`이미지 "${name}"을 찾을 수 없습니다. 경로를 확인해주세요.`);
        return null;
    }

    return (
        <img
        src={src}
        alt={alt || name} // alt값이 없으면 name이라도 넣어주는 것이 좋습니다.
        width={width}
        height={height}
        className={`${onClick ? "cursor-pointer" : ""} ${className}`} 
        onClick={onClick}
        {...rest}
        />
    );
    };

    export default Image;