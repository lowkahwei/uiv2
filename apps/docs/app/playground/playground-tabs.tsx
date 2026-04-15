"use client";

import {ScrollArea, Tab, Tabs} from "@heroui/react";

export default function BlocksTabs() {
  return (
    <ScrollArea
      hideScrollBar
      shadow
      className="max-w-full"
      orientation="horizontal"
      scrollbarProps={{
        className: "md:flex",
      }}
      shadowSize={48}
      thumbProps={{
        className: "bg-default-300 dark:bg-default-200/40",
      }}
      viewportProps={{
        className:
          "md:[scrollbar-width:thin] md:[&::-webkit-scrollbar]:block md:[&::-webkit-scrollbar]:h-2 md:[&::-webkit-scrollbar-thumb]:rounded-full md:[&::-webkit-scrollbar-track]:bg-transparent",
      }}
    >
      <Tabs
        aria-label="Playground components"
        classNames={{
          cursor: "dark:bg-default-100 bg-default-200",
          tab: "w-auto flex-none",
          tabList: "w-max min-w-full flex-nowrap overflow-visible",
        }}
        radius="full"
      >
        <Tab key="input" title="Inputs" />
        <Tab key="button" title="Buttons" />
        <Tab key="card" title="Cards" />
        <Tab key="link" title="Links" />
        <Tab key="checkbox" title="Checkboxes" />
        <Tab key="radio" title="Radios" />
        <Tab key="switch" title="Switches" />
        <Tab key="slider" title="Sliders" />
        <Tab key="switch1" title="Switches" />
        <Tab key="switch2" title="Switches" />
        <Tab key="switch3" title="Switches" />
        <Tab key="switch4" title="Switches" />
        <Tab key="switch5" title="Switches" />
        <Tab key="switch6" title="Switches" />
        <Tab key="switch7" title="Switches" />
        <Tab key="switch8" title="Switches" />
        <Tab key="switch9" title="Switches" />
        <Tab key="switch10" title="Switches" />
        <Tab key="switch11" title="Switches" />
        <Tab key="switch12" title="Switches" />
        <Tab key="switch13" title="Switches" />
        <Tab key="switch14" title="Switches" />
        <Tab key="switch15" title="Switches" />
        <Tab key="switch16" title="Switches" />
        {/* <Tab key="switch17" title="Switches" /> */}
      </Tabs>
    </ScrollArea>
  );
}
