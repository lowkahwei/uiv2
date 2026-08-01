import type {VariantProps} from "tailwind-variants";

import {tv} from "../utils/tv";

const sidebar = tv({
  slots: {
    base: "group/sidebar-wrapper flex min-h-svh w-full bg-background",
    sidebar: "group/sidebar peer hidden text-foreground md:block",
    gap: "relative shrink-0 bg-transparent",
    container: "fixed inset-y-0 z-40 hidden h-svh md:flex",
    inner: "flex size-full min-w-0 flex-col overflow-hidden bg-content1 text-foreground",
    mobile: "h-full w-[var(--sidebar-width-mobile)] max-w-[100vw] p-0",
    trigger: "size-8 min-w-8",
    rail: [
      "absolute inset-y-0 z-50 hidden w-4 -translate-x-1/2 transition-all",
      "after:absolute after:inset-y-0 after:left-1/2 after:w-px hover:after:bg-divider sm:flex",
      "group-data-[side=left]/sidebar:-right-4 group-data-[side=right]/sidebar:left-0",
      "group-data-[side=left]/sidebar:cursor-w-resize group-data-[side=right]/sidebar:cursor-e-resize",
      "group-data-[collapsible=offcanvas]/sidebar:translate-x-0",
    ],
    inset: [
      "relative flex min-w-0 flex-1 flex-col bg-background",
      "md:peer-data-[variant=inset]/sidebar:m-2 md:peer-data-[variant=inset]/sidebar:ml-0",
      "md:peer-data-[variant=inset]/sidebar:rounded-xl md:peer-data-[variant=inset]/sidebar:shadow-sm",
    ],
    input: "h-8 w-full",
    header: "flex shrink-0 flex-col gap-2 p-2",
    footer: "flex shrink-0 flex-col gap-2 p-2",
    separator: "mx-2 w-auto",
    content:
      "flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]/sidebar:overflow-hidden",
    group: "relative flex w-full min-w-0 flex-col p-2",
    groupLabel: [
      "flex h-8 shrink-0 items-center overflow-hidden rounded-md px-2 text-xs font-medium",
      "text-foreground-500",
      "group-data-[collapsible=icon]/sidebar:-mt-8 group-data-[collapsible=icon]/sidebar:opacity-0",
    ],
    groupAction:
      "absolute right-3 top-3 size-6 min-w-6 group-data-[collapsible=icon]/sidebar:hidden",
    groupContent: "w-full text-sm",
    menu: "flex w-full min-w-0 flex-col gap-0.5",
    menuItem: "group/menu-item relative",
    menuButton: [
      "peer/menu-button flex w-full min-w-0 items-center justify-start gap-2 overflow-hidden",
      "rounded-md px-2 text-left outline-none",
      "hover:bg-content2 focus-visible:ring-2 focus-visible:ring-focus",
      "disabled:pointer-events-none disabled:opacity-50",
      "group-has-[[data-sidebar=menu-action]]/menu-item:pr-8",
      "group-data-[collapsible=icon]/sidebar:!size-8",
      "group-data-[collapsible=icon]/sidebar:!px-2",
      "[&>svg]:size-4 [&>svg]:shrink-0 [&>span:last-child]:truncate",
      "data-[active=true]:bg-default data-[active=true]:font-medium data-[active=true]:text-foreground",
      "data-[variant=outline]:border data-[variant=outline]:border-divider",
      "data-[variant=outline]:bg-content1 data-[variant=outline]:shadow-sm",
      "data-[variant=outline]:hover:border-default-400",
      "data-[size=sm]:h-7 data-[size=sm]:text-xs",
      "data-[size=default]:h-8 data-[size=default]:text-sm",
      "data-[size=lg]:h-12 data-[size=lg]:text-sm",
      "data-[size=lg]:group-data-[collapsible=icon]/sidebar:!p-0",
    ],
    menuAction: [
      "absolute right-1 top-1.5 size-5 min-w-5 group-data-[collapsible=icon]/sidebar:hidden",
      "data-[show-on-hover=true]:opacity-0",
      "data-[show-on-hover=true]:group-focus-within/menu-item:opacity-100",
      "data-[show-on-hover=true]:group-hover/menu-item:opacity-100",
    ],
    menuBadge: [
      "pointer-events-none absolute right-1 top-1.5 flex h-5 min-w-5 items-center justify-center",
      "rounded-md px-1 text-xs font-medium tabular-nums",
      "group-data-[collapsible=icon]/sidebar:hidden",
    ],
    menuSub: [
      "mx-3.5 flex min-w-0 flex-col gap-1 border-l border-divider px-2.5 py-0.5",
      "group-data-[collapsible=icon]/sidebar:hidden",
    ],
    menuSubItem: "group/menu-sub-item relative",
    menuSubButton: [
      "flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2",
      "text-foreground-600 outline-none hover:bg-content2 hover:text-foreground",
      "focus-visible:ring-2 focus-visible:ring-focus group-data-[collapsible=icon]/sidebar:hidden",
      "[&>svg]:size-4 [&>svg]:shrink-0 [&>span:last-child]:truncate",
      "data-[size=sm]:text-xs data-[size=md]:text-sm",
      "data-[active=true]:bg-default data-[active=true]:text-foreground",
    ],
  },
  variants: {
    side: {
      left: {container: "left-0"},
      right: {container: "right-0"},
    },
    variant: {
      sidebar: {},
      floating: {
        container: "p-2",
        inner: "rounded-xl border border-divider shadow-sm",
      },
      inset: {container: "p-2"},
    },
    disableAnimation: {
      true: {
        gap: "transition-none",
        container: "transition-none",
        rail: "transition-none",
        groupLabel: "transition-none",
        menuButton: "transition-none",
      },
      false: {
        gap: "transition-[width] duration-200 ease-linear motion-reduce:transition-none",
        container:
          "transition-[width,transform] duration-200 ease-linear motion-reduce:transition-none",
        groupLabel: "transition-[height,margin,opacity] duration-200 ease-linear",
        menuButton:
          "transition-[width,height,padding] duration-200 ease-linear motion-reduce:transition-none",
      },
    },
  },
  defaultVariants: {
    side: "left",
    variant: "sidebar",
    disableAnimation: false,
  },
  compoundVariants: [
    {
      side: "left",
      variant: "sidebar",
      class: {container: "border-r border-divider"},
    },
    {
      side: "right",
      variant: "sidebar",
      class: {container: "border-l border-divider"},
    },
  ],
});

export type SidebarVariantProps = VariantProps<typeof sidebar>;
export type SidebarSlots = keyof ReturnType<typeof sidebar>;
export type SidebarReturnType = ReturnType<typeof sidebar>;

export {sidebar};
