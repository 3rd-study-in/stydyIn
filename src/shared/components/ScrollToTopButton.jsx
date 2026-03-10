import { useState, useEffect } from 'react';
import Icon from '../../atoms/Icon/Common/Icon';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(40);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);

      const footer = document.querySelector('footer');
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const footerVisible = Math.max(0, window.innerHeight - footerTop);
        setBottomOffset(footerVisible + 40);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="맨 위로 이동"
      className="fixed z-50 flex items-center justify-center rounded-full cursor-pointer"
      style={{
        width: 50,
        height: 50,
        bottom: bottomOffset,
        right: 'max(20px, calc((100vw - 1190px) / 2 - 70px))',
        backgroundColor: '#8D9299',
      }}
    >
      <Icon name="UpArrow" size={32} color="#FFFFFF" />
    </button>
  );
}
