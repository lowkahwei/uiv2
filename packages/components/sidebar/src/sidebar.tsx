import type {SidebarProviderProps} from "./use-sidebar";
import type {DrawerProps} from "@sytechui/drawer";
import type {ComponentPropsWithoutRef, ReactNode} from "react";

import {Drawer, DrawerContent} from "@sytechui/drawer";
import {forwardRef} from "@sytechui/system";
import {cn} from "@sytechui/theme";

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
  const insetSide =
    staticValue.variant === "inset" &&
    (stateValue.state === "expanded" || staticValue.collapsible !== "offcanvas")
      ? staticValue.side
      : undefined;

  return (
    <SidebarStaticContext.Provider value={staticValue}>
      <SidebarStateContext.Provider value={stateValue}>
        <div
          className={wrapperClassName}
          data-inset-side={insetSide}
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
  /** Props forwarded to the mobile Drawer (e.g. `backdrop`, `size`, `motionProps`, `classNames`). */
  drawerProps?: Omit<DrawerProps, "children" | "isOpen" | "onOpenChange">;
}

const Sidebar = forwardRef<"aside", SidebarProps>(
  ({drawerProps, className, children, ...props}, ref) => {
    const {
      classNames,
      collapsible,
      disableAnimation,
      mobileBreakpoint,
      setOpenMobile,
      side,
      slots,
      variant,
    } = useSidebarStatic();
    const {isMobile, state, openMobile} = useSidebarState();
    const isCustomBreakpoint = mobileBreakpoint !== DEFAULT_MOBILE_BREAKPOINT;
    const isCollapsed = state === "collapsed";
    const isOffcanvas = isCollapsed && collapsible === "offcanvas";
    const hasOuterSpacing = variant === "floating" || variant === "inset";
    const panelWidth =
      isCollapsed && collapsible === "icon" ? "var(--sidebar-width-icon)" : "var(--sidebar-width)";
    const layoutWidth = hasOuterSpacing ? `calc(${panelWidth} + 1rem)` : panelWidth;
    const offcanvasTransform = side === "left" ? "translateX(-100%)" : "translateX(100%)";
    const content = (
      <aside
        ref={ref}
        className={slots.inner({class: cn(classNames?.inner, className)})}
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
          className={slots.inner({
            class: cn(
              classNames?.inner,
              "h-svh w-[var(--sidebar-width)] shrink-0",
              hasOuterSpacing && "m-2 h-[calc(100svh-1rem)]",
              className,
            ),
          })}
          data-side={side}
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-variant={variant}
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
              className={slots.mobile({class: classNames?.mobile})}
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
          <style>{`@media (max-width:${mobileBreakpoint}px){[data-sidebar-bp="${mobileBreakpoint}"]{display:none}}`}</style>
        )}
        <div
          className={slots.sidebar({
            class: cn(isCustomBreakpoint ? undefined : "hidden md:block", classNames?.sidebar),
          })}
          data-collapsible={isCollapsed ? collapsible : undefined}
          data-side={side}
          data-sidebar-bp={isCustomBreakpoint ? mobileBreakpoint : undefined}
          data-slot="sidebar"
          data-state={state}
          data-variant={variant}
        >
          <div
            aria-hidden="true"
            className={slots.gap({class: classNames?.gap})}
            data-slot="sidebar-gap"
            style={{width: isOffcanvas ? 0 : layoutWidth}}
          />
          <div
            className={slots.container({class: classNames?.container})}
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
