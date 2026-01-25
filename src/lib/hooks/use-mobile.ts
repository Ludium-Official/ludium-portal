import { useEffect, useState } from 'react';

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

interface BreakpointState {
  isMobile: boolean; // < md (768)
  isTablet: boolean; // >= md && < lg
  isDesktop: boolean; // >= lg
  width: number;
  // Below breakpoint checks
  isBelowSm: boolean;
  isBelowMd: boolean;
  isBelowLg: boolean;
  isBelowXl: boolean;
  isBelow2xl: boolean;
  // Above breakpoint checks
  isAboveSm: boolean;
  isAboveMd: boolean;
  isAboveLg: boolean;
  isAboveXl: boolean;
  isAbove2xl: boolean;
}

export const useBreakpoint = (): BreakpointState => {
  const [state, setState] = useState<BreakpointState>(() => getBreakpointState(0));

  useEffect(() => {
    const checkBreakpoint = () => {
      setState(getBreakpointState(window.innerWidth));
    };

    checkBreakpoint();

    window.addEventListener('resize', checkBreakpoint);

    return () => {
      window.removeEventListener('resize', checkBreakpoint);
    };
  }, []);

  return state;
};

function getBreakpointState(width: number): BreakpointState {
  return {
    width,
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    isBelowSm: width < BREAKPOINTS.sm,
    isBelowMd: width < BREAKPOINTS.md,
    isBelowLg: width < BREAKPOINTS.lg,
    isBelowXl: width < BREAKPOINTS.xl,
    isBelow2xl: width < BREAKPOINTS['2xl'],
    isAboveSm: width >= BREAKPOINTS.sm,
    isAboveMd: width >= BREAKPOINTS.md,
    isAboveLg: width >= BREAKPOINTS.lg,
    isAboveXl: width >= BREAKPOINTS.xl,
    isAbove2xl: width >= BREAKPOINTS['2xl'],
  };
}

export const useIsMobile = () => {
  const { isMobile } = useBreakpoint();
  return isMobile;
};
