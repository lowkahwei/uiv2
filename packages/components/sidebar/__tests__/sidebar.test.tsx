import "@testing-library/jest-dom";
import * as React from "react";
import {render, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarSubmenu,
  SidebarTrigger,
  useSidebar,
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

const SidebarLayout = () => (
  <Sidebar aria-label="Application sidebar">
    <SidebarHeader>
      <SidebarTrigger />
    </SidebarHeader>
    <SidebarContent aria-label="Primary">
      <SidebarGroup title="Main">
        <SidebarItem isActive href="/home" icon={<span aria-hidden="true">H</span>}>
          Home
        </SidebarItem>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>Account</SidebarFooter>
  </Sidebar>
);

describe("Sidebar", () => {
  beforeEach(() => setMobile(false));
  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: originalMatchMedia,
    });
  });

  it("renders semantic navigation and forwards its ref", () => {
    const ref = React.createRef<HTMLElement>();
    const {getByRole, getByText} = render(
      <SidebarProvider>
        <Sidebar ref={ref} aria-label="Application sidebar">
          <SidebarContent aria-label="Primary">
            <SidebarGroup title="Main">
              <SidebarItem isActive href="/home" icon={<span aria-hidden="true">H</span>}>
                Home
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>Account</SidebarFooter>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(getByRole("complementary", {name: "Application sidebar"})).toBe(ref.current);
    expect(getByRole("navigation", {name: "Primary"})).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
    expect(getByRole("link", {name: "Home"})).toHaveClass("gap-0");
    expect(getByRole("link", {name: "Home"})).toHaveAttribute("href", "/home");
    expect(getByRole("link", {name: "Home"})).toHaveAttribute("aria-current", "page");
    expect(getByText("Account")).toBeInTheDocument();
  });

  it("toggles the uncontrolled desktop state and notifies consumers", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const {getByRole} = render(
      <SidebarProvider onOpenChange={onOpenChange}>
        <SidebarLayout />
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "Collapse sidebar"}));

    expect(getByRole("complementary")).toHaveAttribute("data-state", "collapsed");
    expect(getByRole("button", {name: "Expand sidebar"})).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("persists the uncontrolled desktop state in a Cookie", async () => {
    const user = userEvent.setup();

    const {getByRole} = render(
      <SidebarProvider>
        <SidebarLayout />
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "Collapse sidebar"}));

    expect(document.cookie).toContain("sidebar_state=false");
  });

  it("supports a controlled desktop state", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    const {getByRole} = render(
      <SidebarProvider open onOpenChange={onOpenChange}>
        <SidebarLayout />
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "Collapse sidebar"}));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(getByRole("complementary")).toHaveAttribute("data-state", "expanded");
  });

  it("renders action items as buttons and respects disabled state", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    const {getByRole} = render(
      <SidebarProvider>
        <Sidebar aria-label="Application sidebar">
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem isDisabled icon={<span>H</span>} onPress={onPress}>
                Home
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "Home"}));

    expect(onPress).not.toHaveBeenCalled();
  });

  it("uses the supplied default state on the first render", () => {
    const {getByRole, queryByRole} = render(
      <SidebarProvider defaultOpen={false}>
        <SidebarLayout />
      </SidebarProvider>,
    );

    expect(getByRole("complementary")).toHaveAttribute("data-state", "collapsed");
    expect(getByRole("button", {name: "Expand sidebar"})).toBeInTheDocument();
    expect(queryByRole("heading", {name: "Main"})).not.toBeInTheDocument();
  });

  it("does not duplicate a compact badge in the accessible name", () => {
    const {getByRole} = render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar aria-label="Application sidebar">
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem badge={<span>4</span>} icon={<span>H</span>}>
                Home
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(getByRole("button", {name: "Home 4"})).toBeInTheDocument();
  });

  it("opens on mobile and closes after an item is selected", async () => {
    setMobile(true);
    const user = userEvent.setup();

    const {getByRole, queryByRole} = render(
      <SidebarProvider>
        <SidebarTrigger />
        <SidebarLayout />
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "Open sidebar"}));
    expect(getByRole("dialog")).toBeInTheDocument();
    expect(getByRole("button", {name: "Close sidebar"})).toBeInTheDocument();

    await user.click(getByRole("link", {name: "Home"}));

    await waitFor(() => expect(queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("can keep the mobile Drawer open after an item is selected", async () => {
    setMobile(true);
    const user = userEvent.setup();

    const {getByRole} = render(
      <SidebarProvider>
        <SidebarTrigger />
        <Sidebar aria-label="Application sidebar">
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem closeMobileOnAction={false}>Home</SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "Open sidebar"}));
    await user.click(getByRole("button", {name: "Home"}));

    expect(getByRole("dialog")).toBeInTheDocument();
  });

  it("exposes state through useSidebar", () => {
    function State() {
      const {state, open} = useSidebar();

      return <span>{`${state}:${open}`}</span>;
    }

    const {getByText} = render(
      <SidebarProvider defaultOpen={false}>
        <State />
      </SidebarProvider>,
    );

    expect(getByText("collapsed:false")).toBeInTheDocument();
  });

  it("exposes Sidebar layout props through useSidebar", () => {
    function Layout() {
      const {side, collapsible} = useSidebar();

      return <span>{`${side}:${collapsible}`}</span>;
    }

    const {getByText} = render(
      <SidebarProvider>
        <Sidebar side="right">
          <Layout />
        </Sidebar>
      </SidebarProvider>,
    );

    expect(getByText("right:icon")).toBeInTheDocument();
  });

  it("requires a provider", () => {
    expect(() => render(<Sidebar />)).toThrow("useSidebar must be used within a SidebarProvider.");
  });

  it("can disable Sidebar-owned transitions", () => {
    const {getByRole} = render(
      <SidebarProvider reduceMotion>
        <SidebarLayout />
      </SidebarProvider>,
    );

    const sidebar = getByRole("complementary");

    expect(sidebar).toHaveAttribute("data-reduce-motion", "true");
    expect(sidebar.parentElement).not.toHaveClass("transition-[width]");
  });

  it("treats a custom mobileBreakpoint as the mobile threshold", async () => {
    setMobile(true);
    const user = userEvent.setup();

    const {getByRole} = render(
      <SidebarProvider mobileBreakpoint={1024}>
        <SidebarTrigger />
        <SidebarLayout />
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "Open sidebar"}));
    expect(getByRole("dialog")).toBeInTheDocument();
  });

  it("forwards drawerProps to the mobile Drawer", async () => {
    setMobile(true);
    const user = userEvent.setup();
    const {getByRole} = render(
      <SidebarProvider>
        <SidebarTrigger />
        <Sidebar aria-label="Application sidebar" drawerProps={{placement: "right"}}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem icon={<span>H</span>}>Home</SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "Open sidebar"}));
    expect(getByRole("dialog")).toHaveAttribute("data-placement", "right");
  });

  it("disables the collapsed-state tooltip when tooltip is false", async () => {
    const user = userEvent.setup();
    const {getByRole, queryByRole} = render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar aria-label="Application sidebar">
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem icon={<span>H</span>} tooltip={false}>
                Home
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    await user.hover(getByRole("button", {name: "Home"}));
    expect(queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("renders a custom SidebarTrigger icon", () => {
    const {getByRole, queryByText} = render(
      <SidebarProvider>
        <SidebarTrigger>
          <span>Custom</span>
        </SidebarTrigger>
      </SidebarProvider>,
    );

    expect(getByRole("button")).toHaveTextContent("Custom");
    expect(queryByText("Custom")).toBeInTheDocument();
  });

  it("collapses to zero width when collapsible is offcanvas", () => {
    const {getByRole, queryByRole} = render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar aria-label="Application sidebar" collapsible="offcanvas">
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem icon={<span>H</span>}>Home</SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    const container = getByRole("complementary").parentElement;

    expect(container).toHaveStyle({width: "0px"});
    expect(queryByRole("button", {name: "Home"})).not.toBeInTheDocument();
  });

  it("ignores collapse state and renders statically when collapsible is none", () => {
    setMobile(true);
    const {getByRole, queryByRole} = render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar aria-label="Application sidebar" collapsible="none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem icon={<span>H</span>}>Home</SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(queryByRole("dialog")).not.toBeInTheDocument();
    expect(getByRole("complementary")).toBeInTheDocument();
  });

  it("docks to the right and flips the mobile Drawer placement", async () => {
    setMobile(true);
    const user = userEvent.setup();
    const {getByRole} = render(
      <SidebarProvider>
        <SidebarTrigger />
        <Sidebar aria-label="Application sidebar" side="right">
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem icon={<span>H</span>}>Home</SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "Open sidebar"}));
    expect(getByRole("dialog")).toHaveAttribute("data-placement", "right");
  });

  it("docks to the right on desktop", () => {
    const {getByRole} = render(
      <SidebarProvider>
        <Sidebar aria-label="Application sidebar" side="right">
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem icon={<span>H</span>}>Home</SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(getByRole("complementary")).toHaveAttribute("data-side", "right");
    expect(getByRole("complementary").parentElement).toHaveClass("right-0");
  });

  it("toggles the desktop state with the Cmd/Ctrl+B shortcut", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(
      <SidebarProvider onOpenChange={onOpenChange}>
        <SidebarLayout />
      </SidebarProvider>,
    );

    await user.keyboard("{Meta>}b{/Meta}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("supports a custom toggle shortcut", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(
      <SidebarProvider onOpenChange={onOpenChange} toggleShortcut="mod+shift+s">
        <SidebarLayout />
      </SidebarProvider>,
    );

    await user.keyboard("{Meta>}{Shift>}s{/Shift}{/Meta}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("can disable the toggle shortcut", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(
      <SidebarProvider onOpenChange={onOpenChange} toggleShortcut={false}>
        <SidebarLayout />
      </SidebarProvider>,
    );

    await user.keyboard("{Meta>}b{/Meta}");

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("shows the action slot on an item and keeps it clickable", async () => {
    const user = userEvent.setup();
    const onActionPress = jest.fn();
    const {getByRole} = render(
      <SidebarProvider>
        <Sidebar aria-label="Application sidebar">
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem
                action={
                  <button aria-label="More" type="button" onClick={onActionPress}>
                    …
                  </button>
                }
                icon={<span>H</span>}
              >
                Home
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "More"}));
    expect(onActionPress).toHaveBeenCalledTimes(1);
  });

  it("hides the action slot while the desktop sidebar is collapsed", () => {
    const {queryByRole} = render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar aria-label="Application sidebar">
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem action={<button type="button">More</button>} icon={<span>H</span>}>
                Home
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(queryByRole("button", {name: "More"})).not.toBeInTheDocument();
  });

  it("expands and collapses nested items in SidebarSubmenu", async () => {
    const user = userEvent.setup();
    const {getByRole, queryByRole} = render(
      <SidebarProvider>
        <Sidebar aria-label="Application sidebar">
          <SidebarContent>
            <SidebarGroup>
              <SidebarSubmenu icon={<span>S</span>} label="Settings">
                <SidebarItem href="/settings/profile">Profile</SidebarItem>
              </SidebarSubmenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(queryByRole("link", {name: "Profile"})).not.toBeInTheDocument();

    await user.click(getByRole("button", {name: "Settings"}));
    expect(getByRole("link", {name: "Profile"})).toBeInTheDocument();

    await user.click(getByRole("button", {name: "Settings"}));
    expect(queryByRole("link", {name: "Profile"})).not.toBeInTheDocument();
  });

  it("opens nested items in a flyout from the collapsed state", async () => {
    const user = userEvent.setup();
    const {getByRole, queryByRole} = render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar aria-label="Application sidebar">
          <SidebarContent>
            <SidebarGroup>
              <SidebarSubmenu icon={<span>S</span>} label="Settings">
                <SidebarItem href="/settings/profile">Profile</SidebarItem>
              </SidebarSubmenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );

    await user.click(getByRole("button", {name: "Settings"}));
    expect(getByRole("complementary")).toHaveAttribute("data-state", "collapsed");
    expect(getByRole("button", {name: "Settings"})).toHaveAttribute("aria-expanded", "true");
    expect(getByRole("link", {name: "Profile"})).toBeInTheDocument();

    await user.click(getByRole("link", {name: "Profile"}));
    await waitFor(() => expect(queryByRole("link", {name: "Profile"})).not.toBeInTheDocument());
  });
});
