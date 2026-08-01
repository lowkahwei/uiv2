import type {Meta, StoryObj} from "@storybook/react";

import {expect, userEvent, waitFor, within} from "@storybook/test";
import {useState} from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarMain,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "../src";

const NavIcon = ({path}: {path: string}) => (
  <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
    <path
      d={path}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const groups = [
  {
    title: "Admin",
    items: [
      {
        id: "management",
        label: "Management",
        icon: <NavIcon path="M4 6h16M4 12h16M4 18h16" />,
      },
    ],
  },
  {
    title: "Main",
    items: [
      {
        id: "example",
        label: "Example",
        icon: <NavIcon path="M5 5h14v14H5zM9 9h6v6H9z" />,
      },
    ],
  },
  {
    title: "Security",
    items: [
      {
        id: "sessions",
        label: "Sessions",
        icon: <NavIcon path="M4 7h16v10H4zM8 20h8" />,
        badge: "3",
      },
      {
        id: "audit",
        label: "Audit",
        icon: <NavIcon path="M6 4h12v16H6zM9 9h6M9 13h6" />,
      },
    ],
  },
];

const SidebarBrand = () => {
  const {isMobile} = useSidebar();

  return (
    <div className="flex min-h-9 items-center overflow-hidden">
      <span className="min-w-0 flex-1 truncate whitespace-nowrap font-bold">Lend System</span>
      {!isMobile && <SidebarTrigger />}
    </div>
  );
};

const WorkspaceSelector = () => (
  <div className="overflow-hidden px-3 py-2">
    <div className="flex h-10 w-full items-center overflow-hidden rounded-md bg-content2 text-left text-sm">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
        <span className="flex h-6 w-6 items-center justify-center rounded bg-primary font-bold text-primary-foreground">
          D
        </span>
      </span>
      <span className="min-w-0 flex-1 truncate whitespace-nowrap pr-3">Default Workspace</span>
    </div>
  </div>
);

const Account = () => (
  <div className="flex w-full items-center overflow-hidden rounded-md text-left">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-default font-bold">
      JD
    </span>
    <span className="min-w-0 flex-1 whitespace-nowrap pl-2">
      <span className="block truncate text-sm font-medium">Jane Doe</span>
      <span className="block truncate text-xs text-foreground-500">jane@example.com</span>
    </span>
  </div>
);

const AppTemplateShell = ({defaultOpen = true}: {defaultOpen?: boolean}) => {
  const [activeItem, setActiveItem] = useState("management");

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar aria-label="Lend System navigation">
          <SidebarHeader>
            <SidebarBrand />
          </SidebarHeader>
          <WorkspaceSelector />
          <SidebarContent aria-label="Primary navigation">
            {groups.map((group) => (
              <SidebarGroup key={group.title} title={group.title}>
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.id}
                    badge={item.badge && <span className="text-xs">{item.badge}</span>}
                    icon={item.icon}
                    isActive={activeItem === item.id}
                    onPress={() => setActiveItem(item.id)}
                  >
                    {item.label}
                  </SidebarItem>
                ))}
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter>
            <Account />
          </SidebarFooter>
        </Sidebar>

        <SidebarMain className="flex flex-col">
          <header className="flex h-12 items-center border-b border-divider px-4">
            <SidebarTrigger className="md:hidden" label="Open navigation" />
            <span className="ml-auto text-sm text-foreground-600">Theme · Language</span>
          </header>
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold">
              {groups.flatMap((group) => group.items).find((item) => item.id === activeItem)?.label}
            </h1>
            <p className="mt-2 text-foreground-600">
              This story mirrors the app template shell while using only the public Sidebar API.
            </p>
          </div>
        </SidebarMain>
      </div>
    </SidebarProvider>
  );
};

const meta = {
  title: "Components/Sidebar/App Template",
  component: AppTemplateShell,
  parameters: {layout: "fullscreen"},
} satisfies Meta<typeof AppTemplateShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  tags: ["sidebar-browser"],
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole("complementary", {name: "Lend System navigation"});
    const management = canvas.getByRole("button", {name: "Management"});

    await waitFor(() => {
      expect(Math.abs(centerX(management) - centerX(sidebar))).toBeLessThan(1);
    });

    await userEvent.click(canvas.getByRole("button", {name: "Collapse sidebar"}));

    await waitFor(() => {
      expect(sidebar).toHaveAttribute("data-state", "collapsed");
      const icon = management.querySelector<HTMLElement>('[data-slot="icon"]')!;

      expect(Math.abs(centerX(management) - centerX(sidebar))).toBeLessThan(1);
      expect(Math.abs(centerX(icon) - centerX(sidebar))).toBeLessThan(1);
    });

    await userEvent.click(canvas.getByRole("button", {name: "Expand sidebar"}));
  },
};

export const Collapsed: Story = {
  args: {defaultOpen: false},
};

export const Mobile: Story = {
  parameters: {viewport: {defaultViewport: "mobile1"}},
};

const centerX = (element: Element) => {
  const {left, width} = element.getBoundingClientRect();

  return left + width / 2;
};
