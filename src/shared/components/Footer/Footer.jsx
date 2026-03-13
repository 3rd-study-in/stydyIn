import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Icon from '../../../atoms/Icon/Common/Icon';
import Modal from '../../../atoms/Modal/Modal';

const FooterSection = ({ title, links, onComingSoon }) => (
  <nav aria-labelledby={`footer-${title}`} className="flex flex-col gap-4">
    {/* text-lg(16px) 적용 */}
    <h3
      id={`footer-${title}`}
      className="block font-bold text-lg text-text"
    >
      {title}
    </h3>
    <ul className="flex flex-col gap-xs">
      {' '}
      {/* gap-xxs(6px), gap-xs(8px) */}
      {links.map((link, index) => (
        <li key={index}>
          <a
            href={link.url}
            className="text-secondary text-base hover:text-primary transition-colors flex items-center gap-xxxs mb-xs"
            /* text-sm(12px), text-base(14px), gap-xxxs(4px), mb-xs(8px) */
            target={link.isExternal ? '_blank' : undefined}
            rel={link.isExternal ? 'noopener noreferrer' : undefined}
            onClick={link.url === '#' ? (e) => { e.preventDefault(); onComingSoon?.(); } : undefined}
          >
            {link.label}
            {link.isExternal && (
              <span className="text-xs opacity-50" aria-hidden="true">
                {' '}
                {/* text-xs(10px) */}
                <Icon
                  name="diagonalArrow"
                  className="w-2.5 h-2.5 text-secondary-dark"
                />{' '}
                {/* 10px 수준의 수치 대치 */}
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const Footer = ({ className }) => {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const footerData = {
    weniv: [
      { label: '회사 소개', url: '#', isExternal: true },
      { label: '제주코딩베이스캠프', url: '#', isExternal: true },
    ],
    world: [{ label: '위니브월드 이용 가이드', url: '#' }],
    policy: [
      { label: '이용약관', url: '#' },
      { label: '위치기반서비스이용약관', url: '#' },
      { label: '개인정보 처리방침', url: '#' },
    ],
  };

  return (
    <>
    <footer
      className={twMerge(
        'w-full bg-bg border-t border-border pt-5xl pb-5xl px-xxxs',
        /* pt-4xl(32px), pb-4xl(32px), md:pt-5xl(48px) */
        className,
      )}
    >
      <div className="max-w-[1190px] mx-auto relative flex flex-col items-start">
        {/* 1. 메뉴 영역 */}
        <div className="flex gap-5xl mb-5xl">
          {/* gap-x-xl(20px), gap-y-xxs(6px), md:gap-1xl(24px) */}
          <FooterSection title="위니브" links={footerData.weniv} onComingSoon={() => setComingSoonOpen(true)} />
          <FooterSection title="정책" links={footerData.policy} onComingSoon={() => setComingSoonOpen(true)} />
          <FooterSection title="위니브월드" links={footerData.world} onComingSoon={() => setComingSoonOpen(true)} />
        </div>

        {/* 2. 소셜 미디어 */}
        <nav
          aria-label="Social Media Links"
          className="mb-0 absolute right-0"
        >
          <ul className="flex gap-xs">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i}>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setComingSoonOpen(true); }}
                  className="block w-4xl h-4xl border border-border rounded-md hover:bg-bg-muted transition-colors"
                  /* w-4xl(32px), rounded-md(8px) */
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* 3. 하단 로고 및 정보 */}
        <div className="flex flex-col items-start gap-4xl w-full">
          {/* 로고: 126px은 시스템에 없으므로 대괄호 유지 혹은 w-logo 추가 */}
          <Icon
            name="SymbolLogo"
            className="w-[126px] h-8 text-secondary-light order-first"
          />

          <address className="flex flex-wrap gap-x-xxs gap-y-xxxs not-italic text-sm text-text-disabled">
            {/* text-sm(12px), gap-x-xxs(6px) */}
            <span className="font-bold">(주)위니브</span>
            <span>대표 : 이호준</span>
            <span>|</span>
            <span>사업자 번호 : 546-86-01737</span>
            <span>|</span>
            <span>정보통신업</span>
            <span>|</span>
            <span>주소 : 제주특별자치도 제주시 수목원길</span>
          </address>
        </div>
      </div>
    </footer>

      {/* 기능 구현 중 모달 */}
      <Modal isOpen={comingSoonOpen} onClose={() => setComingSoonOpen(false)}>
        <div className="w-80 bg-white rounded-[10px] shadow-lg overflow-hidden">
          <div className="py-8 px-6 text-center text-base text-text">
            기능 구현 중입니다.
          </div>
          <div className="border-t border-border">
            <button
              type="button"
              onClick={() => setComingSoonOpen(false)}
              className="w-full py-3 text-base text-text-muted hover:bg-bg-muted transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Footer;
