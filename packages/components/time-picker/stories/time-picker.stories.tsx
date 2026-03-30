import type {Meta} from "@storybook/react";
import type {DateValue} from "@internationalized/date";

import {useState} from "react";
import {CalendarDateTime} from "@internationalized/date";

import {TimePicker} from "../src";

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
    isYear: {control: "boolean"},
    isMonth: {control: "boolean"},
    isDay: {control: "boolean"},
    isHour: {control: "boolean"},
    isMinute: {control: "boolean"},
    isSecond: {control: "boolean"},
    disabled: {control: "boolean"},
  },
};

export default meta;

const DefaultTemplate = (args: any) => {
  const [currentValue, setCurrentValue] = useState<DateValue | null>(
    args.defaultValue as DateValue,
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 rounded-xl border border-default-200 bg-background shadow-sm">
        <TimePicker
          {...args}
          onChange={(val) => {
            setCurrentValue(val);
            args.onChange?.(val);
          }}
        />
      </div>
      <div className="mt-4 w-full flex justify-center text-sm font-mono bg-default-100/50 p-4 rounded-md">
        当前选中时间:{" "}
        <span className="text-primary ml-2 font-bold">
          {currentValue ? currentValue.toString() : "无"}
        </span>
      </div>
    </div>
  );
};

export const Default = {
  args: {
    isYear: true,
    isMonth: true,
    isDay: true,
    isHour: true,
    isMinute: true,
    isSecond: false,
    defaultValue: new CalendarDateTime(2026, 1, 1, 12, 30, 0),
  },
  render: (args: any) => <DefaultTemplate {...args} />,
};

export const OnlyTime = {
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

export const OnlyDate = {
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

const ControlledTemplate = () => {
  const [value, setValue] = useState<DateValue>(new CalendarDateTime(2025, 3, 14, 15, 45, 0));

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 rounded-xl border border-default-200 bg-background shadow-sm">
        <TimePicker
          isDay
          isHour
          isMinute
          isMonth
          isYear
          value={value}
          onChange={(val) => {
            setValue(val);
          }}
        />
      </div>
      <div className="text-sm font-mono bg-default-100 p-2 rounded-md">
        Selected: {value.toString()}
      </div>
    </div>
  );
};

export const Controlled = {
  render: () => <ControlledTemplate />,
};
