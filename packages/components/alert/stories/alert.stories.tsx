import type {Meta, StoryObj} from "@storybook/react";

import {Button} from "@sytechui/button";

import {Alert} from "../src";

type IndicatorMode = "default" | "custom" | "none";
type AlertStoryArgs = Alert.Props & {
  description: string;
  indicator: IndicatorMode;
  title: string;
};

const StoryIndicator = ({mode}: {mode: IndicatorMode}) =>
  mode === "none" ? null : (
    <Alert.Indicator>
      {mode === "custom" ? <span aria-hidden="true">★</span> : undefined}
    </Alert.Indicator>
  );

const meta = {
  title: "Components/Alert",
  component: Alert,
  args: {
    classNames: {},
    description:
      "Check out our latest updates including dark mode support and improved accessibility.",
    indicator: "default",
    radius: "lg",
    status: "default",
    title: "New features available",
  },
  argTypes: {
    as: {
      control: false,
      table: {disable: true},
    },
    children: {
      control: false,
      table: {disable: true},
    },
    classNames: {
      control: "object",
    },
    description: {
      control: "text",
    },
    indicator: {
      control: "inline-radio",
      options: ["default", "custom", "none"],
    },
    radius: {
      control: "inline-radio",
      options: ["none", "sm", "md", "lg", "full"],
    },
    status: {
      control: "inline-radio",
      options: ["default", "accent", "success", "warning", "danger"],
    },
    title: {
      control: "text",
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto flex min-h-screen w-full max-w-xl items-center">
        <Story />
      </div>
    ),
  ],
  render: ({description, indicator, title, ...args}) => (
    <Alert {...args}>
      <StoryIndicator mode={indicator} />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        {description && <Alert.Description>{description}</Alert.Description>}
      </Alert.Content>
    </Alert>
  ),
} satisfies Meta<AlertStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Statuses: Story = {
  render: ({classNames, description, indicator, radius}) => (
    <div className="flex w-full flex-col gap-4">
      {(["default", "accent", "success", "warning", "danger"] as const).map((status) => (
        <Alert key={status} classNames={classNames} radius={radius} status={status}>
          <StoryIndicator mode={indicator} />
          <Alert.Content>
            <Alert.Title>{status[0].toUpperCase() + status.slice(1)} alert</Alert.Title>
            {description && <Alert.Description>{description}</Alert.Description>}
          </Alert.Content>
        </Alert>
      ))}
    </div>
  ),
};

export const CustomIndicator: Story = {
  args: {
    description: "",
    indicator: "custom",
    status: "accent",
    title: "Custom indicator",
  },
};

export const WithoutIndicator: Story = {
  args: {
    description: "Your changes have been saved.",
    indicator: "none",
    status: "success",
    title: "Profile updated",
  },
};

export const WithAction: Story = {
  args: {
    description: "A new version is available. Refresh to get the latest features.",
    status: "accent",
    title: "Update available",
  },
  render: ({description, indicator, title, ...args}) => (
    <Alert {...args}>
      <StoryIndicator mode={indicator} />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        {description && <Alert.Description>{description}</Alert.Description>}
      </Alert.Content>
      <Button size="sm">Refresh</Button>
    </Alert>
  ),
};

export const CustomStyles: Story = {
  args: {
    description: "",
    title: "The documents you requested are ready to be viewed",
  },
  render: ({classNames, description, indicator, title, ...args}) => (
    <Alert
      {...args}
      classNames={{
        base: "rounded-none rounded-r-xl border-s-4 shadow-medium",
        ...classNames,
      }}
    >
      <StoryIndicator mode={indicator} />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        {description && <Alert.Description>{description}</Alert.Description>}
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Button size="sm" variant="bordered">
            View documents
          </Button>
          <Button
            className="h-auto min-w-0 rounded-none p-0 underline underline-offset-4"
            size="sm"
            variant="light"
          >
            Maybe later
          </Button>
        </div>
      </Alert.Content>
    </Alert>
  ),
};
