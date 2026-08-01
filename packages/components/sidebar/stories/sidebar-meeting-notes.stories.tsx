import type {Meta, StoryObj} from "@storybook/react";
import type {ReactNode} from "react";

import {Button} from "@sytechui/button";
import {expect, userEvent, waitFor, within} from "@storybook/test";
import {useEffect, useRef, useState} from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarMain,
  SidebarProvider,
  SidebarSubmenu,
  SidebarTrigger,
} from "../src";

const Icon = ({children, size = 18}: {children: ReactNode; size?: number}) => (
  <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size}>
    {children}
  </svg>
);

const WorkspaceMark = ({compact = false}: {compact?: boolean}) => (
  <span
    aria-hidden="true"
    className={`flex shrink-0 items-center justify-center rounded-md bg-foreground font-bold text-background ${
      compact ? "h-4 w-4 text-[6px]" : "h-8 w-8 text-[10px]"
    }`}
  >
    {"</>"}
  </span>
);

const WorkspaceMenuIcon = ({children}: {children: ReactNode}) => <Icon size={16}>{children}</Icon>;

const HomeIcon = () => (
  <Icon>
    <path
      d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </Icon>
);

const SharedIcon = () => (
  <Icon>
    <path
      d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5M13 14c3.8-.7 7.5 1.1 8.5 4.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  </Icon>
);

const ChatIcon = () => (
  <Icon>
    <path
      d="M20 11.5c0 4.1-3.6 7.5-8 7.5a9 9 0 0 1-3.2-.6L4 21l.9-4.3A7.2 7.2 0 0 1 4 11.5C4 7.4 7.6 4 12 4s8 3.4 8 7.5Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </Icon>
);

const LockIcon = () => (
  <Icon>
    <path
      d="M7 10V8a5 5 0 0 1 10 0v2m-11 0h12a1 1 0 0 1 1 1v8H5v-8a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </Icon>
);

const FileIcon = () => (
  <Icon>
    <path
      d="M7 3h7l4 4v14H7zM14 3v5h4M10 12h5m-5 4h5"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </Icon>
);

const SparkIcon = () => (
  <Icon>
    <path
      d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13Z"
      fill="currentColor"
    />
  </Icon>
);

const FolderPlusIcon = () => (
  <Icon>
    <path
      d="M3 6h7l2 2h9v11H3zM12 11v5m-2.5-2.5h5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </Icon>
);

const UtilityIcon = ({path}: {path: string}) => (
  <Icon>
    <path
      d={path}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </Icon>
);

const searchCompanies = [
  ["Acme Corp", "acme.com", "bg-danger"],
  ["Truewind", "truewind.com", "bg-primary"],
  ["Polaris", "polaris.io", "bg-success"],
  ["Vertix", "vertix.dev", "bg-secondary"],
  ["Orbitl", "orbitl.com", "bg-warning"],
] as const;

