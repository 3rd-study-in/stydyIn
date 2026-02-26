import React from 'react';
import * as Icons from './index'; 

/**
 * @param {string} name - 사용할 아이콘의 이름 (ex: 'Heart', 'Check', 'Project')
 * @param {number} size - 아이콘의 크기 (기본값: 24)
 * @param {string} color - 아이콘의 색상 (기본값: 'currentColor')
 * @param {string} className - Tailwind CSS 클래스 (색상, 마진, 커서 등 스타일 제어)
 * @param {function} onClick - 클릭 이벤트 핸들러 (아이콘 클릭 시 실행할 함수)
 * @param {object} rest - 기타 SVG 태그에 전달할 나머지 속성들
 */

const Icon = ({ 
  name, 
  size = 24, 
  color,
  className = "", 
  onClick, 
  ...rest 
}) => {

  const SVGIcon = Icons[name]; 

  if (!SVGIcon) {
    console.warn(`Icon "${name}"을 찾을 수 없습니다.`);
    return null;
  }

  if (!SVGIcon) return null;

  return (
    <SVGIcon 
      width={size} 
      height={size} 
      style={{ color: color }} 
      className={`${onClick ? "cursor-pointer" : ""} ${className}`} 
      onClick={onClick}
      aria-hidden="true"
      {...rest}
    />
  );

};



export default Icon;

/* 이벤트 킬 수 있고 끌 수 있는 것. 무엇을 받는다면 무엇을 받는지 */