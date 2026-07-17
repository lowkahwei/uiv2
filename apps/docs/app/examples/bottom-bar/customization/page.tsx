import {Badge, BottomBar, BottomBarItem} from "@sytechui/react";

const iconPaths = {
  home: "M3.5 10.8 12 3.7l8.5 7.1v8.5a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7v-8.5ZM9 21v-6h6v6",
  messages: "M4 5h16v11H8l-4 4V5Z",
  create: "M12 5v14M5 12h14",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7.5 9c.5-4.2 3.2-6.5 7.5-6.5s7 2.3 7.5 6.5",
};

function Icon({name, selected = false}: {name: keyof typeof iconPaths; selected?: boolean}) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={selected ? 2.5 : 1.8}
      viewBox="0 0 24 24"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

export default function Page() {
  return (
    <BottomBar
      aria-label="Primary navigation"
      classNames={{
        label: "font-semibold tracking-wide",
        list: "max-w-sm border-secondary/30",
        selectionIndicator: "bg-secondary/20",
      }}
      color="secondary"
      defaultSelectedKey="messages"
    >
      <BottomBarItem key="home" href="#home" icon={<Icon name="home" />}>
        Home
      </BottomBarItem>
      <BottomBarItem
        key="messages"
        href="#messages"
        icon={
          <Badge color="danger" content="3" size="sm">
            <Icon name="messages" />
          </Badge>
        }
        selectedIcon={
          <Badge color="danger" content="3" size="sm">
            <Icon selected name="messages" />
          </Badge>
        }
      >
        Messages
      </BottomBarItem>
      <BottomBarItem key="create" isProminent href="#create" icon={<Icon name="create" />}>
        Create
      </BottomBarItem>
      <BottomBarItem key="profile" href="#profile" icon={<Icon name="profile" />}>
        Profile
      </BottomBarItem>
    </BottomBar>
  );
}
