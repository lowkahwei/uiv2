import type {CSSProperties} from "react";
import type {SidebarProps} from "./types";

import {Drawer, DrawerContent} from "@sytechui/drawer";
import {forwardRef} from "@sytechui/system";
import {cn} from "@sytechui/theme";
import {useEffect, useId} from "react";

import {useSidebar} from "./sidebar-context";

const DEFAULT_MOBILE_BREAKPOINT = 767;

const toCssSize = (value: string | number) => (typeof value === "number" ? `${value}px` : value);

const Sidebar = forwardRef<"aside", SidebarProps>(
  (
    {
      children,
      width = "270px",
      collapsedWidth = "60px",
      side = "left",
      collapsible = "icon",
      className,
      style,
      drawerProps,
      ...props
    },
    ref,
  ) => {
    const {state, isMobile, openMobile, setOpenMobile, mobileBreakpoint, reduceMotion, _setLayout} =
      useSidebar();
    const breakpointId = useId();

    useEffect(() => _setLayout({side, collapsible}), [_setLayout, side, collapsible]);

    const isCollapsed = state === "collapsed";
    const isOffcanvasCollapsed = isCollapsed && collapsible === "offcanvas" && !isMobile;
    const effectiveCollapsedWidth = collapsible === "offcanvas" ? "0px" : collapsedWidth;
    const sidebarWidth = isCollapsed ? effectiveCollapsedWidth : width;
    const containerWidth = collapsible === "offcanvas" ? width : sidebarWidth;
    const offcanvasTransform = isOffcanvasCollapsed
      ? `translateX(${side === "right" ? "100%" : "-100%"})`
      : "translateX(0)";
    const sidebarStyle = {
      "--sidebar-width": toCssSize(width),
      "--sidebar-width-icon": toCssSize(collapsedWidth),
      ...style,
    } as CSSProperties;
    const content = (
      <aside
        ref={ref}
        className={cn(
          "group/sidebar flex h-full min-h-0 select-none flex-col bg-content1 text-foreground",
          side === "right" ? "border-l border-divider" : "border-r border-divider",
          className,
        )}
        data-mobile={isMobile ? "true" : undefined}
        data-reduce-motion={reduceMotion ? "true" : undefined}
        data-side={side}
        data-slot="base"
        data-state={isMobile ? "expanded" : state}
        style={sidebarStyle}
        {...props}
      >
        {children}
      </aside>
    );

    if (collapsible === "none") {
      return (
        <div className="h-full shrink-0" data-slot="container" style={{width: toCssSize(width)}}>
          {content}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Drawer
          backdrop="blur"
          placement={side}
          size="sm"
          {...drawerProps}
          isOpen={openMobile}
          onOpenChange={setOpenMobile}
        >
          <DrawerContent>{content}</DrawerContent>
        </Drawer>
      );
    }

    const desktopVisibilityClassName =
      mobileBreakpoint === DEFAULT_MOBILE_BREAKPOINT ? "hidden md:block" : undefined;
    const customBreakpoint = mobileBreakpoint !== DEFAULT_MOBILE_BREAKPOINT;

    return (
      <>
        {customBreakpoint && (
          <style>{`@media (max-width:${mobileBreakpoint}px){[data-sidebar-bp="${breakpointId}"]{display:none}}`}</style>
        )}
        <div
          aria-hidden="true"
          className={cn(
            "h-svh shrink-0",
            !reduceMotion &&
              "transition-[width] duration-[var(--sidebar-duration,150ms)] ease-[var(--sidebar-ease,ease-in-out)] motion-reduce:transition-none",
            desktopVisibilityClassName,
          )}
          data-sidebar-bp={customBreakpoint ? breakpointId : undefined}
          data-slot="gap"
          style={{width: sidebarWidth, minWidth: sidebarWidth}}
        />
        <div
          className={cn(
            "fixed inset-y-0 z-50 h-svh overflow-hidden",
            !reduceMotion &&
              "transition-[width,transform] duration-[var(--sidebar-duration,150ms)] ease-[var(--sidebar-ease,ease-in-out)] motion-reduce:transition-none",
            side === "right" ? "right-0" : "left-0",
            desktopVisibilityClassName,
          )}
          data-sidebar-bp={customBreakpoint ? breakpointId : undefined}
          data-slot="container"
          style={{
            width: toCssSize(containerWidth),
            transform: collapsible === "offcanvas" ? offcanvasTransform : undefined,
          }}
        >
          {content}
        </div>
      </>
    );
  },
);

Sidebar.displayName = "HeroUI.Sidebar";

export default Sidebar;
