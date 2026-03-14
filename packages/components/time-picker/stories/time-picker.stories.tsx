import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "../src";
import { CalendarDateTime, DateValue } from "@internationalized/date";

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  decorators: [
    (Story) => (
      <div className="flex justify-center items-center min-h-[400px] w-full p-4 bg-background">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isYear: { control: "boolean" },
    isMonth: { control: "boolean" },
    isDay: { control: "boolean" },
    isHour: { control: "boolean" },
    isMinute: { control: "boolean" },
    isSecond: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  args: {
    isYear: true,
    isMonth: true,
    isDay: true,
    isHour: true,
    isMinute: true,
    isSecond: false,
    defaultValue: new CalendarDateTime(2025, 1, 1, 12, 30, 0),
  },
  render: (args) => (
    <div className="p-4 rounded-xl border border-default-200 bg-background shadow-sm">
      <TimePicker {...args} />
    </div>
  ),
};

export const OnlyTime: Story = {
  args: {
    isYear: false,
    isMonth: false,
    isDay: false,
    isHour: true,
    isMinute: true,
    isSecond: true,
  },
  render: (args) => (
    <div className="p-4 rounded-xl border border-default-200 bg-background shadow-sm">
      <TimePicker {...args} />
    </div>
  ),
};

export const OnlyDate: Story = {
  args: {
    isYear: true,
    isMonth: true,
    isDay: true,
    isHour: false,
    isMinute: false,
    isSecond: false,
  },
  render: (args) => (
    <div className="p-4 rounded-xl border border-default-200 bg-background shadow-sm">
      <TimePicker {...args} />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<DateValue>(new CalendarDateTime(2025, 3, 14, 15, 45, 0));
    
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-xl border border-default-200 bg-background shadow-sm">
          <TimePicker
            isYear
            isMonth
            isDay
            isHour
            isMinute
            value={value}
            onChange={(val) => {
              setValue(val);
              console.log("onChange:", val);
            }}
          />
        </div>
        <div className="text-sm font-mono bg-default-100 p-2 rounded-md">
          Selected: {value.toString()}
        </div>
      </div>
    );
  },
};
