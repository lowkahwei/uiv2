import type {ButtonProps} from "@sytechui/button";
import type {DrawerProps} from "@sytechui/drawer";
import type {LinkProps} from "@sytechui/link";
import type {ComponentPropsWithoutRef, ReactNode} from "react";

export type SidebarState = "expanded" | "collapsed";

export interface SidebarProviderProps {
  children: ReactNode;
  /** Controlled desktop sidebar state. */
  open?: boolean;
  /** Initial desktop sidebar state when uncontrolled. @default true */
  defaultOpen?: boolean;
  /** Called whenever the desktop sidebar state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Max viewport width (px) at which the sidebar switches to mobile (drawer) mode. @default 767 */
  mobileBreakpoint?: number;
  /** Shortcut used to toggle the sidebar. Pass `false` or `null` to disable it. @default "mod+b" */
  toggleShortcut?: string | false | null;
}

export interface SidebarContextValue {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
  mobileBreakpoint: number;
}

export type SidebarSide = "left" | "right";
export type SidebarCollapsible = "offcanvas" | "icon" | "none";

export interface SidebarProps extends Omit<ComponentPropsWithoutRef<"aside">, "children"> {
  children?: ReactNode;
  /** Width of the expanded desktop sidebar. @default "270px" */
  width?: string | number;
  /** Width of the collapsed desktop sidebar. Ignored when `collapsible="offcanvas"`. @default "60px" */
  collapsedWidth?: string | number;
  /** Which edge the desktop sidebar docks to (and the default mobile Drawer placement). @default "left" */
  side?: SidebarSide;
  /**
   * How the sidebar collapses on desktop.
   * - `"icon"`: collapses to `collapsedWidth`, showing icons only.
   * - `"offcanvas"`: collapses to zero width, fully hidden.
   * - `"none"`: never collapses; renders as a static, always-visible column (no mobile Drawer).
   * @default "icon"
   */
  collapsible?: SidebarCollapsible;
  /** Props forwarded to the mobile Drawer (e.g. backdrop, placement, size, motionProps). */
  drawerProps?: Omit<DrawerProps, "children" | "isOpen" | "onOpenChange">;
}

export interface SidebarHeaderProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  children?: ReactNode;
}

export interface SidebarContentProps extends Omit<ComponentPropsWithoutRef<"nav">, "children"> {
  children?: ReactNode;
}

export interface SidebarGroupProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> {
  children?: ReactNode;
  title?: ReactNode;
}

export interface SidebarItemProps extends Omit<
  LinkProps,
  | "anchorIcon"
  | "as"
  | "children"
  | "color"
  | "href"
  | "isBlock"
  | "ref"
  | "showAnchorIcon"
  | "size"
  | "underline"
> {
  children: ReactNode;
  /** Renders the item as a link when provided, otherwise as a button. */
  href?: LinkProps["href"];
  icon?: ReactNode;
  badge?: ReactNode;
  isActive?: boolean;
  /**
   * Tooltip content shown while the desktop sidebar is collapsed.
   * Pass `false` to disable the collapsed-state tooltip entirely.
   */
  tooltip?: ReactNode | false;
  /**
   * Secondary action rendered at the trailing edge of the item (e.g. an icon-only menu
   * button). Shown on hover/focus and hidden while the desktop sidebar is collapsed.
   */
  action?: ReactNode;
}

export interface SidebarSubmenuProps extends Omit<ButtonProps, "children" | "onPress"> {
  /** Label for the submenu trigger. */
  label: ReactNode;
  /** Nested `SidebarItem`s. */
  children: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  /** Whether the nested items are expanded on first render. @default false */
  defaultOpen?: boolean;
  /**
   * Tooltip content shown while the desktop sidebar is collapsed.
   * Pass `false` to disable the collapsed-state tooltip entirely.
   */
  tooltip?: ReactNode | false;
}

export interface SidebarFooterProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  children?: ReactNode;
}

export interface SidebarTriggerProps extends Omit<ButtonProps, "isIconOnly" | "onPress"> {
  label?: string;
  onPress?: ButtonProps["onPress"];
  /** Custom trigger icon. Defaults to the built-in sidebar icon. */
  children?: ReactNode;
}
