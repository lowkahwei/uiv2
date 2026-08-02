import type {Meta, StoryObj} from "@storybook/react";
import type {ReactNode} from "react";
import type {SidebarProps, SidebarProviderProps} from "../src";

import {useState} from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
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

const Icon = ({children}: {children: ReactNode}) => (
  <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
    {children}
  </svg>
);

const WorkspaceIcon = () => (
  <Icon>
    <rect height="7" rx="1" stroke="currentColor" strokeWidth="1.8" width="10" x="7" y="3" />
    <rect height="7" rx="1" stroke="currentColor" strokeWidth="1.8" width="14" x="5" y="14" />
  </Icon>
);

const PlaygroundIcon = () => (
  <Icon>
    <rect height="14" rx="2" stroke="currentColor" strokeWidth="1.8" width="14" x="5" y="5" />
    <path
      d="m9 10 2 2-2 2m4 0h2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </Icon>
);

const BotIcon = () => (
  <Icon>
    <path
      d="M12 3v3M8 3h8M7 8h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <path d="M9 13h.01M15 13h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
  </Icon>
);

const BookIcon = () => (
  <Icon>
    <path
      d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </Icon>
);

const SettingsIcon = () => (
  <Icon>
    <path
      d="M4 7h9M17 7h3M4 17h3M11 17h9M13 4v6M9 14v6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  </Icon>
);