const SearchPalette = ({onClose}: {onClose: () => void}) => {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => searchRef.current?.focus(), []);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-overlay/50 px-4 pt-[14vh]">
      <button
        aria-label="Close command palette backdrop"
        className="absolute inset-0 cursor-default"
        type="button"
        onClick={onClose}
      />
      <section
        aria-label="Command palette"
        aria-modal="true"
        className="relative z-10 flex max-h-[28rem] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-content1 shadow-large"
        role="dialog"
      >
        <div className="flex items-center gap-3 border-b border-divider px-4 py-3">
          <input
            ref={searchRef}
            aria-label="Search commands"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-foreground-500"
            placeholder="Search people, folders, companies, or meetings"
            type="search"
          />
          <button
            aria-label="Close search"
            className="rounded-md bg-black/[0.07] px-2 py-1 text-xs text-foreground-600"
            type="button"
            onClick={onClose}
          >
            Esc
          </button>
        </div>
        <div className="overflow-y-auto px-3 py-2 text-sm">
          <p className="px-2 py-2 text-xs text-foreground-500">Folders</p>
          {[
            ["Personal", <FileIcon key="personal-icon" />],
            ["Design team", <SparkIcon key="design-icon" />],
          ].map(([label, icon]) => (
            <button
              key={label as string}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-black/[0.07]"
              type="button"
            >
              {icon}
              {label}
            </button>
          ))}
          <p className="px-2 py-2 text-xs text-foreground-500">Companies</p>
          {searchCompanies.map(([name, domain, color]) => (
            <button
              key={name}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-black/[0.07]"
              type="button"
            >
              <span className={`h-6 w-6 rounded-full ${color}`} />
              <span className="min-w-0 flex-1">{name}</span>
              <span className="text-foreground-500">{domain}</span>
            </button>
          ))}
          <p className="px-2 py-2 text-xs text-foreground-500">People</p>
          {[
            ["T", "Tom Rivera", "tom@truewind.com"],
            ["L", "Lena Kim", "lena@acme.com"],
          ].map(([initial, name, email]) => (
            <button
              key={email}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-black/[0.07]"
              type="button"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.07] font-medium">
                {initial}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block">{name}</span>
                <span className="block text-xs text-foreground-500">{email}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

const WorkspaceMenu = () => (
  <section
    aria-label="Sarah workspace menu"
    className="absolute bottom-14 left-3 right-3 z-20 overflow-hidden rounded-3xl bg-content1/75 p-1.5 text-sm shadow-large backdrop-blur-xl"
    role="dialog"
  >
    <div className="flex items-center gap-2 px-2 pb-2 pt-1.5">
      <WorkspaceMark />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">Sarah</span>
        <span className="block text-xs text-foreground-500">1 member</span>
      </span>
    </div>
    <button
      className="flex h-8 w-full items-center justify-center gap-2 rounded-md bg-black/[0.07] px-2"
      type="button"
    >
      <WorkspaceMenuIcon>
        <path
          d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5M13 14c3.8-.7 7.5 1.1 8.5 4.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </WorkspaceMenuIcon>
      Invite teammates
    </button>
    <div className="flex items-center gap-2 px-2 pb-1 pt-3 text-xs text-foreground-500">
      <span className="min-w-0 flex-1">sarah@acme.com</span>
      <WorkspaceMenuIcon>
        <path
          d="M20 7v5h-5M4 17v-5h5m10.5 0a7.5 7.5 0 0 0-13-4.8L4 10m16 4-2.5 2.8A7.5 7.5 0 0 1 4.5 12"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </WorkspaceMenuIcon>
    </div>
    <div role="menu">
      <div>
        <button
          className="flex h-9 w-full items-center gap-3 rounded-md px-2 text-left transition-colors hover:bg-black/[0.07]"
          role="menuitem"
          type="button"
        >
          <WorkspaceMark compact />
          <span className="min-w-0 flex-1">Sarah</span>
          <WorkspaceMenuIcon>
            <path
              d="m5 12 4 4L19 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </WorkspaceMenuIcon>
        </button>
        <button
          className="flex h-9 w-full items-center gap-3 rounded-md px-2 text-left transition-colors hover:bg-black/[0.07]"
          role="menuitem"
          type="button"
        >
          <WorkspaceMenuIcon>
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
          </WorkspaceMenuIcon>
          Add workspace
        </button>
      </div>
      <div className="mt-1 border-t border-divider pt-1">
        {[
          [
            "Manage templates",
            <WorkspaceMenuIcon key="templates-icon">
              <path
                d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
            </WorkspaceMenuIcon>,
          ],
          [
            "Get app for iPhone",
            <WorkspaceMenuIcon key="phone-icon">
              <path
                d="M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
              />
            </WorkspaceMenuIcon>,
          ],
          [
            "Help Center",
            <WorkspaceMenuIcon key="help-icon">
              <path
                d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.2-11a2.3 2.3 0 1 1 3.5 2c-1 .6-1.3 1.1-1.3 2m0 3h.01"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.7"
              />
            </WorkspaceMenuIcon>,
          ],
          [
            "Settings",
            <WorkspaceMenuIcon key="settings-icon">
              <path
                d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm7-3.2 2-1-2-3.5-2.2.7a8 8 0 0 0-1.5-.9L15 5h-4l-.4 2.3a8 8 0 0 0-1.5.9L7 7.5 5 11l2 1a8 8 0 0 0 0 1.9l-2 1 2 3.5 2.2-.7a8 8 0 0 0 1.5.9L11 21h4l.4-2.3a8 8 0 0 0 1.5-.9l2.2.7 2-3.5-2-1a8 8 0 0 0 0-2Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.4"
              />
            </WorkspaceMenuIcon>,
          ],
        ].map(([label, icon]) => (
          <button
            key={label as string}
            className="flex h-9 w-full items-center gap-3 rounded-md px-2 text-left transition-colors hover:bg-black/[0.07]"
            role="menuitem"
            type="button"
          >
            {icon}
            <span className="min-w-0 flex-1">{label}</span>
            {label === "Settings" && (
              <kbd className="rounded-md bg-black/[0.07] px-1.5 py-0.5 text-xs text-foreground-500">
                ⌘ ,
              </kbd>
            )}
          </button>
        ))}
      </div>
    </div>
  </section>
);

const MeetingNotesSidebar = ({onOpenSearch}: {onOpenSearch: () => void}) => {
  const [activeItem, setActiveItem] = useState("home");
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  return (
    <Sidebar
      aria-label="Meeting notes navigation"
      className="bg-content1/95 backdrop-blur-xl [&_[data-slot=control]:hover]:bg-black/[0.07] [&_[data-slot=control][data-active=true]]:bg-black/[0.07]"
      collapsible="offcanvas"
      width="240px"
    >
      <SidebarHeader className="border-b-0 bg-transparent px-3 pb-1 pt-3">
        <Button
          fullWidth
          aria-label="Search ⌘ K"
          className="h-9 justify-start gap-2 border border-divider bg-content1 px-2 text-foreground-500 shadow-small"
          radius="md"
          size="sm"
          variant="light"
          onPress={onOpenSearch}
        >
          <UtilityIcon path="m21 21-4.3-4.3m2.3-5.2A7.5 7.5 0 1 1 4 11.5a7.5 7.5 0 0 1 15 0Z" />
          <span className="min-w-0 flex-1 text-left">Search</span>
          <kbd aria-hidden="true" className="text-xs">
            ⌘ K
          </kbd>
        </Button>
      </SidebarHeader>

      <SidebarContent aria-label="Meeting notes menus" className="pt-1">
        <SidebarGroup className="mb-3">
          <SidebarItem
            icon={<HomeIcon />}
            isActive={activeItem === "home"}
            onPress={() => setActiveItem("home")}
          >
            Home
          </SidebarItem>
          <SidebarItem
            icon={<SharedIcon />}
            isActive={activeItem === "shared"}
            onPress={() => setActiveItem("shared")}
          >
            Shared with me
          </SidebarItem>
          <SidebarSubmenu defaultOpen icon={<ChatIcon />} label="Chat">
            {[
              ["call-prep", "Call Prep Notes for Upco...", "4m"],
              ["marketing", "Q2 Marketing Strategy", "12m"],
              ["migration", "Design System Migration", "1h"],
              ["retro", "Sprint Retro Action Items", "3h"],
            ].map(([id, label, time]) => (
              <SidebarItem
                key={id}
                badge={<span className="text-xs font-normal text-foreground-500">{time}</span>}
                isActive={activeItem === id}
                onPress={() => setActiveItem(id)}
              >
                {label}
              </SidebarItem>
            ))}
          </SidebarSubmenu>
        </SidebarGroup>

        <p className="px-2 py-1 text-xs text-foreground-500">Spaces</p>
        <SidebarGroup>
          <SidebarSubmenu defaultOpen icon={<LockIcon />} label="My notes">
            <SidebarItem
              icon={<FileIcon />}
              isActive={activeItem === "personal"}
              onPress={() => setActiveItem("personal")}
            >
              Personal
            </SidebarItem>
          </SidebarSubmenu>
          <SidebarItem
            icon={<SparkIcon />}
            isActive={activeItem === "design-team"}
            onPress={() => setActiveItem("design-team")}
          >
            Design team
          </SidebarItem>
          <SidebarItem isDisabled icon={<FolderPlusIcon />}>
            Add folder
          </SidebarItem>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="relative border-t-0 bg-transparent p-3 pt-1">
        {workspaceMenuOpen && <WorkspaceMenu />}
        <div className="flex items-center gap-1 pb-2">
          <Button isIconOnly aria-label="Notes" size="sm" variant="light">
            <UtilityIcon path="M5 3h11l3 3v15H5zM9 11h6m-6 4h6" />
          </Button>
          <Button isIconOnly aria-label="People" size="sm" variant="light">
            <UtilityIcon path="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9c0-4 3-6 7-6s7 2 7 6" />
          </Button>
          <Button isIconOnly aria-label="Teams" size="sm" variant="light">
            <SharedIcon />
          </Button>
        </div>
        <div className="mb-2 h-px bg-divider" />
        <Button
          fullWidth
          aria-expanded={workspaceMenuOpen}
          aria-label="Sarah"
          className="h-10 justify-start gap-2 px-0 data-[focus-visible=true]:outline-1 data-[focus-visible=true]:outline-offset-1"
          variant="light"
          onPress={() => setWorkspaceMenuOpen((open) => !open)}
        >
          <WorkspaceMark />
          <span className="min-w-0 flex-1 text-left">Sarah</span>
          <svg
            aria-hidden="true"
            className="text-foreground-500"
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
          >
            <path
              d="m5 6 3-3 3 3m0 4-3 3-3-3"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

const MeetingNotesDemo = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setSearchOpen(false);
    };

    window.addEventListener("keydown", handleShortcut);

    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#e7ecfa] text-foreground">
        <MeetingNotesSidebar onOpenSearch={() => setSearchOpen(true)} />
        <SidebarMain className="min-h-screen bg-gradient-to-br from-[#e6eafb] to-[#f5f7fc] p-6">
          <div className="flex items-center gap-3 text-sm">
            <SidebarTrigger />
            <HomeIcon />
            <span>Home</span>
          </div>
          <p className="mt-10 text-foreground-600">
            Meeting notes sidebar with search, spaces, and user menu. Uses offcanvas collapsible
            mode.
          </p>
        </SidebarMain>
        {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} />}
      </div>
    </SidebarProvider>
  );
};

