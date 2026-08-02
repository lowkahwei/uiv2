import "@testing-library/jest-dom";
import * as React from "react";
import {act, render, waitFor} from "@testing-library/react";
import {HeroUIProvider} from "@sytechui/system";
import userEvent from "@testing-library/user-event";
import {MotionGlobalConfig} from "framer-motion";

import {
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
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  SIDEBAR_COOKIE_NAME,
  useSidebarMenuItem,
} from "../src";

const originalMatchMedia = window.matchMedia;

function setMobile(isMobile: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      addEventListener: jest.fn(),
      addListener: jest.fn(),
      dispatchEvent: jest.fn(),
      matches: isMobile,
      media: query,
      onchange: null,
      removeEventListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  });
}

/** Mocks matchMedia against a single simulated viewport width, honored per-query. */
function setViewportWidth(initialWidth: number) {
  let width = initialWidth;
  const listeners = new Map<string, Set<(event: {matches: boolean}) => void>>();
  const matchesQuery = (query: string) => {
    const match = /\(max-width:\s*(\d+)px\)/.exec(query);

    return match ? width <= Number(match[1]) : false;
  };
  const subscribe = (query: string, cb: (event: {matches: boolean}) => void) => {
    if (!listeners.has(query)) listeners.set(query, new Set());
    listeners.get(query)!.add(cb);
  };

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      addEventListener: (_: string, cb: (event: {matches: boolean}) => void) =>
        subscribe(query, cb),
      addListener: (cb: (event: {matches: boolean}) => void) => subscribe(query, cb),
      dispatchEvent: jest.fn(),
      get matches() {
        return matchesQuery(query);
      },
      media: query,
      onchange: null,
      removeEventListener: (_: string, cb: (event: {matches: boolean}) => void) =>
        listeners.get(query)?.delete(cb),
      removeListener: (cb: (event: {matches: boolean}) => void) => listeners.get(query)?.delete(cb),
    })),
  });

  return {
    setWidth(nextWidth: number) {
      width = nextWidth;
      listeners.forEach((cbs, query) => {
        const matches = matchesQuery(query);

        cbs.forEach((cb) => cb({matches}));
      });
    },
  };
}

const AppSidebar = (props: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar aria-label="Application sidebar" {...props}>
    <SidebarHeader>
      <SidebarInput aria-label="Search navigation" />
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton data-testid="workspace-switcher" size="lg" tooltip="Workspace">
            <span aria-hidden="true">W</span>
            <span>
              <span>Acme Inc</span>
              <span>Enterprise</span>
            </span>
            <span aria-hidden="true">↕</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupAction aria-label="Add application">+</SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive href="/dashboard" tooltip="Dashboard">
                <span aria-hidden="true">D</span>
                <span>Dashboard</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>3</SidebarMenuBadge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Projects">
                <span aria-hidden="true">P</span>
                <span>Projects</span>
              </SidebarMenuButton>
              <SidebarMenuAction aria-label="More project actions">•••</SidebarMenuAction>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="/projects/one">
                    <span>Project one</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarSeparator />
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton data-testid="account-switcher" size="lg" tooltip="Account">
            <span aria-hidden="true">CN</span>
            <span>
              <span>Account</span>
              <span>account@example.com</span>
            </span>
            <span aria-hidden="true">↕</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
);

const ExpandAction = () => {
  const expandItem = useSidebarMenuItem();

  return (
    <SidebarMenuAction aria-label="Toggle nested items" onPress={() => expandItem?.toggle()}>
      ▾
    </SidebarMenuAction>
  );
};

interface LayoutProps {
  defaultOpen?: boolean;
  providerProps?: Omit<React.ComponentProps<typeof SidebarProvider>, "children" | "defaultOpen">;
  sidebarProps?: React.ComponentProps<typeof Sidebar>;
}

const Layout = ({defaultOpen = true, providerProps, sidebarProps}: LayoutProps) => (
  <SidebarProvider collapsible="icon" defaultOpen={defaultOpen} {...providerProps}>
    <AppSidebar {...sidebarProps} />
    <SidebarInset>
      <SidebarTrigger />
      <h1>Dashboard content</h1>
    </SidebarInset>
  </SidebarProvider>
);

