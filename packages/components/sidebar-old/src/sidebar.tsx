import type {CSSProperties} from "react";
import type {SidebarProps} from "./types";

import {Drawer, DrawerContent} from "@sytechui/drawer";
import {forwardRef} from "@sytechui/system";
import {cn} from "@sytechui/theme";
import {useEffect, useId} from "react";

import {useSidebar} from "./sidebar-context";

const DEFAULT_MOBILE_BREAKPOINT = 767;

type SidebarStyle = CSSProperties & {
  "--sidebar-duration"?: string | number;
  "--sidebar-ease"?: string;
};

const toCssSize = (value: string | number) => (typeof value === "number" ? `${value}px` : value);

const Sidebar = forwardRef<"aside", SidebarProps>(
  (
    {
      children,
      width = "270px",
      collapsedWidth = "60px",
      side = "left",
      collapsible = "icon",
      variant = "default",
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

    const isFloating = variant === "floating";
    const isCollapsed = state === "collapsed";
    const isOffcanvasCollapsed = isCollapsed && collapsible === "offcanvas" && !isMobile;
    const effectiveCollapsedWidth = collapsible === "offcanvas" ? "0px" : collapsedWidth;
    const sidebarWidth = isCollapsed ? effectiveCollapsedWidth : width;
    const containerWidth = collapsible === "offcanvas" ? width : sidebarWidth;
    const offcanvasTransform = isOffcanvasCollapsed
      ? `translateX(${side === "right" ? "100%" : "-100%"})`
      : "translateX(0)";
    // Output only, for descendants to read; does not drive layout. Use `width`/`collapsedWidth` to resize.
    const sidebarStyle = {
      "--sidebar-width": toCssSize(width),
      "--sidebar-width-icon": toCssSize(collapsedWidth),
      ...style,
    } as SidebarStyle;
    const transitionStyle = {
      "--sidebar-duration": sidebarStyle["--sidebar-duration"],
      "--sidebar-ease": sidebarStyle["--sidebar-ease"],
    } as CSSProperties;
    const content = (
      <aside
        ref={ref}
        className={cn(
          "group/sidebar flex h-full min-h-0 select-none flex-col overflow-hidden text-foreground",
          variant === "floating" && "rounded-xl border border-divider bg-content1 shadow-md",
          variant === "inset" && "border-transparent bg-transparent",
          variant === "default" &&
            (side === "right"
              ? "border-l border-divider bg-content1"
              : "border-r border-divider bg-content1"),
          className,
        )}
        data-mobile={isMobile ? "true" : undefined}
        data-reduce-motion={reduceMotion ? "true" : undefined}
        data-side={side}
        data-slot="base"
        data-state={isMobile ? "expanded" : state}
        data-variant={variant}
        style={sidebarStyle}
        {...props}
      >
        {children}
      </aside>
    );

    if (collapsible === "none") {
      return (
        <div
          className={cn("h-full shrink-0", isFloating && "m-2")}
          data-slot="container"
          style={{width: toCssSize(width)}}
        >
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
              "transition-[width] duration-[var(--sidebar-duration,200ms)] ease-[var(--sidebar-ease,linear)] motion-reduce:transition-none",
            desktopVisibilityClassName,
          )}
          data-sidebar-bp={customBreakpoint ? breakpointId : undefined}
          data-slot="gap"
          style={{...transitionStyle, width: sidebarWidth, minWidth: sidebarWidth}}
        />
        <div
          className={cn(
            "fixed z-50 h-svh",
            isFloating ? "top-2 bottom-2" : "inset-y-0 overflow-hidden",
            !reduceMotion &&
              "transition-[width,transform] duration-[var(--sidebar-duration,200ms)] ease-[var(--sidebar-ease,linear)] motion-reduce:transition-none",
            side === "right"
              ? isFloating
                ? "right-2"
                : "right-0"
              : isFloating
                ? "left-2"
                : "left-0",
            desktopVisibilityClassName,
          )}
          data-sidebar-bp={customBreakpoint ? breakpointId : undefined}
          data-slot="container"
          style={{
            ...transitionStyle,
            width: isFloating
              ? `calc(${toCssSize(containerWidth)} - 0.5rem)`
              : toCssSize(containerWidth),
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
