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
}: SidebarProviderProps) {
  const [open, setOpenState] = useControlledState(openProp, defaultOpen, onOpenChange);
  const [openMobile, setOpenMobileState] = useState(false);
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

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
    }),
    [open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, mobileBreakpoint],
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