const getDesktopSidebar = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-slot="sidebar"][data-state]')!;

describe("Sidebar", () => {
  beforeEach(() => setMobile(false));

  afterEach(() => {
    MotionGlobalConfig.skipAnimations = false;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: originalMatchMedia,
    });
  });

  it("renders every composable primitive and its accessible state", () => {
    const {container, getByRole, getByText} = render(<Layout />);

    expect(getByRole("complementary", {name: "Application sidebar"})).toBeInTheDocument();
    expect(getByRole("textbox", {name: "Search navigation"})).toBeInTheDocument();
    expect(getByRole("button", {name: "Add application"})).toBeInTheDocument();
    expect(getByRole("button", {name: "More project actions"})).toBeInTheDocument();
    expect(getByRole("link", {name: "Dashboard"})).toHaveAttribute("aria-current", "page");
    expect(getByRole("link", {name: "Project one"})).toHaveAttribute("href", "/projects/one");
    expect(getByText("Account")).toBeInTheDocument();

    [
      "sidebar-header",
      "sidebar-input",
      "sidebar-content",
      "sidebar-group",
      "sidebar-group-label",
      "sidebar-group-action",
      "sidebar-group-content",
      "sidebar-menu",
      "sidebar-menu-item",
      "sidebar-menu-button",
      "sidebar-menu-action",
      "sidebar-menu-badge",
      "sidebar-menu-sub",
      "sidebar-menu-sub-item",
      "sidebar-menu-sub-button",
      "sidebar-separator",
      "sidebar-footer",
      "sidebar-rail",
      "sidebar-inset",
      "sidebar-trigger",
    ].forEach((slot) => {
      expect(container.querySelector(`[data-slot="${slot}"]`)).toBeInTheDocument();
    });
  });

  it("sets the default dimensions and expanded state", () => {
    const {container} = render(<Layout />);
    const wrapper = container.querySelector<HTMLElement>('[data-slot="sidebar-wrapper"]')!;
    const sidebar = getDesktopSidebar(container);

    expect(wrapper.style.getPropertyValue("--sidebar-width")).toBe("16rem");
    expect(wrapper.style.getPropertyValue("--sidebar-width-icon")).toBe("3rem");
    expect(sidebar).toHaveAttribute("data-state", "expanded");
    expect(sidebar).not.toHaveAttribute("data-collapsible");
  });

  it("toggles from the trigger and both keyboard shortcuts while persisting the cookie", async () => {
    const user = userEvent.setup();
    const {container} = render(<Layout />);
    const sidebar = getDesktopSidebar(container);
    const trigger = container.querySelector<HTMLElement>('[data-slot="sidebar-trigger"]')!;

    await user.click(trigger);
    expect(sidebar).toHaveAttribute("data-state", "collapsed");
    expect(sidebar).toHaveAttribute("data-collapsible", "icon");
    expect(document.cookie).toContain("sidebar_state=false");

    await user.keyboard("{Meta>}b{/Meta}");
    expect(sidebar).toHaveAttribute("data-state", "expanded");

    await user.keyboard("{Control>}b{/Control}");
    expect(sidebar).toHaveAttribute("data-state", "collapsed");
  });

  it("toggles from the rail and preserves a custom trigger callback", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    const {container} = render(
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger data-testid="custom-trigger" onPress={onPress} />
      </SidebarProvider>,
    );
    const sidebar = getDesktopSidebar(container);

    await user.click(container.querySelector<HTMLElement>('[data-testid="custom-trigger"]')!);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(sidebar).toHaveAttribute("data-state", "collapsed");

    await user.click(container.querySelector<HTMLElement>('[data-slot="sidebar-rail"]')!);
    expect(sidebar).toHaveAttribute("data-state", "expanded");
  });

  it("keeps header and footer labels mounted throughout the icon animation", async () => {
    const user = userEvent.setup();
    const {container, getByTestId, getByText} = render(<Layout defaultOpen={false} />);
    const workspace = getByTestId("workspace-switcher");
    const account = getByTestId("account-switcher");
    const workspaceLabel = getByText("Acme Inc").parentElement!;
    const accountLabel = getByText("Account").parentElement!;

    [workspace, account].forEach((button) => {
      expect(button).toHaveClass(
        "transition-[width,height,padding]",
        "duration-200",
        "ease-linear",
        "motion-reduce:transition-none",
      );
    });

    expect(workspace).toContainElement(workspaceLabel);
    expect(account).toContainElement(accountLabel);
    expect(workspaceLabel).not.toHaveClass("hidden");
    expect(accountLabel).not.toHaveClass("hidden");

    await user.click(container.querySelector<HTMLElement>('[data-slot="sidebar-trigger"]')!);

    expect(getDesktopSidebar(container)).toHaveAttribute("data-state", "expanded");
    expect(workspace).toContainElement(workspaceLabel);
    expect(account).toContainElement(accountLabel);
  });

  it("supports controlled state without mutating the rendered value", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const {container} = render(
      <SidebarProvider open onOpenChange={onOpenChange}>
        <AppSidebar />
        <SidebarTrigger />
      </SidebarProvider>,
    );

    await user.click(container.querySelector<HTMLElement>('[data-slot="sidebar-trigger"]')!);

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getDesktopSidebar(container)).toHaveAttribute("data-state", "expanded");
  });

  it.each([
    ["left", "translateX(-100%)"],
    ["right", "translateX(100%)"],
  ] as const)("slides an offcanvas sidebar from the %s", async (side, collapsedTransform) => {
    const user = userEvent.setup();
    const {container} = render(
      <Layout defaultOpen={false} providerProps={{collapsible: "offcanvas", side}} />,
    );
    const gap = container.querySelector<HTMLElement>('[data-slot="sidebar-gap"]')!;
    const panel = container.querySelector<HTMLElement>('[data-slot="sidebar-container"]')!;

    expect(gap).toHaveStyle({width: "0px"});
    expect(panel).toHaveStyle({transform: collapsedTransform});
    expect(getDesktopSidebar(container)).toHaveAttribute("data-side", side);

    await user.click(container.querySelector<HTMLElement>('[data-slot="sidebar-trigger"]')!);
    expect(panel).toHaveStyle({transform: "translateX(0)"});
  });

  it("uses the icon width when initially collapsed", () => {
    const {container} = render(<Layout defaultOpen={false} />);
    const gap = container.querySelector<HTMLElement>('[data-slot="sidebar-gap"]')!;
    const panel = container.querySelector<HTMLElement>('[data-slot="sidebar-container"]')!;

    expect(gap).toHaveStyle({width: "var(--sidebar-width-icon)"});
    expect(panel).toHaveStyle({width: "var(--sidebar-width-icon)"});
    expect(panel).toHaveStyle({transform: "translateX(0)"});
  });

  it.each(["floating", "inset"] as const)("applies the %s layout spacing", (variant) => {
    const {container} = render(<Layout providerProps={{variant}} />);
    const wrapper = container.querySelector<HTMLElement>('[data-slot="sidebar-wrapper"]')!;
    const gap = container.querySelector<HTMLElement>('[data-slot="sidebar-gap"]')!;
    const panel = container.querySelector<HTMLElement>('[data-slot="sidebar-container"]')!;
    const inner = container.querySelector<HTMLElement>('[data-slot="sidebar-inner"]')!;
    const inset = container.querySelector<HTMLElement>('[data-slot="sidebar-inset"]')!;

    expect(gap).toHaveStyle({width: "calc(var(--sidebar-width) + 1rem)"});
    expect(panel).toHaveClass("p-2");

    if (variant === "floating") {
      expect(inner).toHaveClass("rounded-xl", "border", "shadow-sm");
    } else {
      expect(inner).toHaveClass("bg-transparent");
      expect(wrapper).toHaveAttribute("data-inset-side", "left");
      expect(inset).toHaveClass(
        "md:m-2",
        "md:group-data-[inset-side=left]/sidebar-wrapper:ml-0",
        "md:rounded-xl",
        "md:bg-content1",
      );
    }
  });

  it("applies the inset content spacing on the configured side", () => {
    const {container} = render(<Layout providerProps={{side: "right", variant: "inset"}} />);
    const wrapper = container.querySelector<HTMLElement>('[data-slot="sidebar-wrapper"]')!;
    const inset = container.querySelector<HTMLElement>('[data-slot="sidebar-inset"]')!;

    expect(wrapper).toHaveAttribute("data-inset-side", "right");
    expect(inset).toHaveClass("md:m-2", "md:group-data-[inset-side=right]/sidebar-wrapper:mr-0");
  });

  it("restores the inset margin when an offcanvas sidebar is collapsed", () => {
    const {container} = render(
      <Layout defaultOpen={false} providerProps={{collapsible: "offcanvas", variant: "inset"}} />,
    );
    const wrapper = container.querySelector<HTMLElement>('[data-slot="sidebar-wrapper"]')!;
    const inset = container.querySelector<HTMLElement>('[data-slot="sidebar-inset"]')!;

    expect(wrapper).not.toHaveAttribute("data-inset-side");
    expect(inset).toHaveClass("md:m-2");
  });

  it("renders a static column and disables toggles when collapsing is disabled", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const {container, getByRole} = render(
      <SidebarProvider collapsible="none" onOpenChange={onOpenChange}>
        <Sidebar aria-label="Static sidebar">Static content</Sidebar>
        <SidebarTrigger />
      </SidebarProvider>,
    );

    expect(getByRole("complementary", {name: "Static sidebar"})).toHaveClass(
      "w-[var(--sidebar-width)]",
    );
    expect(container.querySelector('[data-slot="sidebar-gap"]')).not.toBeInTheDocument();
    expect(container.querySelector("[data-state]")).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="sidebar-trigger"]')).not.toBeInTheDocument();

    await user.keyboard("{Meta>}b{/Meta}");
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("keeps variant styling on a non-collapsible sidebar", () => {
    const {getByRole} = render(
      <SidebarProvider collapsible="none" variant="floating">
        <Sidebar aria-label="Static sidebar">Static content</Sidebar>
      </SidebarProvider>,
    );

    expect(getByRole("complementary", {name: "Static sidebar"})).toHaveClass(
      "m-2",
      "h-[calc(100svh-1rem)]",
      "rounded-xl",
      "border",
      "shadow-sm",
    );
  });

  it("opens the sidebar in a Sytech drawer on mobile", async () => {
    setMobile(true);
    const user = userEvent.setup();
    const {findByRole, getByRole} = render(<Layout />);

    await user.click(getByRole("button", {name: "Toggle sidebar"}));

    await waitFor(async () => {
      expect(await findByRole("complementary", {name: "Application sidebar"})).toBeVisible();
    });

    expect(
      document.querySelector(".w-\\[var\\(--sidebar-width-mobile\\,18rem\\)\\]"),
    ).toBeInTheDocument();
  });

  it("shows collapsed menu tooltips", async () => {
    const user = userEvent.setup();
    const {findByRole, getByRole} = render(<Layout defaultOpen={false} />);

    await user.hover(getByRole("link", {name: "Dashboard"}));
    expect(await findByRole("tooltip")).toHaveTextContent("Dashboard");
  });

  it("connects every desktop primitive to its theme slot", () => {
    const classNames = {
      base: "theme-base",
      sidebar: "theme-sidebar",
      gap: "theme-gap",
      container: "theme-container",
      inner: "theme-inner",
      trigger: "theme-trigger",
      rail: "theme-rail",
      inset: "theme-inset",
      input: "theme-input",
      header: "theme-header",
      footer: "theme-footer",
      separator: "theme-separator",
      content: "theme-content",
      group: "theme-group",
      groupLabel: "theme-group-label",
      groupAction: "theme-group-action",
      groupContent: "theme-group-content",
      menu: "theme-menu",
      menuItem: "theme-menu-item",
      menuButton: "theme-menu-button",
      menuAction: "theme-menu-action",
      menuBadge: "theme-menu-badge",
      menuSub: "theme-menu-sub",
      menuSubItem: "theme-menu-sub-item",
      menuSubButton: "theme-menu-sub-button",
    } satisfies NonNullable<React.ComponentProps<typeof SidebarProvider>["classNames"]>;
    const {container} = render(<Layout providerProps={{classNames}} />);
    const slotSelectors: Array<[keyof typeof classNames, string]> = [
      ["base", '[data-slot="sidebar-wrapper"]'],
      ["sidebar", '[data-slot="sidebar"][data-state]'],
      ["gap", '[data-slot="sidebar-gap"]'],
      ["container", '[data-slot="sidebar-container"]'],
      ["inner", '[data-slot="sidebar-inner"]'],
      ["trigger", '[data-slot="sidebar-trigger"]'],
      ["rail", '[data-slot="sidebar-rail"]'],
      ["inset", '[data-slot="sidebar-inset"]'],
      ["input", ".theme-input"],
      ["header", '[data-slot="sidebar-header"]'],
      ["footer", '[data-slot="sidebar-footer"]'],
      ["separator", '[data-slot="sidebar-separator"]'],
      ["content", '[data-slot="sidebar-content"]'],
      ["group", '[data-slot="sidebar-group"]'],
      ["groupLabel", '[data-slot="sidebar-group-label"]'],
      ["groupAction", '[data-slot="sidebar-group-action"]'],
      ["groupContent", '[data-slot="sidebar-group-content"]'],
      ["menu", '[data-slot="sidebar-menu"]'],
      ["menuItem", '[data-slot="sidebar-menu-item"]'],
      ["menuButton", '[data-slot="sidebar-menu-button"]'],
      ["menuAction", '[data-slot="sidebar-menu-action"]'],
      ["menuBadge", '[data-slot="sidebar-menu-badge"]'],
      ["menuSub", '[data-slot="sidebar-menu-sub"]'],
      ["menuSubItem", '[data-slot="sidebar-menu-sub-item"]'],
      ["menuSubButton", '[data-slot="sidebar-menu-sub-button"]'],
    ];

    slotSelectors.forEach(([slot, selector]) => {
      expect(container.querySelector(selector)).toHaveClass(classNames[slot]);
    });
  });

  it("connects the mobile drawer to its theme slot", async () => {
    setMobile(true);
    const user = userEvent.setup();

    render(<Layout providerProps={{classNames: {mobile: "theme-mobile"}}} />);
    await user.click(document.querySelector<HTMLElement>('[data-slot="sidebar-trigger"]')!);

    await waitFor(() => {
      expect(document.querySelector('[data-mobile="true"]')).toHaveClass("theme-mobile");
    });
  });

  it("lets local classes override provider slot classes", () => {
    const {getByRole} = render(
      <SidebarProvider classNames={{trigger: "h-10 theme-trigger"}}>
        <SidebarTrigger className="h-14 local-trigger" />
      </SidebarProvider>,
    );
    const trigger = getByRole("button", {name: "Toggle sidebar"});

    expect(trigger).toHaveClass("h-14", "local-trigger", "theme-trigger");
    expect(trigger).not.toHaveClass("h-10");
  });

  it("disables every sidebar transition through the component theme prop", () => {
    const {container} = render(<Layout providerProps={{disableAnimation: true}} />);
    const gap = container.querySelector<HTMLElement>('[data-slot="sidebar-gap"]')!;
    const panel = container.querySelector<HTMLElement>('[data-slot="sidebar-container"]')!;
    const rail = container.querySelector<HTMLElement>('[data-slot="sidebar-rail"]')!;
    const label = container.querySelector<HTMLElement>('[data-slot="sidebar-group-label"]')!;
    const menuButton = container.querySelector<HTMLElement>('[data-slot="sidebar-menu-button"]')!;

    [gap, panel, rail, label, menuButton].forEach((element) => {
      expect(element).toHaveClass("transition-none");
    });
  });

  it("inherits the global Sytech animation setting", () => {
    const {container} = render(
      <HeroUIProvider disableAnimation>
        <Layout />
      </HeroUIProvider>,
    );

    expect(container.querySelector('[data-slot="sidebar-gap"]')).toHaveClass("transition-none");
    expect(container.querySelector('[data-slot="sidebar-menu-button"]')).toHaveClass(
      "transition-none",
    );
  });

  it("lets a local animation setting override the global Sytech setting", () => {
    const {container} = render(
      <HeroUIProvider disableAnimation>
        <Layout providerProps={{disableAnimation: false}} />
      </HeroUIProvider>,
    );
    const gap = container.querySelector('[data-slot="sidebar-gap"]');

    expect(gap).toHaveClass("transition-[width]", "duration-200");
    expect(gap).not.toHaveClass("transition-none");
  });

  it("renders pre-hydration CSS for a custom mobileBreakpoint", () => {
    const {container} = render(
      <SidebarProvider collapsible="icon" mobileBreakpoint={900}>
        <Sidebar>content</Sidebar>
      </SidebarProvider>,
    );

    expect(container.querySelector("style")).toHaveTextContent("max-width:900px");
    expect(container.querySelectorAll("[data-sidebar-bp]")).toHaveLength(1);
  });

  it("forwards refs to subcomponents", () => {
    const headerRef = React.createRef<HTMLDivElement>();
    const triggerRef = React.createRef<HTMLButtonElement>();

    render(
      <SidebarProvider>
        <SidebarHeader ref={headerRef} />
        <SidebarTrigger ref={triggerRef} />
      </SidebarProvider>,
    );

    expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("applies width and collapsedWidth to the CSS variables", () => {
    const {container} = render(
      <SidebarProvider collapsedWidth="4rem" width={280}>
        <Sidebar>content</Sidebar>
      </SidebarProvider>,
    );
    const wrapper = container.querySelector<HTMLElement>('[data-slot="sidebar-wrapper"]')!;

    expect(wrapper.style.getPropertyValue("--sidebar-width")).toBe("280px");
    expect(wrapper.style.getPropertyValue("--sidebar-width-icon")).toBe("4rem");
  });

  it("supports a custom toggleShortcut and ignores editable targets", async () => {
    const user = userEvent.setup();
    const {container, getByRole} = render(
      <SidebarProvider toggleShortcut="mod+shift+s">
        <Sidebar>content</Sidebar>
        <SidebarInput aria-label="Search" />
      </SidebarProvider>,
    );
    const sidebar = getDesktopSidebar(container);

    await user.keyboard("{Meta>}b{/Meta}");
    expect(sidebar).toHaveAttribute("data-state", "expanded");

    await user.keyboard("{Meta>}{Shift>}s{/Shift}{/Meta}");
    expect(sidebar).toHaveAttribute("data-state", "collapsed");

    await user.click(getByRole("textbox", {name: "Search"}));
    await user.keyboard("{Meta>}{Shift>}s{/Shift}{/Meta}");
    expect(sidebar).toHaveAttribute("data-state", "collapsed");
  });

  it("disables the shortcut with toggleShortcut={false}", async () => {
    const user = userEvent.setup();
    const {container} = render(
      <SidebarProvider toggleShortcut={false}>
        <Sidebar>content</Sidebar>
      </SidebarProvider>,
    );

    await user.keyboard("{Meta>}b{/Meta}");
    expect(getDesktopSidebar(container)).toHaveAttribute("data-state", "expanded");
  });

  it("auto-collapses when crossing collapseBreakpoint, and expands back", async () => {
    const viewport = setViewportWidth(1200);
    const {container} = render(
      <SidebarProvider collapseBreakpoint={1024} collapsible="icon">
        <Sidebar>content</Sidebar>
      </SidebarProvider>,
    );
    const sidebar = getDesktopSidebar(container);

    expect(sidebar).toHaveAttribute("data-state", "expanded");

    act(() => viewport.setWidth(900));
    expect(sidebar).toHaveAttribute("data-state", "collapsed");

    act(() => viewport.setWidth(1200));
    expect(sidebar).toHaveAttribute("data-state", "expanded");
  });

  it("ignores collapseBreakpoint in controlled mode", () => {
    const viewport = setViewportWidth(1200);
    const {container} = render(
      <SidebarProvider open collapseBreakpoint={1024} collapsible="icon">
        <Sidebar>content</Sidebar>
      </SidebarProvider>,
    );
    const sidebar = getDesktopSidebar(container);

    act(() => viewport.setWidth(900));
    expect(sidebar).toHaveAttribute("data-state", "expanded");
  });

  it("closes the mobile drawer after pressing a menu button", async () => {
    setMobile(true);
    const user = userEvent.setup();
    const {getByRole, findByRole, queryByRole} = render(
      <SidebarProvider>
        <Sidebar aria-label="Application sidebar">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton closeMobileOnPress onPress={() => {}}>
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "Toggle sidebar"}));
    await user.click(await findByRole("button", {name: "Dashboard"}));

    await waitFor(() => {
      expect(queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("forwards drawerProps to the mobile drawer", async () => {
    setMobile(true);
    const user = userEvent.setup();

    render(<Layout sidebarProps={{drawerProps: {classNames: {base: "custom-drawer-base"}}}} />);
    await user.click(document.querySelector<HTMLElement>('[data-slot="sidebar-trigger"]')!);

    await waitFor(() => {
      expect(document.querySelector(".custom-drawer-base")).toBeInTheDocument();
    });
  });

  it("renders SidebarMenuSkeleton with an optional icon placeholder", () => {
    const {container, rerender} = render(
      <SidebarProvider>
        <Sidebar aria-label="Application sidebar">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuSkeleton />
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>,
    );
    const skeletonItem = container.querySelector('[data-slot="sidebar-menu-skeleton"]')!;

    expect(skeletonItem.children).toHaveLength(1);
    expect(skeletonItem.querySelector(".size-4")).not.toBeInTheDocument();

    rerender(
      <SidebarProvider>
        <Sidebar aria-label="Application sidebar">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuSkeleton showIcon />
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>,
    );
    const skeletonItemWithIcon = container.querySelector('[data-slot="sidebar-menu-skeleton"]')!;

    expect(skeletonItemWithIcon.children).toHaveLength(2);
    expect(skeletonItemWithIcon.querySelector(".size-4")).toBeInTheDocument();
  });

  it("expands and collapses an expandable menu item uncontrolled", async () => {
    const user = userEvent.setup();
    const {getByRole, queryByRole} = render(
      <SidebarProvider>
        <Sidebar aria-label="Application sidebar">
          <SidebarMenu>
            <SidebarMenuItem expandable>
              <SidebarMenuButton>Settings</SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="/settings/profile">Profile</SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>,
    );
    const trigger = getByRole("button", {name: "Settings"});

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(queryByRole("link", {name: "Profile"})).not.toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(getByRole("link", {name: "Profile"})).toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(queryByRole("link", {name: "Profile"})).not.toBeInTheDocument();
  });

  it("supports a controlled expanded state via isExpanded and onExpandedChange", async () => {
    const user = userEvent.setup();
    const onExpandedChange = jest.fn();
    const {getByRole, queryByRole} = render(
      <SidebarProvider>
        <Sidebar aria-label="Application sidebar">
          <SidebarMenu>
            <SidebarMenuItem expandable isExpanded={false} onExpandedChange={onExpandedChange}>
              <SidebarMenuButton>Settings</SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="/settings/profile">Profile</SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "Settings"}));

    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(queryByRole("link", {name: "Profile"})).not.toBeInTheDocument();
  });

  it("lets an external action toggle expansion via useSidebarMenuItem", async () => {
    const user = userEvent.setup();
    const {getByRole, queryByRole} = render(
      <SidebarProvider>
        <Sidebar aria-label="Application sidebar">
          <SidebarMenu>
            <SidebarMenuItem expandable>
              <SidebarMenuButton href="/settings">Settings</SidebarMenuButton>
              <ExpandAction />
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="/settings/profile">Profile</SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(queryByRole("link", {name: "Profile"})).not.toBeInTheDocument();

    await user.click(getByRole("button", {name: "Toggle nested items"}));
    expect(getByRole("link", {name: "Profile"})).toBeInTheDocument();
  });

  it("exposes the persisted cookie name", () => {
    expect(SIDEBAR_COOKIE_NAME).toBe("sidebar_state");
  });
});
