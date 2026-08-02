import type {SidebarReturnType, SidebarSlots, SlotsToClasses} from "@sytechui/theme";
import type {ComponentPropsWithoutRef, CSSProperties, Dispatch, SetStateAction} from "react";

import {useProviderContext} from "@sytechui/system";
import {cn, sidebar as sidebarTheme} from "@sytechui/theme";
import {useIsMobile} from "@sytechui/use-media-query";
import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";

/** Cookie persisted by uncontrolled SidebarProvider — read it server-side to set `defaultOpen`. */
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const DEFAULT_MOBILE_BREAKPOINT = 767;

const toWidth = (value: string | number) => (typeof value === "number" ? `${value}px` : value);

export type SidebarState = "expanded" | "collapsed";
export type SidebarSide = "left" | "right";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarCollapsible = "offcanvas" | "icon" | "none";

type SetOpen = Dispatch<SetStateAction<boolean>>;

interface SidebarStateContextValue {
  state: SidebarState;
  open: boolean;
  openMobile: boolean;
  isMobile: boolean;
}

interface SidebarStaticContextValue {
  setOpen: SetOpen;
  setOpenMobile: SetOpen;
  toggleSidebar: () => void;
  slots: SidebarReturnType;
  classNames?: SlotsToClasses<SidebarSlots>;
  disableAnimation: boolean;
  mobileBreakpoint: number;
  side: SidebarSide;
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
}

export interface SidebarContextValue extends SidebarStateContextValue, SidebarStaticContextValue {}

const SidebarStateContext = createContext<SidebarStateContextValue | null>(null);
const SidebarStaticContext = createContext<SidebarStaticContextValue | null>(null);

