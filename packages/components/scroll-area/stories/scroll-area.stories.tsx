import type {Meta, StoryObj} from "@storybook/react";
import type {ScrollAreaProps} from "../src";

import React from "react";

import {ScrollArea} from "../src";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center bg-background p-8">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    orientation: {
      control: {type: "select"},
      options: ["vertical", "horizontal", "both"],
    },
    scrollBehavior: {
      control: {type: "select"},
      options: ["inside", "outside"],
    },
    shadow: {
      control: {type: "boolean"},
    },
    shadowSize: {
      control: {type: "number"},
    },
    size: {
      control: {type: "select"},
      options: ["sm", "md", "lg"],
    },
    hideScrollBar: {
      control: {type: "boolean"},
    },
    hideScrollBarOnMobile: {
      control: {type: "boolean"},
    },
    children: {
      table: {disable: true},
    },
    classNames: {
      table: {disable: true},
    },
    viewportProps: {
      table: {disable: true},
    },
    scrollbarProps: {
      table: {disable: true},
    },
    thumbProps: {
      table: {disable: true},
    },
    cornerProps: {
      table: {disable: true},
    },
    scrollViewPortRef: {
      table: {disable: true},
    },
    onScroll: {
      table: {disable: true},
    },
    onVisibilityChange: {
      table: {disable: true},
    },
    updateDeps: {
      table: {disable: true},
    },
  },
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

const defaultProps: ScrollAreaProps = {
  className: "h-[320px] w-[420px] border border-default-200 bg-content1 p-3",
  orientation: "vertical",
  scrollBehavior: "inside",
  shadow: false,
  shadowSize: 48,
  size: "md",
  hideScrollBar: false,
  hideScrollBarOnMobile: false,
};

function StoryShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-3xl space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-default-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

function VerticalContent() {
  return (
    <div className="space-y-3">
      {Array.from({length: 12}).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-default-200 bg-default-50 p-4 dark:bg-default-100/10"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Section {index + 1}</span>
            <span className="text-xs text-default-400">#{String(index + 1).padStart(2, "0")}</span>
          </div>
          <p className="text-sm leading-6 text-default-500">
            ScrollArea vertical mode is useful for long stacked content like settings panels,
            sidebars, and docs sections.
          </p>
        </div>
      ))}
    </div>
  );
}

