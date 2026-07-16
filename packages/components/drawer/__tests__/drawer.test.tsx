import "@testing-library/jest-dom";
import * as React from "react";
import {render, fireEvent} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {spy, shouldIgnoreReactWarning} from "@sytechui/test-utils";

import {Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter} from "../src";

describe("Drawer", () => {
  beforeAll(() => {
    if (!window.PointerEvent) {
      Object.defineProperty(window, "PointerEvent", {value: MouseEvent});
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const wrapper = render(
      <Drawer isOpen>
        <DrawerContent>
          <DrawerHeader>Drawer header</DrawerHeader>
          <DrawerBody>Drawer body</DrawerBody>
          <DrawerFooter>Drawer footer</DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    expect(() => wrapper.unmount()).not.toThrow();

    if (shouldIgnoreReactWarning(spy)) {
      return;
    }

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it("ref should be forwarded", () => {
    const ref = React.createRef<HTMLElement>();

    render(
      <Drawer ref={ref} isOpen>
        <DrawerContent>
          <DrawerHeader>Drawer header</DrawerHeader>
          <DrawerBody>Drawer body</DrawerBody>
          <DrawerFooter>Drawer footer</DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );
    expect(ref.current).not.toBeNull();
  });

  it("should have the proper 'aria' attributes", () => {
    const {getByRole, getByText} = render(
      <Drawer isOpen>
        <DrawerContent>
          <DrawerHeader>Drawer header</DrawerHeader>
          <DrawerBody>Drawer body</DrawerBody>
          <DrawerFooter>Drawer footer</DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    const drawer = getByRole("dialog");

    expect(drawer).toHaveAttribute("aria-modal", "true");
    expect(drawer).toHaveAttribute("role", "dialog");

    const drawerHeader = getByText("Drawer header");

    expect(drawer).toHaveAttribute("aria-labelledby", drawerHeader.id);

    const drawerBody = getByText("Drawer body");

    expect(drawer).toHaveAttribute("aria-describedby", drawerBody.id);
  });

  test("should fire 'onOpenChange' callback when close button is clicked", async () => {
    const onClose = jest.fn();

    const {getByLabelText} = render(
      <Drawer isOpen onClose={onClose}>
        <DrawerContent>
          <DrawerHeader>Drawer header</DrawerHeader>
          <DrawerBody>Drawer body</DrawerBody>
          <DrawerFooter>Drawer footer</DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    const closeButton = getByLabelText("Close");
    const user = userEvent.setup();

    await user.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it("should hide the drawer when pressing the escape key", () => {
    const onClose = jest.fn();

    const wrapper = render(
      <Drawer isOpen onClose={onClose}>
        <DrawerContent>
          <DrawerHeader>Drawer header</DrawerHeader>
          <DrawerBody>Drawer body</DrawerBody>
          <DrawerFooter>Drawer footer</DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    const drawer = wrapper.getByRole("dialog");

    fireEvent.keyDown(drawer, {key: "Escape"});
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should only render the swipe handle when swipe dismissal is available", () => {
    const {baseElement, rerender} = render(
      <Drawer isOpen showSwipeHandle>
        <DrawerContent>Drawer content</DrawerContent>
      </Drawer>,
    );

    expect(baseElement.querySelector("[data-slot='drawer-swipe-handle']")).not.toBeNull();

    rerender(
      <Drawer isOpen showSwipeHandle isDismissable={false}>
        <DrawerContent>Drawer content</DrawerContent>
      </Drawer>,
    );

    expect(baseElement.querySelector("[data-slot='drawer-swipe-handle']")).toBeNull();
  });

  it("should apply custom native enter and exit durations", () => {
    const {getByRole} = render(
      <Drawer isOpen motionDuration={{enter: 0.18, exit: 0.4}}>
        <DrawerContent>Drawer content</DrawerContent>
      </Drawer>,
    );

    expect(getByRole("dialog")).toHaveStyle({
      "--drawer-enter-duration": "0.18s",
      "--drawer-exit-duration": "0.4s",
    });
  });

  it.each([
    ["left", 200, 80],
    ["right", 0, 120],
    ["top", 200, 80],
    ["bottom", 0, 120],
  ] as const)("should dismiss a %s drawer when its handle is dragged", (placement, start, end) => {
    const onClose = jest.fn();
    const onOpenChange = jest.fn();
    const {baseElement, getByRole} = render(
      <Drawer
        isOpen
        showSwipeHandle
        placement={placement}
        onClose={onClose}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>Drawer content</DrawerContent>
      </Drawer>,
    );

    const drawer = getByRole("dialog");
    const handle = baseElement.querySelector<HTMLElement>("[data-slot='drawer-swipe-handle']");
    const isVertical = placement === "top" || placement === "bottom";

    Object.defineProperty(drawer, isVertical ? "offsetHeight" : "offsetWidth", {
      configurable: true,
      value: 300,
    });

    fireEvent.pointerDown(handle!, {
      button: 0,
      clientX: isVertical ? 0 : start,
      clientY: isVertical ? start : 0,
      pointerId: 1,
    });
    fireEvent.pointerMove(handle!, {
      clientX: isVertical ? 0 : end,
      clientY: isVertical ? end : 0,
      pointerId: 1,
    });

    expect(drawer.style.transform).toContain("translate3d");

    fireEvent.pointerUp(handle!, {
      clientX: isVertical ? 0 : end,
      clientY: isVertical ? end : 0,
      pointerId: 1,
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should snap back without closing when the drag is too short", () => {
    const onOpenChange = jest.fn();
    const {baseElement, getByRole} = render(
      <Drawer isOpen showSwipeHandle placement="right" onOpenChange={onOpenChange}>
        <DrawerContent>Drawer content</DrawerContent>
      </Drawer>,
    );

    const drawer = getByRole("dialog");
    const handle = baseElement.querySelector<HTMLElement>("[data-slot='drawer-swipe-handle']");
    const now = jest.spyOn(performance, "now").mockReturnValueOnce(0).mockReturnValueOnce(1000);

    Object.defineProperty(drawer, "offsetWidth", {configurable: true, value: 300});

    fireEvent.pointerDown(handle!, {button: 0, clientX: 0, pointerId: 1});
    fireEvent.pointerMove(handle!, {clientX: 20, pointerId: 1});
    fireEvent.pointerUp(handle!, {clientX: 20, pointerId: 1});

    expect(drawer.style.transform).toBe("");
    expect(onOpenChange).not.toHaveBeenCalled();

    now.mockRestore();
  });
});
