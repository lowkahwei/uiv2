import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselPagination
} from "../src";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  decorators: [
    (Story) => (
      <div className="flex justify-center items-center min-h-[400px] w-full p-4 bg-background">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isAutoplay: { control: "boolean" },
    isWheelGestures: { control: "boolean" },
    fullWidth: { control: "boolean" },
    loop: { control: "boolean" },
    direction: { control: "select", options: ["horizontal", "vertical"] },
    duration: { control: "number" },
    startIndex: { control: "number" },
    slidesToShow: { control: "object" },
    visiblePortion: { control: "object" },
    gap: { control: "object" },
    enableOpacity: { control: "boolean" },
    dragFree: { control: "boolean" },
    clickable: { control: "boolean" },
    isCenter: { control: "boolean" },
    align: { control: "select", options: ["start", "center", "end"] },
    autoDelay: { control: "number" },
    stopOnInteraction: { control: "boolean" },
    skipSnaps: { control: "boolean" },
    dragThreshold: { control: "number" },
  },
};

export default meta;

type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: (args) => (
    <Carousel className="w-full max-w-xs" {...args}>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card shadow="sm">
                <CardBody className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardBody>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const ResponsiveBanners: Story = {
  args: {
    isAutoplay: true,
    loop: true,
    autoDelay: 3000,
    slidesToShow: {
      desktop: 3,
      tablet: 2,
      mobile: 1,
    },
    gap: {
      desktop: 1,
      tablet: 0.75,
      mobile: 0.5,
    },
  },
  render: (args) => (
    <div className="w-full max-w-6xl">
      <Carousel {...args}>
        <CarouselContent>
          {[
            "bg-blue-500",
            "bg-green-500",
            "bg-red-500",
            "bg-yellow-500",
            "bg-purple-500",
          ].map((color, index) => (
            <CarouselItem key={index}>
              <Card className={`h-[300px] border-none ${color}`} radius="lg">
                <CardBody className="flex items-center justify-center">
                  <span className="text-8xl font-bold text-white/20 select-none">{index + 1}</span>
                </CardBody>
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] ml-1 z-10">
                  <p className="text-tiny text-white/80">Banner {index + 1} Description</p>
                  <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                    Action
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
        <CarouselPagination className="mt-6" />
      </Carousel>
    </div>
  ),
};

export const Autoplay: Story = {
  args: {
    isAutoplay: true,
    autoDelay: 2000,
  },
  render: (args) => (
    <Carousel className="w-full max-w-xs" {...args}>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card shadow="sm">
                <CardBody className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardBody>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const MultiItems: Story = {
  args: {
    slidesToShow: 3,
    gap: 1,
  },
  render: (args) => (
    <Carousel className="w-full max-w-xl" {...args}>
      <CarouselContent>
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card shadow="sm">
                <CardBody className="flex aspect-video items-center justify-center p-6">
                  <span className="text-2xl font-semibold">{index + 1}</span>
                </CardBody>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const WithPagination: Story = {
  render: (args) => (
    <Carousel className="w-full max-w-xs" {...args}>
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card shadow="sm">
                <CardBody className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardBody>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPagination className="mt-4" />
    </Carousel>
  ),
};

export const PeekEffect: Story = {
  args: {
    slidesToShow: 1,
    visiblePortion: 0.2,
    gap: 1,
  },
  render: (args) => (
    <div className="w-full max-w-md">
      <Carousel {...args}>
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card className="bg-primary/10 border-primary/20 border-1 h-32">
                <CardBody className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-primary font-bold">Item {index + 1}</p>
                    <p className="text-tiny text-default-500">Subtitle for element {index + 1}</p>
                  </div>
                </CardBody>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const VIPTiers: Story = {
  args: {
    align: "center",
    slidesToShow: 1.5,
    gap: 1.5,
    enableOpacity: true,
  },
  render: (args) => (
    <div className="w-full max-w-2xl">
      <Carousel {...args}>
        <CarouselContent>
          {[
            { name: "Bronze", color: "from-orange-400 to-orange-700" },
            { name: "Silver", color: "from-slate-300 to-slate-500" },
            { name: "Gold", color: "from-yellow-400 to-yellow-600" },
            { name: "Platinum", color: "from-cyan-400 to-cyan-600" },
            { name: "Diamond", color: "from-indigo-500 to-purple-600" },
          ].map((tier, index) => (
            <CarouselItem key={index}>
              <Card className={`h-64 bg-gradient-to-br ${tier.color} text-white`}>
                <CardBody className="flex flex-col items-center justify-center gap-4">
                  <span className="text-6xl text-white/30 font-bold">{index + 1}</span>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold uppercase tracking-widest">{tier.name}</h3>
                    <p className="text-tiny opacity-80 mt-1">Level {index + 1}</p>
                  </div>
                </CardBody>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

export const WheelGestures: Story = {
  args: {
    isWheelGestures: true,
    slidesToShow: 3,
    gap: 1,
  },
  render: (args) => (
    <div className="w-full max-w-4xl">
      <p className="text-center mb-4 text-default-500">Use your mouse wheel to scroll</p>
      <Carousel {...args}>
        <CarouselContent>
          {Array.from({ length: 12 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card isPressable className="aspect-video bg-default-100">
                <CardBody className="flex items-center justify-center">
                  <span className="text-2xl font-bold">{index + 1}</span>
                </CardBody>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    direction: "vertical",
    slidesToShow: 3,
    dragFree: true,
    align: 'center',
    gap: 1,
    height: 400,
  },
  render: (args) => (
    <div className="flex h-[500px] items-center">
      <Carousel {...args}>
        <CarouselContent>
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem key={index}>
              <Card className="h-[120px] bg-secondary/10 border-secondary/20 border-1">
                <CardBody className="flex items-center justify-center">
                  <span className="text-xl font-bold">Vertical {index + 1}</span>
                </CardBody>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};

export const TimePickerSimulator: Story = {
  args: {
    direction: "vertical",
    duration: 20,
    isCenter: true,
    dragFree: true,
    slidesToShow: 5,
    align: 'center',
    clickable: true,
    startIndex: 0,
    height: 160,
    width: 60,
    isWheelGestures: true,
  },
  render: (args) => (
    <div className="flex h-[300px] w-full items-center justify-center">
      <Carousel 
        {...args} 
        className="bg-default-100 shadow-sm rounded-medium"
        onSlideSelect={(index, value) => console.log("TimePicker Selected:", index, value)}
      >
        <CarouselContent>
          {Array.from({ length: 60 }).map((_, index) => {
            const value = index.toString().padStart(2, '0');
            return (
              <CarouselItem 
                key={index} 
                index={index}
                dataValue={value}
                className="flex items-center justify-center font-medium text-lg text-default-700"
              >
                {value}
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  ),
};
