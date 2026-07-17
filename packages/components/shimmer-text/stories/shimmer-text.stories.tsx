import type {Meta, StoryObj} from "@storybook/react";

import {ShimmerText} from "../src";

const meta = {
  title: "Components/ShimmerText",
  component: ShimmerText,
  argTypes: {
    angle: {
      control: {type: "range", min: -90, max: 90, step: 5},
    },
    dir: {
      control: "inline-radio",
      options: ["ltr", "rtl"],
    },
    disableAnimation: {
      control: "boolean",
    },
    duration: {
      control: {type: "number", min: 100, step: 100},
    },
    spread: {
      control: {type: "number", min: 0, step: 4},
    },
  },
  args: {
    children: "Generating response…",
    dir: "ltr",
    disableAnimation: false,
    duration: 2000,
    once: false,
    reverse: false,
  },
} satisfies Meta<typeof ShimmerText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Duration: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ShimmerText duration={800}>800ms — Fast</ShimmerText>
      <ShimmerText duration={2000}>2000ms — Default</ShimmerText>
      <ShimmerText duration={4000}>4000ms — Slow</ShimmerText>
    </div>
  ),
};

export const Spread: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ShimmerText spread={24}>24px — Narrow highlight</ShimmerText>
      <ShimmerText spread="5rem">5rem — CSS length</ShimmerText>
      <ShimmerText spread={140}>140px — Wide highlight</ShimmerText>
    </div>
  ),
};

export const Angle: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ShimmerText angle={-30}>-30°</ShimmerText>
      <ShimmerText angle={20}>20° — Default</ShimmerText>
      <ShimmerText angle={60}>60°</ShimmerText>
    </div>
  ),
};

export const Once: Story = {
  args: {
    children: "This shimmer runs once — use Remount to replay",
    duration: 1800,
    once: true,
  },
};

export const ReverseAndRTL: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1" dir="ltr">
        <ShimmerText>LTR — follows reading direction</ShimmerText>
        <ShimmerText reverse>LTR — reversed</ShimmerText>
      </div>
      <div className="flex flex-col gap-1 text-right" dir="rtl">
        <ShimmerText>RTL — يتبع اتجاه القراءة</ShimmerText>
        <ShimmerText reverse>RTL — اتجاه معكوس</ShimmerText>
      </div>
    </div>
  ),
};

export const ReducedMotion: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <ShimmerText disableAnimation>Animation disabled — readable currentColor text</ShimmerText>
      <p className="text-small text-foreground-500">
        The same fallback is applied automatically for prefers-reduced-motion.
      </p>
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <ShimmerText className="text-foreground">Foreground</ShimmerText>
      <ShimmerText className="text-primary">Primary</ShimmerText>
      <ShimmerText className="text-success">Success</ShimmerText>
      <ShimmerText className="text-danger">Danger</ShimmerText>
    </div>
  ),
};

export const Multiline: Story = {
  render: () => (
    <ShimmerText as="p" className="max-w-sm text-foreground-500">
      Shimmer inherits typography and color while supporting text that wraps across multiple lines.
    </ShimmerText>
  ),
};
