import "@testing-library/jest-dom";
import * as React from "react";
import {render, waitFor} from "@testing-library/react";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
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

const AppSidebar = (props: React.ComponentProps<typeof Sidebar>) => (
  <Sidebar aria-label="Application sidebar" collapsible="icon" {...props}>
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

interface LayoutProps {
  defaultOpen?: boolean;
  providerProps?: Omit<React.ComponentProps<typeof SidebarProvider>, "children" | "defaultOpen">;
  sidebarProps?: React.ComponentProps<typeof Sidebar>;
}

const Layout = ({defaultOpen = true, providerProps, sidebarProps}: LayoutProps) => (
  <SidebarProvider defaultOpen={defaultOpen} {...providerProps}>
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
    expect(wrapper.style.getPropertyValue("--sidebar-width-mobile")).toBe("18rem");
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
      <Layout defaultOpen={false} sidebarProps={{collapsible: "offcanvas", side}} />,
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
    const {container} = render(<Layout sidebarProps={{variant}} />);
    const gap = container.querySelector<HTMLElement>('[data-slot="sidebar-gap"]')!;
    const panel = container.querySelector<HTMLElement>('[data-slot="sidebar-container"]')!;
    const inner = container.querySelector<HTMLElement>('[data-slot="sidebar-inner"]')!;

    expect(gap).toHaveStyle({width: "calc(var(--sidebar-width) + 1rem)"});
    expect(panel).toHaveClass("p-2");

    if (variant === "floating") {
      expect(inner).toHaveClass("rounded-xl", "border", "shadow-sm");
    } else {
      expect(inner).not.toHaveClass("rounded-xl");
    }
  });

  it("renders a static column when collapsing is disabled", () => {
    const {container, getByRole} = render(
      <SidebarProvider>
        <Sidebar aria-label="Static sidebar" collapsible="none">
          Static content
        </Sidebar>
      </SidebarProvider>,
    );

    expect(getByRole("complementary", {name: "Static sidebar"})).toHaveClass(
      "w-[var(--sidebar-width)]",
    );
    expect(container.querySelector('[data-slot="sidebar-gap"]')).not.toBeInTheDocument();
    expect(container.querySelector("[data-state]")).not.toBeInTheDocument();
  });

  it("opens the sidebar in a Sytech drawer on mobile", async () => {
    setMobile(true);
    const user = userEvent.setup();
    const {findByRole, getByRole} = render(<Layout />);

    await user.click(getByRole("button", {name: "Toggle sidebar"}));

    await waitFor(async () => {
      expect(await findByRole("complementary", {name: "Application sidebar"})).toBeVisible();
    });
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
});
