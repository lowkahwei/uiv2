import type {Meta} from "@storybook/react";
import type {StepperProps} from "../src";

import {CheckIcon, MailIcon, ShieldSecurityIcon} from "@sytechui/shared-icons";
import React from "react";

import {Stepper, StepperItem} from "../src";

export default {
  title: "Components/Stepper",
  component: Stepper,
  argTypes: {
    orientation: {
      control: {type: "select"},
      options: ["horizontal", "vertical"],
    },
    variant: {
      control: {type: "select"},
      options: ["solid", "bordered", "flat", "dot"],
    },
    color: {
      control: {type: "select"},
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    size: {
      control: {type: "select"},
      options: ["sm", "md", "lg"],
    },
    radius: {
      control: {type: "select"},
      options: ["none", "sm", "md", "lg", "full"],
    },
    separatorMode: {
      control: {type: "select"},
      options: ["spaced", "connected"],
    },
    isDisabled: {
      control: {type: "boolean"},
    },
    disableAnimation: {
      control: {type: "boolean"},
    },
  },
} as Meta<typeof Stepper>;

const Template = (args: StepperProps) => {
  const [currentKey, setCurrentKey] = React.useState<React.Key>("verify");

  return (
    <Stepper
      {...args}
      aria-label="Account setup progress"
      currentKey={currentKey}
      onCurrentChange={setCurrentKey}
    >
      <StepperItem key="account" description="Create your account" title="Account" />
      <StepperItem key="verify" description="Verify your email" title="Verification" />
      <StepperItem key="complete" description="Finish setup" title="Complete" />
    </Stepper>
  );
};

export const Default = {
  render: Template,
  args: {
    color: "primary",
    orientation: "horizontal",
    size: "md",
    variant: "solid",
  },
};

export const Vertical = {
  render: Template,
  args: {
    ...Default.args,
    orientation: "vertical",
  },
};

export const Statuses = {
  render: (args: StepperProps) => (
    <Stepper {...args} aria-label="Deployment progress" currentKey="deploy">
      <StepperItem key="build" title="Build" />
      <StepperItem key="test" status="error" statusLabel="Error" title="Tests" />
      <StepperItem key="deploy" status="loading" statusLabel="Loading" title="Deploy" />
    </Stepper>
  ),
  args: Default.args,
};

export const WithIcons = {
  render: (args: StepperProps) => (
    <Stepper {...args} aria-label="Secure account setup" currentKey="security">
      <StepperItem key="account" indicator={<MailIcon />} title="Account" />
      <StepperItem key="security" indicator={<ShieldSecurityIcon />} title="Security" />
      <StepperItem key="done" indicator={<CheckIcon />} title="Done" />
    </Stepper>
  ),
  args: Default.args,
};

export const Dots = {
  render: (args: StepperProps) => (
    <Stepper {...args} aria-label="Order progress" currentKey="shipping">
      <StepperItem key="cart" title="Cart" />
      <StepperItem key="shipping" title="Shipping" />
      <StepperItem key="payment" title="Payment" />
      <StepperItem key="confirmation" title="Confirmation" />
    </Stepper>
  ),
  args: {
    ...Default.args,
    separatorMode: "connected",
    variant: "dot",
  },
};

export const SeparatorModes = {
  render: () => (
    <div className="flex flex-col gap-10">
      <Stepper aria-label="Spaced separators" currentKey="second" separatorMode="spaced">
        <StepperItem key="first" title="First" />
        <StepperItem key="second" title="Second" />
        <StepperItem key="third" title="Third" />
      </Stepper>
      <Stepper aria-label="Connected separators" currentKey="second" separatorMode="connected">
        <StepperItem key="first" title="First" />
        <StepperItem key="second" title="Second" />
        <StepperItem key="third" title="Third" />
      </Stepper>
    </div>
  ),
};

const selectableSteps = [
  {key: "account", title: "Account"},
  {key: "verification", title: "Verification"},
  {key: "complete", title: "Complete"},
];

const DisableNextStepsTemplate = (args: StepperProps) => {
  const [currentKey, setCurrentKey] = React.useState<React.Key>("verification");
  const currentIndex = selectableSteps.findIndex((step) => step.key === currentKey);

  return (
    <Stepper
      {...args}
      aria-label="Restricted account setup"
      currentKey={currentKey}
      onCurrentChange={setCurrentKey}
    >
      {selectableSteps.map((step, index) => (
        <StepperItem key={step.key} isDisabled={index > currentIndex} title={step.title} />
      ))}
    </Stepper>
  );
};

export const DisableNextStepsSelection = {
  render: DisableNextStepsTemplate,
  args: Default.args,
};

export const ColorRadiusAndSize = {
  render: () => (
    <div className="flex flex-col gap-10">
      <Stepper
        aria-label="Small primary steps"
        color="primary"
        currentKey="second"
        radius="none"
        size="sm"
      >
        <StepperItem key="first" title="First" />
        <StepperItem key="second" title="Second" />
        <StepperItem key="third" title="Third" />
      </Stepper>
      <Stepper
        aria-label="Medium success steps"
        color="success"
        currentKey="second"
        radius="md"
        size="md"
        variant="bordered"
      >
        <StepperItem key="first" title="First" />
        <StepperItem key="second" title="Second" />
        <StepperItem key="third" title="Third" />
      </Stepper>
      <Stepper
        aria-label="Large secondary steps"
        color="secondary"
        currentKey="second"
        radius="full"
        size="lg"
        variant="flat"
      >
        <StepperItem key="first" title="First" />
        <StepperItem key="second" title="Second" />
        <StepperItem key="third" title="Third" />
      </Stepper>
    </div>
  ),
};
