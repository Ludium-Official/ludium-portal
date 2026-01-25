import { type ReactNode, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';

const scrollPositions = new Map<string, number>();

const ScrollWrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    const radixViewport = document.querySelector('[data-radix-scroll-area-viewport]');

    return () => {
      if (prevPathname.current) {
        const scrollTop = radixViewport?.scrollTop ?? document.documentElement.scrollTop;
        scrollPositions.set(prevPathname.current, scrollTop);
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    prevPathname.current = location.pathname;
  }, [location.pathname]);

  useLayoutEffect(() => {
    const radixViewport = document.querySelector('[data-radix-scroll-area-viewport]');

    if (navigationType === 'POP') {
      const savedPosition = scrollPositions.get(location.pathname) ?? 0;

      requestAnimationFrame(() => {
        document.documentElement.scrollTo(0, savedPosition);
        if (radixViewport) {
          radixViewport.scrollTo(0, savedPosition);
        }
      });
    } else {
      document.documentElement.scrollTo(0, 0);
      if (radixViewport) {
        radixViewport.scrollTo(0, 0);
      }
    }
  }, [location.pathname, navigationType]);

  return children;
};

export default ScrollWrapper;
