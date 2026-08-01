import type {SidebarContextValue, SidebarProviderProps} from "./types";

import {useControlledState} from "@react-stately/utils";
import {useIsMobile} from "@sytechui/use-media-query";
import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";

export type {SidebarContextValue, SidebarProviderProps} from "./types";

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({
  children,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  mobileBreakpoint = 767,
  toggleShortcut = "mod+b",
}: SidebarProviderProps) {
  const [open, setOpenState] = useControlledState(openProp, defaultOpen, onOpenChange);
  const [openMobile, setOpenMobileState] = useState(false);
  const [layout, setLayout] = useState<Pick<SidebarContextValue, "side" | "collapsible">>({
    side: "left",
    collapsible: "icon",
  });
  const [isMounted, setIsMounted] = useState(false);
  const isMobileQuery = useIsMobile(mobileBreakpoint);
  const isMobile = isMounted && isMobileQuery;

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMobile) setOpenMobileState(false);
  }, [isMobile]);

  const setOpen = useCallback((nextOpen: boolean) => setOpenState(nextOpen), [setOpenState]);
  const setOpenMobile = useCallback((nextOpen: boolean) => setOpenMobileState(nextOpen), []);
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobileState((currentOpen) => !currentOpen);
    } else {
      setOpenState(!open);
    }
  }, [isMobile, open, setOpenState]);

  useEffect(() => {
    if (!toggleShortcut) return;

    const tokens = toggleShortcut
      .toLowerCase()
      .split("+")
      .map((token) => token.trim());
    const modifiers = tokens.slice(0, -1);
    const key = tokens.at(-1);
    const handleKeyDown = (event: KeyboardEvent) => {
      const modKey = event.metaKey || event.ctrlKey;

      if (
        event.key.toLowerCase() === key &&
        modifiers.includes("mod") === modKey &&
        modifiers.includes("shift") === event.shiftKey &&
        modifiers.includes("alt") === event.altKey
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleShortcut, toggleSidebar]);

  const value = useMemo<SidebarContextValue>(
    () => ({
      state: open ? "expanded" : "collapsed",
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      mobileBreakpoint,
      ...layout,
      _setLayout: setLayout,
    }),
    [open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, mobileBreakpoint, layout],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}
