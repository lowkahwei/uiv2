import type {ButtonProps} from "@sytechui/button";
import type {LinkProps} from "@sytechui/link";
import type {HTMLHeroUIProps} from "@sytechui/system";
import type {TooltipProps} from "@sytechui/tooltip";
import type {ReactNode, Ref} from "react";

import {Button} from "@sytechui/button";
import {Link} from "@sytechui/link";
import {forwardRef} from "@sytechui/system";
import {cn} from "@sytechui/theme";
import {Tooltip} from "@sytechui/tooltip";
import {forwardRef as forwardRefNative} from "react";

import {useSidebarState, useSidebarStatic} from "./use-sidebar";

const SidebarGroup = forwardRef<"section", HTMLHeroUIProps<"section">>(
  ({as, className, ...props}, ref) => {
    const {classNames, slots} = useSidebarStatic();
    const Component = as || "section";

    return (
      <Component
        ref={ref}
        className={slots.group({class: cn(classNames?.group, className)})}
        data-sidebar="group"
        data-slot="sidebar-group"
        {...props}
      />
    );
  },
);

SidebarGroup.displayName = "SytechUI.SidebarGroup";

const SidebarGroupLabel = forwardRef<"div", HTMLHeroUIProps<"div">>(
  ({as, className, ...props}, ref) => {
    const {classNames, slots} = useSidebarStatic();
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={slots.groupLabel({class: cn(classNames?.groupLabel, className)})}
        data-sidebar="group-label"
        data-slot="sidebar-group-label"
        {...props}
      />
    );
  },
);

SidebarGroupLabel.displayName = "SytechUI.SidebarGroupLabel";

export interface SidebarGroupActionProps extends Omit<ButtonProps, "isIconOnly"> {}

const SidebarGroupAction = forwardRefNative<HTMLButtonElement, SidebarGroupActionProps>(
  ({className, ...props}, ref) => {
    const {classNames, disableAnimation, slots} = useSidebarStatic();

    return (
      <Button
        ref={ref}
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
  },
);

SidebarGroupAction.displayName = "SytechUI.SidebarGroupAction";

const SidebarGroupContent = forwardRef<"div", HTMLHeroUIProps<"div">>(
  ({as, className, ...props}, ref) => {
    const {classNames, slots} = useSidebarStatic();
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={slots.groupContent({class: cn(classNames?.groupContent, className)})}
        data-sidebar="group-content"
        data-slot="sidebar-group-content"
        {...props}
      />
    );
  },
);

SidebarGroupContent.displayName = "SytechUI.SidebarGroupContent";

const SidebarMenu = forwardRef<"ul", HTMLHeroUIProps<"ul">>(({as, className, ...props}, ref) => {
  const {classNames, slots} = useSidebarStatic();
  const Component = as || "ul";

  return (
    <Component
      ref={ref}
      className={slots.menu({class: cn(classNames?.menu, className)})}
      data-sidebar="menu"
      data-slot="sidebar-menu"
      {...props}
    />
  );
});

SidebarMenu.displayName = "SytechUI.SidebarMenu";

const SidebarMenuItem = forwardRef<"li", HTMLHeroUIProps<"li">>(
  ({as, className, ...props}, ref) => {
    const {classNames, slots} = useSidebarStatic();
    const Component = as || "li";

    return (
      <Component
        ref={ref}
        className={slots.menuItem({class: cn(classNames?.menuItem, className)})}
        data-sidebar="menu-item"
        data-slot="sidebar-menu-item"
        {...props}
      />
    );
  },
);

SidebarMenuItem.displayName = "SytechUI.SidebarMenuItem";

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
  /** Renders the item as a link when provided, otherwise as a button. */
  href?: LinkProps["href"];
  /** Marks the item as the current page. @default false */
  isActive?: boolean;
  /** Tooltip content shown while the desktop sidebar is collapsed. Pass `false` to disable it. */
  tooltip?: ReactNode | false;
  /** Props forwarded to the collapsed-state tooltip. */
  tooltipProps?: Omit<TooltipProps, "children" | "content" | "isDisabled">;
  /** Visual style of the button. @default "default" */
  variant?: "default" | "outline";
  /** Size of the button. @default "default" */
  size?: "sm" | "default" | "lg";
  /** Whether pressing the item closes the mobile Drawer. @default true when `href` is set, false otherwise */
  closeMobileOnPress?: boolean;
}

const SidebarMenuButton = forwardRefNative<
  HTMLButtonElement | HTMLAnchorElement,
  SidebarMenuButtonProps