function HorizontalContent() {
  return (
    <div className="flex w-max gap-3 pb-1">
      {Array.from({length: 14}).map((_, index) => (
        <div
          key={index}
          className="flex h-[220px] w-[180px] shrink-0 flex-col justify-between rounded-2xl border border-default-200 bg-gradient-to-br from-default-100 to-default-50 p-4 dark:from-default-100/15 dark:to-default-50/5"
        >
          <span className="text-xs uppercase tracking-[0.18em] text-default-400">
            Item {index + 1}
          </span>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">Preview card</p>
            <p className="text-sm leading-6 text-default-500">
              Horizontal mode is useful for tabs, chips, media carousels, and timelines.
            </p>
          </div>
          <div className="h-2 rounded-full bg-default-200">
            <div
              className="h-2 rounded-full bg-primary"
              style={{width: `${35 + ((index % 5) + 1) * 10}%`}}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function GridContent() {
  return (
    <div className="grid w-[760px] grid-cols-4 gap-3">
      {Array.from({length: 16}).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-default-200 bg-default-50 p-4 dark:bg-default-100/10"
        >
          <p className="text-sm font-semibold text-foreground">Block {index + 1}</p>
          <p className="mt-2 text-sm leading-6 text-default-500">
            `orientation=&quot;both&quot;` lets you inspect horizontal and vertical scrollbar
            behavior together.
          </p>
        </div>
      ))}
    </div>
  );
}

function getContent(orientation: ScrollAreaProps["orientation"]) {
  if (orientation === "horizontal") return <HorizontalContent />;
  if (orientation === "both") return <GridContent />;

  return <VerticalContent />;
}

const Template = (args: ScrollAreaProps) => (
  <ScrollArea {...args}>{getContent(args.orientation)}</ScrollArea>
);

export const Default: Story = {
  render: (args) => (
    <StoryShell
      description="Basic vertical scroll area. `orientation` decides which scrollbar should render."
      title="Default"
    >
      <Template {...args} />
    </StoryShell>
  ),
  args: {
    ...defaultProps,
  },
};

export const Horizontal: Story = {
  render: (args) => (
    <StoryShell
      description='Use `orientation="horizontal"` for overflowing rows like tabs or preview cards.'
      title="Horizontal"
    >
      <Template {...args} />
    </StoryShell>
  ),
  args: {
    ...defaultProps,
    orientation: "horizontal",
    className: "w-[520px] rounded-2xl border border-default-200 bg-content1 p-3",
  },
};

export const OutsideScrollbar: Story = {
  render: (args) => (
    <StoryShell
      description="`inside` keeps the scrollbar overlaid. `outside` moves it into normal layout outside the viewport."
      title="scrollBehavior"
    >
      <Template {...args} />
    </StoryShell>
  ),
  args: {
    ...defaultProps,
    orientation: "horizontal",
    scrollBehavior: "outside",
    className: "w-[520px] rounded-2xl border border-default-200 bg-content1 p-3",
  },
};

export const Shadow: Story = {
  render: (args) => (
    <StoryShell
      description="Enable `shadow` to show overflow affordance on the viewport edges. `shadowSize` controls the gradient depth."
      title="shadow / shadowSize"
    >
      <Template {...args} />
    </StoryShell>
  ),
  args: {
    ...defaultProps,
    shadow: true,
    shadowSize: 80,
  },
};

export const Sizes: Story = {
  render: () => (
    <StoryShell
      description="`size` changes the scrollbar thickness. This only affects the scrollbar slot, not the content layout."
      title="size"
    >
      <div className="grid gap-4">
        {(["sm", "md", "lg"] as const).map((size) => (
          <div key={size} className="space-y-2">
            <p className="text-sm font-medium text-default-500">size=&quot;{size}&quot;</p>
            <ScrollArea {...defaultProps} size={size}>
              <VerticalContent />
            </ScrollArea>
          </div>
        ))}
      </div>
    </StoryShell>
  ),
};

export const BothAxes: Story = {
  render: (args) => (
    <StoryShell
      description="Render both axes when content overflows in two directions."
      title='orientation="both"'
    >
      <Template {...args} />
    </StoryShell>
  ),
  args: {
    ...defaultProps,
    orientation: "both",
    className: "h-[320px] w-[420px] rounded-2xl border border-default-200 bg-content1 p-3",
  },
};

export const HiddenScrollbar: Story = {
  render: (args) => (
    <StoryShell
      description="These props only hide the visual scrollbar. Scrolling still works."
      title="hideScrollBar / hideScrollBarOnMobile"
    >
      <Template {...args} />
    </StoryShell>
  ),
  args: {
    ...defaultProps,
    hideScrollBar: true,
    shadow: true,
  },
};

export const CustomStyles: Story = {
  render: (args) => (
    <StoryShell
      description="Use slot classes and forwarded props when you need visual customization without changing component logic."
      title="classNames / viewportProps / thumbProps"
    >
      <Template {...args} />
    </StoryShell>
  ),
  args: {
    ...defaultProps,
    shadow: true,
    className:
      "h-[320px] w-[420px] rounded-[28px] border border-primary/20 bg-gradient-to-br from-content1 to-primary-50/40 p-3 dark:to-primary-950/20",
    classNames: {
      scrollbar: "data-[orientation=vertical]:w-3.5",
      thumb:
        "bg-gradient-to-b from-primary to-secondary group-hover:from-primary-500 group-hover:to-secondary-500",
    },
    viewportProps: {
      className: "pr-3",
    },
  },
};
