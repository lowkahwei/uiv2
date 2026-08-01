import type {Meta} from "@storybook/react";
import type {SidebarProps} from "../src";

import {Button} from "@sytechui/button";
import React, {useState} from "react";
import {expect, userEvent, waitFor, within} from "@storybook/test";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarSubmenu,
  SidebarTrigger,
  useSidebar,
} from "../src";

const Icon = () => (
  <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
    <path
      d="M5 12h14M12 5l7 7-7 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const SidebarBrand = () => {
  const {state, isMobile} = useSidebar();

  if (!isMobile && state === "collapsed") {
    return (
      <div className="flex min-h-8 justify-center">
        <SidebarTrigger />
      </div>
    );
  }

  return (
    <div className="flex min-h-8 items-center gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
        S
      </span>
      <span className="min-w-0 flex-1 truncate font-bold">Workspace</span>
      {!isMobile && <SidebarTrigger />}
    </div>
  );
};

const SidebarContents = () => (
  <>
    <SidebarHeader>
      <SidebarBrand />
    </SidebarHeader>
    <SidebarContent aria-label="Primary">
      <SidebarGroup title="Overview">
        <SidebarItem isActive href="#dashboard" icon={<Icon />}>
          Dashboard
        </SidebarItem>
        <SidebarItem
          badge={<span className="text-xs">4</span>}
          href="#activity"
          icon={<Icon />}
          tooltipProps={{delay: 500, placement: "bottom"}}
        >
          Activity
        </SidebarItem>
      </SidebarGroup>
      <SidebarSeparator />
      <SidebarGroup title="Manage">
        <SidebarItem href="#projects" icon={<Icon />}>
          Projects
        </SidebarItem>
        <SidebarItem href="#settings" icon={<Icon />}>
          Settings
        </SidebarItem>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarGroup className="mb-0">
        {/* tooltip={false} skips the collapsed-state label tooltip for this item. */}
        <SidebarItem href="#account" icon={<Icon />} tooltip={false}>
          Account
        </SidebarItem>
      </SidebarGroup>
    </SidebarFooter>
  </>
);

const MobileTrigger = ({children}: {children?: React.ReactNode}) => {
  const {isMobile} = useSidebar();

  return isMobile ? <SidebarTrigger className="mb-6">{children}</SidebarTrigger> : null;
};

const OffcanvasTrigger = () => {
  const {state, isMobile} = useSidebar();

  return state === "collapsed" || isMobile ? <SidebarTrigger className="mb-6" /> : null;
};

const SidebarDemo = ({defaultOpen = true, ...props}: SidebarProps & {defaultOpen?: boolean}) => (
  <SidebarProvider defaultOpen={defaultOpen}>
    <div className="flex min-h-screen">
      <Sidebar {...props} aria-label="Application sidebar">
        <SidebarContents />
      </Sidebar>
      <main className="min-w-0 flex-1 p-8">
        {/* children override the built-in trigger icon. */}
        <MobileTrigger>
          <Icon />
        </MobileTrigger>
        <h1 className="text-2xl font-bold">Content area</h1>
        <p className="mt-2 text-foreground-600">
          Resize the viewport or collapse the sidebar to explore it.
        </p>
      </main>
    </div>
  </SidebarProvider>
);

const ControlledDemo = (props: SidebarProps) => {
  const [open, setOpen] = useState(true);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="flex min-h-screen">
        <Sidebar {...props} aria-label="Application sidebar">
          <SidebarContents />
        </Sidebar>
        <main className="min-w-0 flex-1 p-8">
          <MobileTrigger />
          <p>Desktop state is controlled by the application.</p>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {layout: "fullscreen"},
  argTypes: {
    width: {control: "text"},
    collapsedWidth: {control: "text"},
  },
} satisfies Meta<typeof Sidebar>;

export const Default = {
  tags: ["sidebar-browser"],
  render: (args: SidebarProps) => <SidebarDemo {...args} />,
  play: async ({canvasElement}: {canvasElement: HTMLElement}) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole("complementary", {name: "Application sidebar"});

    expect(sidebar).toHaveAttribute("data-state", "expanded");

    await userEvent.keyboard("{Meta>}b{/Meta}");
    await waitFor(() => expect(sidebar).toHaveAttribute("data-state", "collapsed"));

    await userEvent.click(canvas.getByRole("button", {name: "Expand sidebar"}));
  },
};

