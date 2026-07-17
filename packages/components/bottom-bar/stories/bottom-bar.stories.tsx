import type {Meta, StoryObj} from "@storybook/react";
import type {BottomBarItemProps, BottomBarProps} from "../src";

import React from "react";

import {BottomBar, BottomBarItem} from "../src";

type DemoIconProps = {
  selected?: boolean;
};

type DemoItem = {
  icon: React.ReactElement;
  key: React.Key;
  label: string;
  selectedIcon: React.ReactElement;
};

const HomeIcon = ({selected}: DemoIconProps) => (
  <svg aria-hidden="true" fill={selected ? "currentColor" : "none"} viewBox="0 0 24 24">
    <path
      d="M3.5 10.8 12 3.7l8.5 7.1v8.5a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7v-8.5Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={selected ? 2.2 : 1.8}
    />
    <path d="M9 21v-6h6v6" fill="none" stroke="currentColor" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = ({selected}: DemoIconProps) => (
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
    {selected && <circle cx="10.5" cy="10.5" fill="currentColor" opacity=".16" r="7" />}
    <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth={selected ? 2.6 : 1.8} />
    <path
      d="m15.5 15.5 5 5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={selected ? 2.6 : 1.8}
    />
  </svg>
);

const PlusIcon = ({selected}: DemoIconProps) => (
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={selected ? 2.8 : 2.2}
    />
  </svg>
);

const ActivityIcon = ({selected}: DemoIconProps) => (
  <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
    <path
      d="M3 12h4l2.3-6 4.2 12 2.3-6H21"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={selected ? 2.6 : 1.8}
    />
  </svg>
);

const ProfileIcon = ({selected}: DemoIconProps) => (
  <svg aria-hidden="true" fill={selected ? "currentColor" : "none"} viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M4.5 21c.5-4.2 3.2-6.5 7.5-6.5s7 2.3 7.5 6.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const demoItems: DemoItem[] = [
  {
    key: "home",
    label: "Home",
    icon: <HomeIcon />,
    selectedIcon: <HomeIcon selected />,
  },
  {
    key: "search",
    label: "Search",
    icon: <SearchIcon />,
    selectedIcon: <SearchIcon selected />,
  },
  {
    key: "create",
    label: "Create",
    icon: <PlusIcon />,
    selectedIcon: <PlusIcon selected />,
  },
  {
    key: "activity",
    label: "Activity",
    icon: <ActivityIcon />,
    selectedIcon: <ActivityIcon selected />,
  },
  {
    key: "profile",
    label: "Profile",
    icon: <ProfileIcon />,
    selectedIcon: <ProfileIcon selected />,
  },
];

function renderItems({
  disabledKey,
  prominent = false,
  selectedIcons = false,
}: {
  disabledKey?: React.Key;
  prominent?: boolean;
  selectedIcons?: boolean;
} = {}): React.ReactElement<BottomBarItemProps>[] {
  return demoItems.map((item) => (
    <BottomBarItem
      key={item.key}
      icon={item.icon}
      isDisabled={item.key === disabledKey}
      isProminent={prominent && item.key === "create"}
      selectedIcon={selectedIcons ? item.selectedIcon : undefined}
    >
      {item.label}
    </BottomBarItem>
  ));
}

function DemoPage({
  children,
  description = "A floating navigation layer stays legible while content moves underneath it.",
  tall = false,
  title = "Today",
}: {
  children: React.ReactNode;
  description?: string;
  tall?: boolean;
  title?: string;
}) {
  const cards = tall ? 10 : 4;

  return (
    <div
      className={[
        "relative isolate min-h-screen overflow-hidden bg-background px-5 pb-28 pt-8 text-foreground",
        tall ? "min-h-[180vh]" : "",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -left-20 top-24 -z-10 size-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 -z-10 size-80 rounded-full bg-secondary/25 blur-3xl" />

      <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
        <header className="space-y-2">
          <p className="text-small font-medium text-primary">BottomBar preview</p>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="max-w-md text-small text-default-500">{description}</p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {Array.from({length: cards}, (_, index) => (
            <article
              key={index}
              className={[
                "min-h-28 rounded-3xl border border-divider/50 p-4 shadow-small",
                index % 3 === 0
                  ? "bg-primary/15"
                  : index % 3 === 1
                    ? "bg-secondary/15"
                    : "bg-content1/80",
              ].join(" ")}
            >
              <p className="text-tiny font-semibold uppercase tracking-wider text-default-500">
                Card {index + 1}
              </p>
              <p className="mt-3 text-small">
                Content remains visible beneath the regular glass surface.
              </p>
            </article>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
}

function ControlledExample() {
  const [selectedKey, setSelectedKey] = React.useState<React.Key>("home");

  return (
    <DemoPage
      description={`The selected key is controlled by the parent: ${String(selectedKey)}.`}
      title="Controlled selection"
    >
      <BottomBar
        aria-label="Controlled primary navigation"
        selectedKey={selectedKey}
        onSelectionChange={setSelectedKey}
      >
        {renderItems({selectedIcons: true})}
      </BottomBar>
    </DemoPage>
  );
}

const meta = {
  title: "Components/BottomBar",
  component: BottomBar,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    disableAnimation: {
      control: "boolean",
    },
    hideLabels: {
      control: "select",
      options: ["never", "selected", "always"],
    },
    position: {
      control: "select",
      options: ["fixed", "sticky", "static"],
    },
    variant: {
      control: "select",
      options: ["solid", "underlined", "ghost"],
    },
  },
  args: {
    color: "primary",
    disableAnimation: false,
    hideLabels: "never",
    position: "fixed",
    variant: "solid",
  },
} satisfies Meta<typeof BottomBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: BottomBarProps) => (
    <DemoPage>
      <BottomBar {...args} aria-label="Primary navigation" defaultSelectedKey="home">
        {renderItems()}
      </BottomBar>
    </DemoPage>
  ),
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

export const SelectedIcons: Story = {
  render: (args: BottomBarProps) => (
    <DemoPage
      description="Each item can provide separate selected and unselected icon artwork."
      title="Selected icons"
    >
      <BottomBar {...args} aria-label="Primary navigation" defaultSelectedKey="search">
        {renderItems({selectedIcons: true})}
      </BottomBar>
    </DemoPage>
  ),
};

export const HiddenLabels: Story = {
  render: (args: BottomBarProps) => (
    <DemoPage
      description="Compare labels that are always visible, selected-only, or always hidden."
      title="Label visibility"
    >
      <div className="mx-auto mt-8 flex w-full max-w-lg flex-col gap-4 px-5">
        {(["never", "selected", "always"] as const).map((hideLabels) => (
          <section
            key={hideLabels}
            className="rounded-3xl border border-divider/50 bg-content1/80 p-3"
          >
            <p className="mb-2 text-tiny font-semibold text-default-500">
              hideLabels=&quot;{hideLabels}&quot;
            </p>
            <BottomBar
              {...args}
              aria-label={`${hideLabels} labels`}
              defaultSelectedKey="home"
              hideLabels={hideLabels}
              position="static"
            >
              {renderItems({selectedIcons: true})}
            </BottomBar>
          </section>
        ))}
      </div>
    </DemoPage>
  ),
};

export const Variants: Story = {
  render: (args: BottomBarProps) => (
    <DemoPage
      description="Compare the solid, underlined, and ghost selection indicators."
      title="Variants"
    >
      <div className="mx-auto mt-8 flex w-full max-w-lg flex-col gap-4 px-5">
        {(["solid", "underlined", "ghost"] as const).map((variant) => (
          <section
            key={variant}
            className="rounded-3xl border border-divider/50 bg-content1/80 p-3"
          >
            <p className="mb-2 text-tiny font-semibold text-default-500">
              variant=&quot;{variant}&quot;
            </p>
            <BottomBar
              {...args}
              aria-label={`${variant} variant`}
              defaultSelectedKey="home"
              position="static"
              variant={variant}
            >
              {renderItems({selectedIcons: true})}
            </BottomBar>
          </section>
        ))}
      </div>
    </DemoPage>
  ),
};

export const Prominent: Story = {
  render: (args: BottomBarProps) => (
    <DemoPage
      description="The centered prominent item receives extra visual emphasis."
      title="Prominent item"
    >
      <BottomBar {...args} aria-label="Primary navigation" defaultSelectedKey="create">
        {renderItems({prominent: true, selectedIcons: true})}
      </BottomBar>
    </DemoPage>
  ),
};

export const Positions: Story = {
  args: {
    position: "sticky",
  },
  render: (args: BottomBarProps) => (
    <DemoPage
      tall
      description="Use the position control to compare fixed, sticky, and static placement."
      title="Position variants"
    >
      <BottomBar {...args} aria-label="Primary navigation" defaultSelectedKey="home">
        {renderItems()}
      </BottomBar>
    </DemoPage>
  ),
};

export const CustomStyles: Story = {
  render: (args: BottomBarProps) => (
    <DemoPage
      description="Every visual part remains customizable through the shared Theme slots."
      title="Custom slots"
    >
      <BottomBar
        {...args}
        aria-label="Primary navigation"
        classNames={{
          label: "font-bold tracking-wide",
          link: "data-[selected=true]:text-secondary",
          list: "max-w-sm border-secondary/30",
          selectionIndicator: "bg-secondary/20",
        }}
        defaultSelectedKey="activity"
      >
        {renderItems({selectedIcons: true})}
      </BottomBar>
    </DemoPage>
  ),
};

export const Disabled: Story = {
  render: (args: BottomBarProps) => (
    <DemoPage
      description="Disabled items remain visible for layout continuity but cannot be selected."
      title="Disabled item"
    >
      <BottomBar {...args} aria-label="Primary navigation" defaultSelectedKey="home">
        {renderItems({disabledKey: "activity", selectedIcons: true})}
      </BottomBar>
    </DemoPage>
  ),
};

export const LongContent: Story = {
  render: (args: BottomBarProps) => (
    <DemoPage
      tall
      description="Scroll the canvas to inspect contrast while colorful content passes behind the bar."
      title="Glass over scrolling content"
    >
      <BottomBar {...args} aria-label="Primary navigation" defaultSelectedKey="home">
        {renderItems({selectedIcons: true})}
      </BottomBar>
    </DemoPage>
  ),
};
