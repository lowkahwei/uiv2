import type {
  SidebarActionsContextValue,
  SidebarContextValue,
  SidebarProviderProps,
  SidebarStateContextValue,
} from "./types";

import {RouterProvider} from "@react-aria/utils";
import {useControlledState} from "@react-stately/utils";
import {useIsMobile} from "@sytechui/use-media-query";
import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";

export type {
  SidebarActionsContextValue,
  SidebarContextValue,
  SidebarProviderProps,
  SidebarStateContextValue,
} from "./types";

const SidebarStateContext = createContext<SidebarStateContextValue | null>(null);
const SidebarActionsContext = createContext<SidebarActionsContextValue | null>(null);

export function SidebarProvider({
  children,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  mobileBreakpoint = 767,
  toggleShortcut = "mod+b",
  reduceMotion = false,
  navigate,
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

  useEffect(() => {
    if (openProp === undefined) {
      document.cookie = `sidebar_state=${open}; path=/; max-age=31536000`;
    }
  }, [open, openProp]);

  const setOpen = useCallback((nextOpen: boolean) => setOpenState(nextOpen), [setOpenState]);
  const setOpenMobile = useCallback((nextOpen: boolean) => setOpenMobileState(nextOpen), []);
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobileState((currentOpen) => !currentOpen);
    } else {
      setOpenState((currentOpen) => !currentOpen);
    }
  }, [isMobile, setOpenState]);

  useEffect(() => {
    if (!toggleShortcut) return;

    const tokens = toggleShortcut
      .toLowerCase()
      .split("+")
      .map((token) => token.trim());
    const modifiers = tokens.slice(0, -1);
    const key = tokens.at(-1);
    const supportedModifiers = new Set(["mod", "shift", "alt"]);
    const hasUnsupportedModifier = modifiers.some((modifier) => !supportedModifiers.has(modifier));

    if (hasUnsupportedModifier) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          `SidebarProvider: toggleShortcut "${toggleShortcut}" uses an unsupported modifier. Only "mod", "shift", and "alt" are supported.`,
        );
      }

      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditableTarget =
        target != null &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if (isEditableTarget) return;

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

  const stateValue = useMemo<SidebarStateContextValue>(
    () => ({
      state: open ? "expanded" : "collapsed",
      open,
      isMobile,
      openMobile,
      mobileBreakpoint,
      ...layout,
      reduceMotion,
    }),
    [open, isMobile, openMobile, mobileBreakpoint, layout, reduceMotion],
  );

  const actionsValue = useMemo<SidebarActionsContextValue>(
    () => ({
      setOpen,
      setOpenMobile,
      toggleSidebar,
      _setLayout: setLayout,
    }),
    [setOpen, setOpenMobile, toggleSidebar],
  );

  const providers = (
    <SidebarActionsContext.Provider value={actionsValue}>
      <SidebarStateContext.Provider value={stateValue}>{children}</SidebarStateContext.Provider>
    </SidebarActionsContext.Provider>
  );

  if (!navigate) return providers;

  return <RouterProvider navigate={(href) => navigate(String(href))}>{providers}</RouterProvider>;
}

/** Subscribes only to the sidebar's changing state (re-renders on toggle, viewport, etc). */
export function useSidebarState() {
  const context = useContext(SidebarStateContext);

  if (!context) {
    throw new Error("useSidebarState must be used within a SidebarProvider.");
  }

  return context;
}

/** Subscribes only to the sidebar's referentially-stable action callbacks. */
export function useSidebarActions() {
  const context = useContext(SidebarActionsContext);

  if (!context) {
    throw new Error("useSidebarActions must be used within a SidebarProvider.");
  }

  return context;
}

export function useSidebar(): SidebarContextValue {
  const state = useSidebarState();
  const actions = useSidebarActions();

  return useMemo(() => ({...state, ...actions}), [state, actions]);
}

export function SidebarExpandedScope({children}: Pick<SidebarProviderProps, "children">) {
  const state = useSidebarState();
  const expandedState = useMemo<SidebarStateContextValue>(
    () => ({...state, state: "expanded" as const}),
    [state],
  );

  return (
    <SidebarStateContext.Provider value={expandedState}>{children}</SidebarStateContext.Provider>
  );
}