export const Collapsed = {
  render: (args: SidebarProps) => <SidebarDemo {...args} defaultOpen={false} />,
};

export const Controlled = {
  render: (args: SidebarProps) => <ControlledDemo {...args} />,
};

export const Mobile = {
  parameters: {viewport: {defaultViewport: "mobile1"}},
  render: (args: SidebarProps) => <SidebarDemo {...args} />,
};

const CustomBreakpointDemo = (props: SidebarProps) => (
  <SidebarProvider mobileBreakpoint={1024}>
    <div className="flex min-h-screen">
      <Sidebar {...props} aria-label="Application sidebar">
        <SidebarContents />
      </Sidebar>
      <main className="min-w-0 flex-1 p-8">
        <MobileTrigger />
        <p>Switches to the mobile Drawer below 1024px instead of the default 767px.</p>
      </main>
    </div>
  </SidebarProvider>
);

export const CustomMobileBreakpoint = {
  parameters: {viewport: {defaultViewport: "tablet"}},
  render: (args: SidebarProps) => <CustomBreakpointDemo {...args} />,
};

export const CustomDrawer = {
  parameters: {viewport: {defaultViewport: "mobile1"}},
  render: (args: SidebarProps) => (
    <SidebarDemo {...args} drawerProps={{placement: "right", backdrop: "opaque"}} />
  ),
};

const MoreIcon = () => (
  <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
    <circle cx="12" cy="5" fill="currentColor" r="1.5" />
    <circle cx="12" cy="12" fill="currentColor" r="1.5" />
    <circle cx="12" cy="19" fill="currentColor" r="1.5" />
  </svg>
);

const RightSideDemo = (props: SidebarProps) => (
  <SidebarProvider>
    <div className="flex min-h-screen">
      <main className="min-w-0 flex-1 p-8">
        <MobileTrigger />
        <h1 className="text-2xl font-bold">Content area</h1>
        <p className="mt-2 text-foreground-600">The sidebar docks to the right edge.</p>
      </main>
      <Sidebar {...props} aria-label="Application sidebar" side="right">
        <SidebarContents />
      </Sidebar>
    </div>
  </SidebarProvider>
);

export const RightSide = {
  tags: ["sidebar-browser"],
  render: (args: SidebarProps) => <RightSideDemo {...args} />,
  play: async ({canvasElement}: {canvasElement: HTMLElement}) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole("complementary", {name: "Application sidebar"});

    expect(sidebar).toHaveAttribute("data-side", "right");
    expect(sidebar.parentElement).toHaveClass("right-0");
  },
};

const OffcanvasDemo = (props: SidebarProps) => (
  <SidebarProvider defaultOpen={false}>
    <div className="flex min-h-screen">
      <Sidebar {...props} aria-label="Application sidebar" collapsible="offcanvas">
        <SidebarContents />
      </Sidebar>
      <main className="min-w-0 flex-1 p-8">
        <OffcanvasTrigger />
        <h1 className="text-2xl font-bold">Content area</h1>
        <p className="mt-2 text-foreground-600">
          Collapsing hides the sidebar entirely instead of showing an icon rail.
        </p>
      </main>
    </div>
  </SidebarProvider>
);

export const OffcanvasCollapsed = {
  tags: ["sidebar-browser"],
  render: (args: SidebarProps) => <OffcanvasDemo {...args} />,
  play: async ({canvasElement}: {canvasElement: HTMLElement}) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole("complementary", {name: "Application sidebar"});

    await waitFor(() => expect(sidebar.parentElement).toHaveStyle({width: "0px"}));

    const main = within(canvas.getByRole("main"));

    await userEvent.click(main.getByRole("button", {name: "Expand sidebar"}));
    await waitFor(() => expect(sidebar.parentElement).not.toHaveStyle({width: "0px"}));

    await userEvent.click(within(sidebar).getByRole("button", {name: "Collapse sidebar"}));
  },
};

const NonCollapsibleDemo = (props: SidebarProps) => (
  <SidebarProvider>
    <div className="flex min-h-screen">
      <Sidebar {...props} aria-label="Application sidebar" collapsible="none">
        <SidebarContents />
      </Sidebar>
      <main className="min-w-0 flex-1 p-8">
        <h1 className="text-2xl font-bold">Content area</h1>
        <p className="mt-2 text-foreground-600">
          {'collapsible="none" renders a static column; there is nothing to toggle.'}
        </p>
      </main>
    </div>
  </SidebarProvider>
);