>(
  (
    {
      href,
      isActive = false,
      tooltip,
      tooltipProps,
      variant = "default",
      size = "default",
      closeMobileOnPress,
      disableAnimation: disableAnimationProp,
      className,
      children,
      onPress,
      ...props
    },
    ref,
  ) => {
    const {
      classNames,
      disableAnimation: sidebarDisableAnimation,
      slots,
      setOpenMobile,
    } = useSidebarStatic();
    const {isMobile, state} = useSidebarState();
    const disableAnimation = disableAnimationProp ?? sidebarDisableAnimation;
    const classes = slots.menuButton({class: cn(classNames?.menuButton, className)});
    const shouldCloseMobile = closeMobileOnPress ?? href != null;
    const handlePress: SidebarMenuButtonProps["onPress"] = (event) => {
      onPress?.(event);
      if (shouldCloseMobile) setOpenMobile(false);
    };
    const control = href ? (
      <Link
        {...props}
        ref={ref as Ref<HTMLAnchorElement>}
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
        onPress={handlePress}
      >
        {children}
      </Link>
    ) : (
      <Button
        disableRipple
        fullWidth
        {...(props as ButtonProps)}
        ref={ref as Ref<HTMLButtonElement>}
        className={classes}
        data-active={isActive || undefined}
        data-sidebar="menu-button"
        data-size={size}
        data-slot="sidebar-menu-button"
        data-variant={variant}
        disableAnimation={disableAnimation}
        radius="sm"
        variant="light"
        onPress={handlePress}
      >
        {children}
      </Button>
    );

    if (tooltip == null || tooltip === false) {
      return control;
    }

    return (
      <Tooltip
        closeDelay={0}
        placement="right"
        {...tooltipProps}
        content={tooltip}
        disableAnimation={tooltipProps?.disableAnimation ?? disableAnimation}
        isDisabled={state !== "collapsed" || isMobile}
      >
        {control}
      </Tooltip>
    );
  },
);

SidebarMenuButton.displayName = "SytechUI.SidebarMenuButton";

export interface SidebarMenuActionProps extends Omit<ButtonProps, "isIconOnly"> {
  /** Shows the action only on hover/focus of the parent menu item. @default false */
  showOnHover?: boolean;
}

const SidebarMenuAction = forwardRefNative<HTMLButtonElement, SidebarMenuActionProps>(
  ({showOnHover = false, className, ...props}, ref) => {
    const {classNames, disableAnimation, slots} = useSidebarStatic();

    return (
      <Button
        ref={ref}
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
  },
);

SidebarMenuAction.displayName = "SytechUI.SidebarMenuAction";

const SidebarMenuBadge = forwardRef<"div", HTMLHeroUIProps<"div">>(
  ({as, className, ...props}, ref) => {
    const {classNames, slots} = useSidebarStatic();
    const Component = as || "div";

    return (
      <Component
        ref={ref}
        className={slots.menuBadge({class: cn(classNames?.menuBadge, className)})}
        data-sidebar="menu-badge"
        data-slot="sidebar-menu-badge"
        {...props}
      />
    );
  },
);

SidebarMenuBadge.displayName = "SytechUI.SidebarMenuBadge";

const SidebarMenuSub = forwardRef<"ul", HTMLHeroUIProps<"ul">>(({as, className, ...props}, ref) => {
  const {classNames, slots} = useSidebarStatic();
  const Component = as || "ul";

  return (
    <Component
      ref={ref}
      className={slots.menuSub({class: cn(classNames?.menuSub, className)})}
      data-sidebar="menu-sub"
      data-slot="sidebar-menu-sub"
      {...props}
    />
  );
});

SidebarMenuSub.displayName = "SytechUI.SidebarMenuSub";

const SidebarMenuSubItem = forwardRef<"li", HTMLHeroUIProps<"li">>(
  ({as, className, ...props}, ref) => {
    const {classNames, slots} = useSidebarStatic();
    const Component = as || "li";

    return (
      <Component
        ref={ref}
        className={slots.menuSubItem({class: cn(classNames?.menuSubItem, className)})}
        data-sidebar="menu-sub-item"
        data-slot="sidebar-menu-sub-item"
        {...props}
      />
    );
  },
);

SidebarMenuSubItem.displayName = "SytechUI.SidebarMenuSubItem";

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
  /** Destination for the nested link. */
  href: LinkProps["href"];
  /** Marks the item as the current page. @default false */
  isActive?: boolean;
  /** Size of the button. @default "md" */
  size?: "sm" | "md";
  /** Whether pressing the item closes the mobile Drawer. @default true */
  closeMobileOnPress?: boolean;
}

const SidebarMenuSubButton = forwardRefNative<HTMLAnchorElement, SidebarMenuSubButtonProps>(
  (
    {
      href,
      isActive = false,
      size = "md",
      closeMobileOnPress = true,
      disableAnimation: disableAnimationProp,
      className,
      onPress,
      ...props
    },
    ref,
  ) => {
    const {
      classNames,
      disableAnimation: sidebarDisableAnimation,
      slots,
      setOpenMobile,
    } = useSidebarStatic();
    const handlePress: LinkProps["onPress"] = (event) => {
      onPress?.(event);
      if (closeMobileOnPress) setOpenMobile(false);
    };

    return (
      <Link
        ref={ref}
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
        onPress={handlePress}
        {...props}
      />
    );
  },
);

SidebarMenuSubButton.displayName = "SytechUI.SidebarMenuSubButton";

export {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
};
