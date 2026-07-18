import type {Meta} from "@storybook/react";

import React from "react";

import {LabeledDivider} from "../src";

export default {
  title: "Components/LabeledDivider",
  component: LabeledDivider,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof LabeledDivider>;

export const Default = {
  args: {
    children: "OR",
  },
};

export const SectionBreaks = {
  render: () => (
    <div className="flex flex-col gap-6">
      <LabeledDivider>Today</LabeledDivider>
      <LabeledDivider>Or continue with</LabeledDivider>
    </div>
  ),
};

export const CustomStyles = {
  args: {
    children: "Featured",
    classNames: {
      label: "font-medium text-primary",
      line: "bg-primary/40",
    },
  },
};
