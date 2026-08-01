import type {ButtonProps} from "@sytechui/button";
import type {InputProps} from "@sytechui/input";
import type {LinkProps} from "@sytechui/link";
import type {SidebarReturnType, SidebarSlots, SlotsToClasses} from "@sytechui/theme";
import type {TooltipProps} from "@sytechui/tooltip";
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";

import {Button} from "@sytechui/button";
import {Divider} from "@sytechui/divider";
import {Drawer, DrawerContent} from "@sytechui/drawer";
import {Input} from "@sytechui/input";
import {Link} from "@sytechui/link";
import {forwardRef, useProviderContext} from "@sytechui/system";
import {cn, sidebar as sidebarTheme} from "@sytechui/theme";
import {Tooltip} from "@sytechui/tooltip";
import {useIsMobile} from "@sytechui/use-media-query";
import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export type SidebarState = "expanded" | "collapsed";
export type SidebarSide = "left" | "right";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarCollapsible = "offcanvas" | "icon" | "none";

type SetOpen = Dispatch<SetStateAction<boolean>>;

export interface SidebarContextValue {
  state: SidebarState;
  open: boolean;
  setOpen: SetOpen;
  openMobile: boolean;
  setOpenMobile: SetOpen;
  isMobile: boolean;
  toggleSidebar: () => void;
  slots: SidebarReturnType;
  classNames?: SlotsToClasses<SidebarSlots>;
  disableAnimation: boolean;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

type SidebarVariables = CSSProperties & {
  "--sidebar-width"?: string;
  "--sidebar-width-mobile"?: string;
  "--sidebar-width-icon"?: string;
};

export interface SidebarProviderProps extends ComponentPropsWithoutRef<"div"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mobileBreakpoint?: number;
  classNames?: SlotsToClasses<SidebarSlots>;
  disableAnimation?: boolean;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  mobileBreakpoint = 767,
  classNames,
  disableAnimation: disableAnimationProp,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const globalContext = useProviderContext();
  const isMobile = useIsMobile(mobileBreakpoint);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const disableAnimation = disableAnimationProp ?? globalContext?.disableAnimation ?? false;
  const slots = useMemo(() => sidebarTheme({disableAnimation}), [disableAnimation]);

