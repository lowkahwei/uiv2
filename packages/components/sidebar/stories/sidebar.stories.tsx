import type {Meta, StoryObj} from "@storybook/react";
import type {ReactNode} from "react";

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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
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

const ChevronRightIcon = ({open = false}: {open?: boolean}) => (
  <svg
    aria-hidden="true"
    className={`ml-auto size-4 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      d="m9 18 6-6-6-6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
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
  const [openItem, setOpenItem] = useState("Playground");

  return (
    <Sidebar aria-label="Application sidebar" collapsible="icon">
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
              {navItems.map((item) => {
                const isOpen = openItem === item.title;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onPress={() => setOpenItem(isOpen ? "" : item.title)}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                      <span className="ml-auto">
                        <ChevronRightIcon open={isOpen} />
                      </span>
                    </SidebarMenuButton>
                    {isOpen && (
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
                    )}
                  </SidebarMenuItem>
                );
              })}
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
  <SidebarProvider defaultOpen={defaultOpen}>
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
