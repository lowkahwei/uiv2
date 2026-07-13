import {useState, useCallback, useEffect} from "react";
import {useSafeLayoutEffect} from "@sytechui/use-safe-layout-effect";

/**
 * Custom hook that manages media queries.
 * 
 * @param query The media query string to match.
 * @returns boolean indicating if the media query matches.
 */
export function useMediaQuery(query: string | number): boolean {
  const actualQuery = typeof query === "number" ? `(min-width: ${query}px)` : query;

  const getMatches = (q: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(q).matches;
    }

    return false;
  };

  const [matches, setMatches] = useState<boolean>(() => getMatches(actualQuery));

  const handleChange = useCallback(() => {
    setMatches(getMatches(actualQuery));
  }, [actualQuery]);

  useSafeLayoutEffect(() => {
    const matchMedia = window.matchMedia(actualQuery);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen for match changes
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
  }, [query, handleChange]);

  return matches;
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