export const NonCollapsible = {
  render: (args: SidebarProps) => <NonCollapsibleDemo {...args} />,
};

const SidebarContentsWithActions = () => (
  <>
    <SidebarHeader>
      <SidebarBrand />
    </SidebarHeader>
    <SidebarContent aria-label="Primary">
      <SidebarGroup title="Overview">
        <SidebarItem
          isActive
          action={
            <Button isIconOnly aria-label="More actions" size="sm" variant="light">
              <MoreIcon />
            </Button>
          }
          href="#dashboard"
          icon={<Icon />}
        >
          Dashboard
        </SidebarItem>
        <SidebarItem
          action={
            <Button isIconOnly aria-label="More actions" size="sm" variant="light">
              <MoreIcon />
            </Button>
          }
          href="#activity"
          icon={<Icon />}
        >
          Activity
        </SidebarItem>
      </SidebarGroup>
    </SidebarContent>
  </>
);

const ItemActionsDemo = (props: SidebarProps) => (
  <SidebarProvider>
    <div className="flex min-h-screen">
      <Sidebar {...props} aria-label="Application sidebar">
        <SidebarContentsWithActions />
      </Sidebar>
      <main className="min-w-0 flex-1 p-8">
        <MobileTrigger />
        <p className="text-foreground-500">Hover or focus an item to reveal its action button.</p>
      </main>
    </div>
  </SidebarProvider>
);

export const WithItemActions = {
  render: (args: SidebarProps) => <ItemActionsDemo {...args} />,
};

const SidebarContentsWithNested = () => (
  <>
    <SidebarHeader>
      <SidebarBrand />
    </SidebarHeader>
    <SidebarContent aria-label="Primary">
      <SidebarGroup title="Overview">
        <SidebarItem isActive href="#dashboard" icon={<Icon />}>
          Dashboard
        </SidebarItem>
        <SidebarSubmenu icon={<Icon />} label="Settings">
          <SidebarItem href="#settings-profile">Profile</SidebarItem>
          <SidebarItem href="#settings-billing">Billing</SidebarItem>
        </SidebarSubmenu>
      </SidebarGroup>
    </SidebarContent>
  </>
);

const NestedItemsDemo = (props: SidebarProps) => (
  <SidebarProvider>
    <div className="flex min-h-screen">
      <Sidebar {...props} aria-label="Application sidebar">
        <SidebarContentsWithNested />
      </Sidebar>
      <main className="min-w-0 flex-1 p-8">
        <MobileTrigger />
        <p className="text-foreground-500">
          Click Settings to expand or collapse its nested items.
        </p>
      </main>
    </div>
  </SidebarProvider>
);

export const WithNestedItems = {
  tags: ["sidebar-browser"],
  render: (args: SidebarProps) => <NestedItemsDemo {...args} />,
  play: async ({canvasElement}: {canvasElement: HTMLElement}) => {
    const canvas = within(canvasElement);

    expect(canvas.queryByRole("link", {name: "Profile"})).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", {name: "Settings"}));
    await waitFor(() => {
      expect(canvas.getByRole("link", {name: "Profile"})).toBeInTheDocument();
    });

    await userEvent.click(canvas.getByRole("button", {name: "Settings"}));
    await waitFor(() => {
      expect(canvas.queryByRole("link", {name: "Profile"})).not.toBeInTheDocument();
    });
  },
};

const ScrollableContentDemo = (props: SidebarProps) => (
  <SidebarProvider>
    <div className="flex h-screen">
      <Sidebar {...props} aria-label="Scrollable sidebar">
        <SidebarHeader>
          <SidebarBrand />
        </SidebarHeader>
        <SidebarContent aria-label="Thirty destinations">
          <SidebarGroup title="Destinations">
            {Array.from({length: 30}, (_, index) => (
              <SidebarItem key={index} href={`#destination-${index + 1}`} icon={<Icon />}>
                Destination {index + 1}
              </SidebarItem>
            ))}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="min-w-0 flex-1 p-8">Scroll the sidebar to see both edge shadows.</main>
    </div>
  </SidebarProvider>
);

export const ScrollableContent = {
  render: (args: SidebarProps) => <ScrollableContentDemo {...args} />,
};