const meta = {
  title: "Components/Sidebar/Meeting Notes",
  component: MeetingNotesDemo,
  parameters: {layout: "fullscreen"},
} satisfies Meta<typeof MeetingNotesDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeroUIProReplica: Story = {
  tags: ["sidebar-browser"],
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole("complementary", {name: "Meeting notes navigation"});

    expect(canvas.getByRole("button", {name: "Home"})).toHaveAttribute("data-active", "true");
    expect(canvas.getByRole("button", {name: "Call Prep Notes for Upco... 4m"})).toBeVisible();

    await userEvent.click(canvas.getByRole("button", {name: "Search ⌘ K"}));
    expect(canvas.getByRole("dialog", {name: "Command palette"})).toBeVisible();
    await userEvent.click(canvas.getByRole("button", {name: "Close search"}));

    await userEvent.click(canvas.getByRole("button", {name: "Sarah"}));
    expect(canvas.getByRole("dialog", {name: "Sarah workspace menu"})).toBeVisible();
    await userEvent.click(canvas.getByRole("button", {name: "Sarah"}));

    await userEvent.click(canvas.getByRole("button", {name: "Collapse sidebar"}));
    await waitFor(() => expect(sidebar).toHaveAttribute("data-state", "collapsed"));
    await userEvent.click(canvas.getByRole("button", {name: "Expand sidebar"}));
    await waitFor(() => expect(sidebar).toHaveAttribute("data-state", "expanded"));
  },
};
