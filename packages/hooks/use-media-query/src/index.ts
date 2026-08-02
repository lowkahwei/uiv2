import {useCallback, useSyncExternalStore} from "react";

/**
 * Custom hook that manages media queries.
 *
 * @param query The media query string to match.
 * @returns boolean indicating if the media query matches.
 */
export function useMediaQuery(query: string | number): boolean {
  const actualQuery = typeof query === "number" ? `(min-width: ${query}px)` : query;

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(actualQuery);

      mql.addEventListener("change", onStoreChange);

      return () => mql.removeEventListener("change", onStoreChange);
    },
    [actualQuery],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(actualQuery).matches,
    () => false,
  );
}

/**
 * Convenient hook to check if the screen is mobile.
 * 
 * @param width The maximum width for mobile view (default: 768px).
 * @returns boolean indicating if the screen is mobile.
 */
export const useIsMobile = (width: number = 768): boolean => {
  return useMediaQuery(`(max-width: ${width}px)`);
};

/**
 * Hook to determine the current view based on breakpoints.
 * 
 * @returns 'desktop' | 'tablet' | 'mobile'
 */
export const useView = () => {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1279px)");
  
  if (isDesktop) return "desktop";
  if (isTablet) return "tablet";

  return "mobile";
};