export function useSidebarState() {
  const context = useContext(SidebarStateContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

export function useSidebarStatic() {
  const context = useContext(SidebarStaticContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

export function useSidebar(): SidebarContextValue {
  const state = useSidebarState();
  const staticValue = useSidebarStatic();

  return useMemo(() => ({...state, ...staticValue}), [state, staticValue]);
}

type SidebarVariables = CSSProperties & {
  "--sidebar-width"?: string;
  "--sidebar-width-icon"?: string;
  "--sidebar-width-mobile"?: string;
};

export interface SidebarProviderProps extends ComponentPropsWithoutRef<"div"> {
  /** Initial desktop sidebar state when uncontrolled. @default true */
  defaultOpen?: boolean;
  /** Controlled desktop sidebar state. */
  open?: boolean;
  /** Called whenever the desktop sidebar state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Max viewport width (px) at which the sidebar switches to mobile (Drawer) mode. @default 767 */
  mobileBreakpoint?: number;
  /** Slot classNames applied to every rendered sidebar element. */
  classNames?: SlotsToClasses<SidebarSlots>;
  /** Disables Sidebar-owned transitions. @default false */
  disableAnimation?: boolean;
  /** Which edge the sidebar docks to. @default "left" */
  side?: SidebarSide;
  /** Visual layout style shared by the sidebar and content area. @default "sidebar" */
  variant?: SidebarVariant;
  /** How the sidebar collapses on desktop. @default "offcanvas" */
  collapsible?: SidebarCollapsible;
  /** Width of the expanded desktop sidebar, applied to the `--sidebar-width` CSS variable. @default "16rem" */
  width?: string | number;
  /** Width of the icon-collapsed desktop sidebar, applied to `--sidebar-width-icon`. @default "3rem" */
  collapsedWidth?: string | number;
  /** Keyboard shortcut that toggles the sidebar, using `mod`/`shift`/`alt` tokens. Pass `false` or `null` to disable it. @default "mod+b" */
  toggleShortcut?: string | false | null;
  /**
   * Viewport width (px) at or below which the sidebar auto-collapses (must be above
   * `mobileBreakpoint`). Crossing the breakpoint toggles it; initial render and controlled
   * state (`open` prop set) are unaffected. @default undefined (disabled)
   */
  collapseBreakpoint?: number;
}

export function useSidebarProvider(props: Omit<SidebarProviderProps, "children">) {
  const {
    defaultOpen = true,
    open: openProp,
    onOpenChange,
    mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT,
    classNames,
    disableAnimation: disableAnimationProp,
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    width = SIDEBAR_WIDTH,
    collapsedWidth = SIDEBAR_WIDTH_ICON,
    toggleShortcut = "mod+b",
    collapseBreakpoint,
    className,
    style,
    ...otherProps
  } = props;

  const globalContext = useProviderContext();
  const isMobile = useIsMobile(mobileBreakpoint);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const disableAnimation = disableAnimationProp ?? globalContext?.disableAnimation ?? false;
  const slots = useMemo(
    () => sidebarTheme({disableAnimation, side, variant}),
    [disableAnimation, side, variant],
  );

  // 有意不用 @react-stately/utils 的 useControlledState:它的 setter 依赖 currentValue,
  // 每次开合都变引用,会连锁把 staticValue(以及订阅它的全部静态子组件)的稳定性击穿。
  // 这里用 ref 手写受控/非受控,换取 setOpen/toggleSidebar 真正的引用稳定。
  const openRef = useRef(open);
  const openPropRef = useRef(openProp);
  const onOpenChangeRef = useRef(onOpenChange);
  const isMobileRef = useRef(isMobile);
  const collapsibleRef = useRef(collapsible);

  openRef.current = open;
  openPropRef.current = openProp;
  onOpenChangeRef.current = onOpenChange;
  isMobileRef.current = isMobile;
  collapsibleRef.current = collapsible;

  useEffect(() => {
    if (!isMobile) setOpenMobile(false);
  }, [isMobile]);

  useEffect(() => {
    if (openPropRef.current === undefined) {
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    }
  }, [open]);

  const setOpen = useCallback<SetOpen>((value) => {
    const nextOpen = typeof value === "function" ? value(openRef.current) : value;

    onOpenChangeRef.current?.(nextOpen);
    if (openPropRef.current === undefined) {
      setUncontrolledOpen(nextOpen);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    if (collapsibleRef.current === "none") return;

    if (isMobileRef.current) {
      setOpenMobile((currentOpen) => !currentOpen);
    } else {
      setOpen((currentOpen) => !currentOpen);
    }
  }, [setOpen]);

  useEffect(() => {
    if (!toggleShortcut || collapsible === "none") return;

    const tokens = toggleShortcut
      .toLowerCase()
      .split("+")
      .map((token) => token.trim());
    const modifiers = tokens.slice(0, -1);
    const key = tokens.at(-1);
    const supportedModifiers = new Set(["mod", "shift", "alt"]);
    // event.key shifts under macOS Option (e.g. Option+B → "∫"); match letters/digits by event.code instead.
    const expectedCode = /^[a-z]$/.test(key ?? "")
      ? `Key${key!.toUpperCase()}`
      : /^[0-9]$/.test(key ?? "")
        ? `Digit${key}`
        : null;

    if (modifiers.some((modifier) => !supportedModifiers.has(modifier))) {
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

      if (
        (expectedCode ? event.code === expectedCode : event.key.toLowerCase() === key) &&
        modifiers.includes("mod") === (event.metaKey || event.ctrlKey) &&
        modifiers.includes("shift") === event.shiftKey &&
        modifiers.includes("alt") === event.altKey
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [collapsible, toggleShortcut, toggleSidebar]);

  const isCollapseRange = useIsMobile(collapseBreakpoint ?? 0);
  const prevCollapseRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (collapseBreakpoint == null || collapsible === "none" || openPropRef.current !== undefined) {
      return;
    }
    const prev = prevCollapseRef.current;

    prevCollapseRef.current = isCollapseRange;
    if (prev !== null && prev !== isCollapseRange) setOpen(!isCollapseRange);
  }, [isCollapseRange, collapseBreakpoint, collapsible, setOpen]);

  const stateValue = useMemo<SidebarStateContextValue>(
    () => ({state: open ? "expanded" : "collapsed", open, openMobile, isMobile}),
    [open, openMobile, isMobile],
  );

  const staticValue = useMemo<SidebarStaticContextValue>(
    () => ({
      setOpen,
      setOpenMobile,
      toggleSidebar,
      slots,
      classNames,
      disableAnimation,
      mobileBreakpoint,
      side,
      variant,
      collapsible,
    }),
    [
      setOpen,
      setOpenMobile,
      toggleSidebar,
      slots,
      classNames,
      disableAnimation,
      mobileBreakpoint,
      side,
      variant,
      collapsible,
    ],
  );

  return {
    stateValue,
    staticValue,
    wrapperClassName: slots.base({class: cn(classNames?.base, className)}),
    wrapperStyle: {
      "--sidebar-width": toWidth(width),
      "--sidebar-width-icon": toWidth(collapsedWidth),
      ...style,
    } as SidebarVariables,
    otherProps,
  };
}

export {SidebarStateContext, SidebarStaticContext, DEFAULT_MOBILE_BREAKPOINT, SIDEBAR_COOKIE_NAME};
