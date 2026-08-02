import type {
  SidebarCollapsible,
  SidebarProviderProps,
  SidebarSide,
  SidebarVariant,
} from "./use-sidebar";
import type {DrawerProps} from "@sytechui/drawer";
import type {ComponentPropsWithoutRef, ReactNode} from "react";

import {Drawer, DrawerContent} from "@sytechui/drawer";
import {forwardRef} from "@sytechui/system";
import {cn, sidebar as sidebarTheme} from "@sytechui/theme";
import {useId, useMemo} from "react";

import {
  DEFAULT_MOBILE_BREAKPOINT,
  SidebarStateContext,
  SidebarStaticContext,
  useSidebarProvider,
  useSidebarState,
  useSidebarStatic,
} from "./use-sidebar";

export type {SidebarProviderProps} from "./use-sidebar";

export function SidebarProvider({children, ...props}: SidebarProviderProps) {
  const {stateValue, staticValue, wrapperClassName, wrapperStyle, otherProps} =
    useSidebarProvider(props);

  return (
    <SidebarStaticContext.Provider value={staticValue}>
      <SidebarStateContext.Provider value={stateValue}>
        <div
          className={wrapperClassName}
          data-slot="sidebar-wrapper"
          style={wrapperStyle}
          {...otherProps}
        >
          {children}
        </div>
      </SidebarStateContext.Provider>
    </SidebarStaticContext.Provider>
  );
}

export interface SidebarProps extends Omit<ComponentPropsWithoutRef<"aside">, "children"> {
  children?: ReactNode;
  /** Which edge the desktop sidebar docks to (and the mobile Drawer placement). @default "left" */
  side?: SidebarSide;
  /** Visual style of the sidebar panel. @default "sidebar" */
  variant?: SidebarVariant;
  /** How the sidebar collapses on desktop. @default "offcanvas" */
  collapsible?: SidebarCollapsible;
  /** Props forwarded to the mobile Drawer (e.g. `backdrop`, `size`, `motionProps`, `classNames`). */
  drawerProps?: Omit<DrawerProps, "children" | "isOpen" | "onOpenChange">;
}

const Sidebar = forwardRef<"aside", SidebarProps>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      drawerProps,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const {classNames, disableAnimation, mobileBreakpoint, setOpenMobile} = useSidebarStatic();
    const {isMobile, state, openMobile} = useSidebarState();
    const breakpointId = useId();
    const isCustomBreakpoint = mobileBreakpoint !== DEFAULT_MOBILE_BREAKPOINT;
    const themedSlots = useMemo(
      () => sidebarTheme({disableAnimation, side, variant}),
      [disableAnimation, side, variant],
    );
    const isCollapsed = state === "collapsed";
    const isOffcanvas = isCollapsed && collapsible === "offcanvas";
    const isInset = variant === "floating" || variant === "inset";
    const panelWidth =
      isCollapsed && collapsible === "icon" ? "var(--sidebar-width-icon)" : "var(--sidebar-width)";
    const layoutWidth = isInset ? `calc(${panelWidth} + 1rem)` : panelWidth;
    const offcanvasTransform = side === "left" ? "translateX(-100%)" : "translateX(100%)";
    const content = (
      <aside
        ref={ref}
        className={themedSlots.inner({class: cn(classNames?.inner, className)})}
        data-sidebar="sidebar"
        data-slot="sidebar-inner"
        {...props}
      >
        {children}
      </aside>
    );

    if (collapsible === "none") {
      return (
        <aside
          ref={ref}
          className={themedSlots.inner({
            class: cn(classNames?.inner, "h-svh w-[var(--sidebar-width)] shrink-0", className),
          })}
          data-sidebar="sidebar"
          data-slot="sidebar"
          {...props}
        >
          {children}
        </aside>
      );
    }

    if (isMobile) {
      return (
        <Drawer
          hideCloseButton
          disableAnimation={disableAnimation}
          placement={side}
          size="sm"
          {...drawerProps}
          classNames={{
            ...drawerProps?.classNames,
            base: cn(
              "w-[var(--sidebar-width-mobile,18rem)] max-w-[85vw]",
              drawerProps?.classNames?.base,
            ),
          }}
          isOpen={openMobile}
          onOpenChange={setOpenMobile}
        >
          <DrawerContent>
            <div
              className={themedSlots.mobile({class: classNames?.mobile})}
              data-mobile="true"
              data-slot="sidebar"
            >
              {content}
            </div>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <>
        {isCustomBreakpoint && (
          <style>{`@media (max-width:${mobileBreakpoint}px){[data-sidebar-bp="${breakpointId}"]{display:none}}`}</style>
        )}
        <div
          className={themedSlots.sidebar({
            class: cn(isCustomBreakpoint ? undefined : "hidden md:block", classNames?.sidebar),
          })}
          data-collapsible={isCollapsed ? collapsible : undefined}
          data-side={side}
          data-sidebar-bp={isCustomBreakpoint ? breakpointId : undefined}
          data-slot="sidebar"
          data-state={state}
          data-variant={variant}
        >
          <div
            aria-hidden="true"
            className={themedSlots.gap({class: classNames?.gap})}
            data-slot="sidebar-gap"
            style={{width: isOffcanvas ? 0 : layoutWidth}}
          />
          <div
            className={themedSlots.container({class: classNames?.container})}
            data-side={side}
            data-slot="sidebar-container"
            style={{
              width: layoutWidth,
              transform: isOffcanvas ? offcanvasTransform : "translateX(0)",
            }}
          >
            {content}
          </div>
        </div>
      </>
    );
  },
);

Sidebar.displayName = "SytechUI.Sidebar";

export {Sidebar};