  const setOpen = useCallback<SetOpen>(
    (value) => {
      const nextOpen = typeof value === "function" ? value(open) : value;

      if (onOpenChange) {
        onOpenChange(nextOpen);
      } else {
        setUncontrolledOpen(nextOpen);
      }

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${nextOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [onOpenChange, open],
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((currentOpen) => !currentOpen);
    } else {
      setOpen((currentOpen) => !currentOpen);
    }
  }, [isMobile, setOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const contextValue = useMemo<SidebarContextValue>(
    () => ({
      state: open ? "expanded" : "collapsed",
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
      slots,
      classNames,
      disableAnimation,
    }),
    [classNames, disableAnimation, isMobile, open, openMobile, setOpen, slots, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={slots.base({class: cn(classNames?.base, className)})}
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as SidebarVariables
        }
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export interface SidebarProps extends Omit<ComponentPropsWithoutRef<"aside">, "children"> {
  children?: ReactNode;
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
}

const Sidebar = forwardRef<"aside", SidebarProps>(
  (
    {side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props},
    ref,
  ) => {
    const {classNames, disableAnimation, isMobile, state, openMobile, setOpenMobile} = useSidebar();
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
          isOpen={openMobile}
          placement={side}
          size="sm"
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
      <div
        className={themedSlots.sidebar({class: classNames?.sidebar})}
        data-collapsible={isCollapsed ? collapsible : undefined}
        data-side={side}
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
    );
  },
);

Sidebar.displayName = "SytechUI.Sidebar";

const PanelLeftIcon = () => (
  <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
    <rect height="16" rx="2" stroke="currentColor" strokeWidth="1.8" width="18" x="3" y="4" />
    <path d="M9 4v16" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export interface SidebarTriggerProps extends Omit<ButtonProps, "isIconOnly" | "onPress"> {
  onPress?: ButtonProps["onPress"];
}

const SidebarTrigger = ({className, onPress, children, ...props}: SidebarTriggerProps) => {
  const {classNames, disableAnimation, slots, toggleSidebar} = useSidebar();

  return (
    <Button
      isIconOnly
      aria-label="Toggle sidebar"
      className={slots.trigger({class: cn(classNames?.trigger, className)})}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      disableAnimation={disableAnimation}
      size="sm"
      variant="light"
      onPress={(event) => {
        onPress?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {children ?? <PanelLeftIcon />}
    </Button>
  );
};

const SidebarRail = ({className, ...props}: ComponentPropsWithoutRef<"button">) => {
  const {classNames, isMobile, slots, toggleSidebar} = useSidebar();

  if (isMobile) return null;

  return (
    <button
      aria-label="Toggle sidebar"
      className={slots.rail({class: cn(classNames?.rail, className)})}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      tabIndex={-1}
      title="Toggle sidebar"
      type="button"
      onClick={toggleSidebar}
      {...props}
    />
  );
};

const SidebarInset = ({className, ...props}: ComponentPropsWithoutRef<"main">) => {
  const {classNames, slots} = useSidebar();

  return (
    <main
      className={slots.inset({class: cn(classNames?.inset, className)})}
      data-slot="sidebar-inset"
      {...props}
    />
  );
};

const SidebarInput = ({className, ...props}: InputProps) => {
  const {classNames, disableAnimation, slots} = useSidebar();

  return (
    <Input
      className={slots.input({class: cn(classNames?.input, className)})}
      data-sidebar="input"
      data-slot="sidebar-input"
      disableAnimation={disableAnimation}
      size="sm"
      {...props}
    />
  );
};

const SidebarHeader = ({className, ...props}: ComponentPropsWithoutRef<"div">) => {
  const {classNames, slots} = useSidebar();

  return (
    <div
      className={slots.header({class: cn(classNames?.header, className)})}
      data-sidebar="header"
      data-slot="sidebar-header"
      {...props}
    />
  );
};

const SidebarFooter = ({className, ...props}: ComponentPropsWithoutRef<"div">) => {
  const {classNames, slots} = useSidebar();

  return (
    <div
      className={slots.footer({class: cn(classNames?.footer, className)})}
      data-sidebar="footer"
      data-slot="sidebar-footer"
      {...props}
    />
  );
};

const SidebarSeparator = ({className, ...props}: ComponentPropsWithoutRef<typeof Divider>) => {
  const {classNames, slots} = useSidebar();

  return (
    <Divider
      className={slots.separator({class: cn(classNames?.separator, className)})}
      data-sidebar="separator"
      data-slot="sidebar-separator"
      {...props}
    />
  );
};

const SidebarContent = ({className, ...props}: ComponentPropsWithoutRef<"div">) => {
  const {classNames, slots} = useSidebar();

  return (
    <div
      className={slots.content({class: cn(classNames?.content, className)})}
      data-sidebar="content"
      data-slot="sidebar-content"
      {...props}
    />
  );
};

const SidebarGroup = ({className, ...props}: ComponentPropsWithoutRef<"section">) => {
  const {classNames, slots} = useSidebar();

  return (
    <section
      className={slots.group({class: cn(classNames?.group, className)})}
      data-sidebar="group"
      data-slot="sidebar-group"
      {...props}
    />
  );
};

const SidebarGroupLabel = ({className, ...props}: ComponentPropsWithoutRef<"div">) => {
  const {classNames, slots} = useSidebar();

  return (
    <div
      className={slots.groupLabel({class: cn(classNames?.groupLabel, className)})}
      data-sidebar="group-label"
      data-slot="sidebar-group-label"
      {...props}
    />
  );
};

export interface SidebarGroupActionProps extends Omit<ButtonProps, "isIconOnly"> {}

const SidebarGroupAction = ({className, ...props}: SidebarGroupActionProps) => {
  const {classNames, disableAnimation, slots} = useSidebar();

  return (
    <Button
      isIconOnly
      className={slots.groupAction({class: cn(classNames?.groupAction, className)})}
      data-sidebar="group-action"
      data-slot="sidebar-group-action"
      disableAnimation={disableAnimation}
      size="sm"
      variant="light"
      {...props}
    />
  );
};

const SidebarGroupContent = ({className, ...props}: ComponentPropsWithoutRef<"div">) => {
  const {classNames, slots} = useSidebar();

  return (
    <div
      className={slots.groupContent({class: cn(classNames?.groupContent, className)})}
      data-sidebar="group-content"
      data-slot="sidebar-group-content"
      {...props}
    />
  );
};

const SidebarMenu = ({className, ...props}: ComponentPropsWithoutRef<"ul">) => {
  const {classNames, slots} = useSidebar();

  return (
    <ul
      className={slots.menu({class: cn(classNames?.menu, className)})}
      data-sidebar="menu"
      data-slot="sidebar-menu"
      {...props}
    />
  );
};

const SidebarMenuItem = ({className, ...props}: ComponentPropsWithoutRef<"li">) => {
  const {classNames, slots} = useSidebar();

  return (
    <li
      className={slots.menuItem({class: cn(classNames?.menuItem, className)})}
      data-sidebar="menu-item"
      data-slot="sidebar-menu-item"
      {...props}
    />
  );
};

export interface SidebarMenuButtonProps extends Omit<
  LinkProps,
  | "anchorIcon"
  | "as"
  | "color"
  | "href"
  | "isBlock"
  | "ref"
  | "showAnchorIcon"
  | "size"
  | "underline"
> {
  href?: LinkProps["href"];
  isActive?: boolean;
  tooltip?: ReactNode | false;
  tooltipProps?: Omit<TooltipProps, "children" | "content" | "isDisabled">;
  variant?: "default" | "outline";
  size?: "sm" | "default" | "lg";
}

const SidebarMenuButton = ({
  href,
  isActive = false,
  tooltip,
  tooltipProps,
  variant = "default",
  size = "default",
  disableAnimation: disableAnimationProp,
  className,
  children,
  ...props
}: SidebarMenuButtonProps) => {
  const {
    classNames,
    disableAnimation: sidebarDisableAnimation,
    isMobile,
    slots,
    state,
  } = useSidebar();
  const disableAnimation = disableAnimationProp ?? sidebarDisableAnimation;
  const classes = slots.menuButton({class: cn(classNames?.menuButton, className)});
  const control = href ? (
    <Link
      {...props}
      aria-current={isActive ? "page" : undefined}
      className={classes}
      color="foreground"
      data-active={isActive || undefined}
      data-sidebar="menu-button"
      data-size={size}
      data-slot="sidebar-menu-button"
      data-variant={variant}
      disableAnimation={disableAnimation}
      href={href}
      underline="none"
    >
      {children}
    </Link>
  ) : (
    <Button
      disableRipple
      fullWidth
      {...(props as ButtonProps)}
      className={classes}
      data-active={isActive || undefined}
      data-sidebar="menu-button"
      data-size={size}
      data-slot="sidebar-menu-button"
      data-variant={variant}
      disableAnimation={disableAnimation}
      radius="sm"
      variant="light"
    >
      {children}
    </Button>
  );

  return (
    <Tooltip
      closeDelay={0}
      placement="right"
      {...tooltipProps}
      content={tooltip === false ? undefined : tooltip}
      disableAnimation={tooltipProps?.disableAnimation ?? disableAnimation}
      isDisabled={tooltip === false || tooltip == null || state !== "collapsed" || isMobile}
    >
      {control}
    </Tooltip>
  );
};

export interface SidebarMenuActionProps extends Omit<ButtonProps, "isIconOnly"> {
  showOnHover?: boolean;
}

const SidebarMenuAction = ({showOnHover = false, className, ...props}: SidebarMenuActionProps) => {
  const {classNames, disableAnimation, slots} = useSidebar();

  return (
    <Button
      isIconOnly
      className={slots.menuAction({class: cn(classNames?.menuAction, className)})}
      data-show-on-hover={showOnHover || undefined}
      data-sidebar="menu-action"
      data-slot="sidebar-menu-action"
      disableAnimation={disableAnimation}
      size="sm"
      variant="light"
      {...props}
    />
  );
};

const SidebarMenuBadge = ({className, ...props}: ComponentPropsWithoutRef<"div">) => {
  const {classNames, slots} = useSidebar();

  return (
    <div
      className={slots.menuBadge({class: cn(classNames?.menuBadge, className)})}
      data-sidebar="menu-badge"
      data-slot="sidebar-menu-badge"
      {...props}
    />
  );
};

const SidebarMenuSub = ({className, ...props}: ComponentPropsWithoutRef<"ul">) => {
  const {classNames, slots} = useSidebar();

  return (
    <ul
      className={slots.menuSub({class: cn(classNames?.menuSub, className)})}
      data-sidebar="menu-sub"
      data-slot="sidebar-menu-sub"
      {...props}
    />
  );
};

const SidebarMenuSubItem = ({className, ...props}: ComponentPropsWithoutRef<"li">) => {
  const {classNames, slots} = useSidebar();

  return (
    <li
      className={slots.menuSubItem({class: cn(classNames?.menuSubItem, className)})}
      data-sidebar="menu-sub-item"
      data-slot="sidebar-menu-sub-item"
      {...props}
    />
  );
};

export interface SidebarMenuSubButtonProps extends Omit<
  LinkProps,
  | "anchorIcon"
  | "as"
  | "color"
  | "href"
  | "isBlock"
  | "ref"
  | "showAnchorIcon"
  | "size"
  | "underline"
> {
  href: LinkProps["href"];
  isActive?: boolean;
  size?: "sm" | "md";
}

const SidebarMenuSubButton = ({
  href,
  isActive = false,
  size = "md",
  disableAnimation: disableAnimationProp,
  className,
  ...props
}: SidebarMenuSubButtonProps) => {
  const {classNames, disableAnimation: sidebarDisableAnimation, slots} = useSidebar();

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={slots.menuSubButton({class: cn(classNames?.menuSubButton, className)})}
      color="foreground"
      data-active={isActive || undefined}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-slot="sidebar-menu-sub-button"
      disableAnimation={disableAnimationProp ?? sidebarDisableAnimation}
      href={href}
      underline="none"
      {...props}
    />
  );
};

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
};
