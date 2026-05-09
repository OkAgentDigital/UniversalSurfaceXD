import { useState, useEffect, useCallback } from 'react';
import { Breakpoint, getBreakpoint, isMobile, isTablet, isDesktop } from '../../shared/layoutConstants';

/**
 * Hook to track the current responsive breakpoint
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

/**
 * Hook to check if current viewport matches a media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Hook to check if current viewport is mobile (XS or SM)
 */
export function useIsMobile(): boolean {
  const breakpoint = useBreakpoint();
  return isMobile(breakpoint);
}

/**
 * Hook to check if current viewport is tablet (MD)
 */
export function useIsTablet(): boolean {
  const breakpoint = useBreakpoint();
  return isTablet(breakpoint);
}

/**
 * Hook to check if current viewport is desktop (LG or larger)
 */
export function useIsDesktop(): boolean {
  const breakpoint = useBreakpoint();
  return isDesktop(breakpoint);
}

/**
 * Hook to track sidebar state (responsive-aware)
 */
export function useSidebarState() {
  const breakpoint = useBreakpoint();
  const mobile = isMobile(breakpoint);
  const [isOpen, setIsOpen] = useState(!mobile);

  useEffect(() => {
    if (!mobile) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [mobile]);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, toggle, open, close, isMobile: mobile };
}

/**
 * Hook to track right panel state (responsive-aware)
 */
export function useRightPanelState() {
  const breakpoint = useBreakpoint();
  const isDesktopView = isDesktop(breakpoint);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, toggle, open, close, isVisible: isDesktopView && isOpen };
}

/**
 * Hook to track bottom panel state
 */
export function usePanelState() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, toggle, open, close };
}

/**
 * Hook to get current window dimensions
 */
export function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