const ProjectIcon = ({kind}: {kind: "frame" | "chart" | "map"}) => (
  <Icon>
    {kind === "frame" && (
      <path
        d="M5 5h14v14H5zM5 9h14M9 5v14"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    )}
    {kind === "chart" && (
      <path
        d="M5 19V9m5 10V5m5 14v-7m5 7V8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    )}
    {kind === "map" && (
      <path
        d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2V6Zm5-2v14m6-12v14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    )}
  </Icon>
);

const ChevronsIcon = () => (
  <svg aria-hidden="true" className="ml-auto size-4 shrink-0" fill="none" viewBox="0 0 24 24">
    <path
      d="m8 9 4-4 4 4M16 15l-4 4-4-4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const MoreIcon = () => (
  <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
);

const navItems = [
  {
    title: "Playground",
    icon: <PlaygroundIcon />,
    items: ["History", "Starred", "Settings"],
  },
  {title: "Models", icon: <BotIcon />, items: ["Genesis", "Explorer", "Quantum"]},
  {
    title: "Documentation",
    icon: <BookIcon />,
    items: ["Introduction", "Get Started", "Tutorials", "Changelog"],
  },
  {title: "Settings", icon: <SettingsIcon />, items: ["General", "Team", "Billing", "Limits"]},
];

const projects = [
  {name: "Design Engineering", kind: "frame" as const},
  {name: "Sales & Marketing", kind: "chart" as const},
  {name: "Travel", kind: "map" as const},
];

const AppSidebar = () => {
  return (
    <Sidebar aria-label="Application sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Acme Inc">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <WorkspaceIcon />
              </span>
              <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs text-foreground-500">Enterprise</span>
              </span>
              <span>
                <ChevronsIcon />
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  expandable
                  defaultExpanded={item.title === "Playground"}
                >
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem}>
                        <SidebarMenuSubButton
                          href={`#${subItem.toLowerCase().replaceAll(" ", "-")}`}
                        >
                          <span>{subItem}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]/sidebar:hidden">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.name}>
                  <SidebarMenuButton href={`#${project.name.toLowerCase().replaceAll(" ", "-")}`}>
                    <ProjectIcon kind={project.kind} />
                    <span>{project.name}</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction showOnHover aria-label={`More actions for ${project.name}`}>
                    <MoreIcon />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MoreIcon />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Account">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-400 via-orange-300 to-sky-500 text-xs font-semibold text-zinc-950">
                CN
              </span>
              <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">shadcn</span>
                <span className="truncate text-xs text-foreground-500">m@example.com</span>
              </span>
              <span>
                <ChevronsIcon />
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

const SidebarDemo = ({defaultOpen = true}: {defaultOpen?: boolean}) => (
  <SidebarProvider collapsible="icon" defaultOpen={defaultOpen}>
    <AppSidebar />
    <SidebarInset>
      <div className="p-4">
        <SidebarTrigger />
      </div>
    </SidebarInset>
  </SidebarProvider>
);

const meta = {
  title: "Components/Sidebar Rebuild",
  component: Sidebar,
  parameters: {layout: "fullscreen"},
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  tags: ["sidebar-browser", "sidebar-rebuild-browser"],
  render: () => <SidebarDemo />,
};

export const Collapsed: Story = {
  render: () => <SidebarDemo defaultOpen={false} />,
};

const ScenarioSidebar = () => (
  <>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip="Workspace">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
              S
            </span>
            <span className="truncate font-bold">Workspace</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Overview</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive href="#dashboard" tooltip="Dashboard">
                <PlaygroundIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#activity" tooltip="Activity">
                <BotIcon />
                <span>Activity</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>4</SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarSeparator />
      <SidebarGroup>
        <SidebarGroupLabel>Manage</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#projects" tooltip="Projects">
                <BookIcon />
                <span>Projects</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#settings" tooltip="Settings">
                <SettingsIcon />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton href="#account">
            <SettingsIcon />
            <span>Account</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </>
);

interface ScenarioDemoProps {
  providerProps?: Omit<SidebarProviderProps, "children">;
  sidebarProps?: SidebarProps;
  note?: string;
  children?: ReactNode;
}

const ScenarioDemo = ({providerProps, sidebarProps, note, children}: ScenarioDemoProps) => {
  const inset = (
    <SidebarInset>
      <div className="p-6">
        <SidebarTrigger />
        <h1 className="mt-4 text-2xl font-bold">Content area</h1>
        {note != null && <p className="mt-2 text-foreground-600">{note}</p>}
      </div>
    </SidebarInset>
  );

  return (
    <SidebarProvider {...providerProps}>
      {providerProps?.side === "right" && inset}
      <Sidebar aria-label="Application sidebar" {...sidebarProps}>
        {children ?? <ScenarioSidebar />}
      </Sidebar>
      {providerProps?.side !== "right" && inset}
    </SidebarProvider>
  );
};

const ControlledDemo = () => {
  const [open, setOpen] = useState(true);

  return (
    <ScenarioDemo
      note="Desktop state is controlled by the application."
      providerProps={{open, onOpenChange: setOpen}}
    />
  );
};

export const Controlled: Story = {render: () => <ControlledDemo />};

export const Mobile: Story = {
  parameters: {viewport: {defaultViewport: "mobile1"}},
  render: () => <ScenarioDemo note="Open the sidebar with the trigger; it renders as a Drawer." />,
};

export const CustomMobileBreakpoint: Story = {
  parameters: {viewport: {defaultViewport: "tablet"}},
  render: () => (
    <ScenarioDemo
      note="Switches to the mobile Drawer below 1024px instead of the default 767px."
      providerProps={{mobileBreakpoint: 1024}}
    />
  ),
};

export const CollapseBreakpoint: Story = {
  render: () => (
    <ScenarioDemo
      note="Below 1024px the sidebar auto-collapses to icons; below 767px it becomes a Drawer."
      providerProps={{collapseBreakpoint: 1024, collapsible: "icon"}}
    />
  ),
};

export const CustomDrawer: Story = {
  parameters: {viewport: {defaultViewport: "mobile1"}},
  render: () => (
    <ScenarioDemo
      note="The mobile Drawer opens from the right with an opaque backdrop."
      sidebarProps={{drawerProps: {placement: "right", backdrop: "opaque"}}}
    />
  ),
};

export const RightSide: Story = {
  render: () => (
    <ScenarioDemo note="The sidebar docks to the right edge." providerProps={{side: "right"}} />
  ),
};

export const Offcanvas: Story = {
  render: () => (
    <ScenarioDemo
      note="Collapsing hides the sidebar entirely instead of leaving an icon rail."
      providerProps={{collapsible: "offcanvas", defaultOpen: false}}
    />
  ),
};

export const NonCollapsible: Story = {
  render: () => (
    <ScenarioDemo
      note='collapsible="none" renders a static column; there is nothing to toggle.'
      providerProps={{collapsible: "none"}}
    />
  ),
};

const ItemActionsNav = () => (
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Overview</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {["Dashboard", "Activity"].map((label) => (
            <SidebarMenuItem key={label}>
              <SidebarMenuButton href={`#${label.toLowerCase()}`} isActive={label === "Dashboard"}>
                <PlaygroundIcon />
                <span>{label}</span>
              </SidebarMenuButton>
              <SidebarMenuAction showOnHover aria-label={`More actions for ${label}`}>
                <MoreIcon />
              </SidebarMenuAction>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
);

export const WithItemActions: Story = {
  render: () => (
    <ScenarioDemo note="Hover or focus an item to reveal its action button.">
      <ItemActionsNav />
    </ScenarioDemo>
  ),
};

const NestedNav = () => (
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Overview</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive href="#dashboard">
              <PlaygroundIcon />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem expandable>
            <SidebarMenuButton>
              <SettingsIcon />
              <span>Settings</span>
            </SidebarMenuButton>
            <SidebarMenuSub>
              {["Profile", "Billing"].map((label) => (
                <SidebarMenuSubItem key={label}>
                  <SidebarMenuSubButton href={`#settings-${label.toLowerCase()}`}>
                    <span>{label}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
);

export const WithNestedItems: Story = {
  render: () => (
    <ScenarioDemo note="Click Settings to expand or collapse its nested items.">
      <NestedNav />
    </ScenarioDemo>
  ),
};

const ScrollableNav = () => (
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Destinations</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {Array.from({length: 30}, (_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton href={`#destination-${index + 1}`}>
                <BookIcon />
                <span>Destination {index + 1}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
);

export const ScrollableContent: Story = {
  render: () => (
    <ScenarioDemo note="The content area scrolls independently of the header and footer.">
      <ScrollableNav />
    </ScenarioDemo>
  ),
};

const DisableAnimationDemo = () => {
  const [disableAnimation, setDisableAnimation] = useState(false);

  return (
    <SidebarProvider disableAnimation={disableAnimation}>
      <Sidebar aria-label="Application sidebar">
        <ScenarioSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="p-6">
          <SidebarTrigger />
          <label className="mt-4 flex items-center gap-2">
            <input
              checked={disableAnimation}
              type="checkbox"
              onChange={(event) => setDisableAnimation(event.target.checked)}
            />
            Disable sidebar transitions
          </label>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export const DisableAnimation: Story = {render: () => <DisableAnimationDemo />};

export const CustomShortcut: Story = {
  render: () => (
    <ScenarioDemo
      note="Press Cmd/Ctrl+Shift+S to toggle the sidebar."
      providerProps={{toggleShortcut: "mod+shift+s"}}
    />
  ),
};

const PersistentMobileNav = () => (
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton closeMobileOnPress={false} href="#choose">
              <BotIcon />
              <span>Choose workspace (stays open)</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#navigate">
              <BookIcon />
              <span>Navigate (closes)</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
);

export const PersistentMobileAction: Story = {
  parameters: {viewport: {defaultViewport: "mobile1"}},
  render: () => (
    <ScenarioDemo note="Open the drawer: the first item keeps it open, the second closes it.">
      <PersistentMobileNav />
    </ScenarioDemo>
  ),
};

export const FloatingVariant: Story = {
  render: () => (
    <ScenarioDemo
      note="The floating variant detaches from the edge with rounded corners and a shadow."
      providerProps={{className: "bg-content2", variant: "floating"}}
    />
  ),
};

export const InsetVariant: Story = {
  render: () => (
    <ScenarioDemo
      note="The inset variant blends into the page background."
      providerProps={{className: "bg-content2", variant: "inset"}}
    />
  ),
};
