import { type ReactNode, useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

const ScrollWrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};

export default ScrollWrapper;
