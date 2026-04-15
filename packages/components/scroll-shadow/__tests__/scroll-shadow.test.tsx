import * as React from "react";
import {fireEvent, render} from "@testing-library/react";

import {ScrollShadow} from "../src";

describe("ScrollShadow", () => {
  const setScrollDimensions = (
    element: HTMLElement,
    {
      clientHeight,
      scrollHeight,
      clientWidth,
      scrollWidth,
      scrollTop = 0,
      scrollLeft = 0,
    }: {
      clientHeight: number;
      scrollHeight: number;
      clientWidth: number;
      scrollWidth: number;
      scrollTop?: number;
      scrollLeft?: number;
    },
  ) => {
    Object.defineProperties(element, {
      clientHeight: {configurable: true, value: clientHeight},
      scrollHeight: {configurable: true, value: scrollHeight},
      clientWidth: {configurable: true, value: clientWidth},
      scrollWidth: {configurable: true, value: scrollWidth},
      scrollTop: {configurable: true, writable: true, value: scrollTop},
      scrollLeft: {configurable: true, writable: true, value: scrollLeft},
    });
  };

  it("should render correctly", () => {
    const wrapper = render(<ScrollShadow />);

    expect(() => wrapper.unmount()).not.toThrow();
  });

  it("ref should be forwarded", () => {
    const ref = React.createRef<HTMLDivElement>();

    render(<ScrollShadow ref={ref} />);
    expect(ref.current).not.toBeNull();
  });

  it("should support controlled visibility state", () => {
    const {getByTestId} = render(<ScrollShadow data-testid="scroll-shadow" visibility="top" />);

    // should have the data-top-scroll attribute in true
    expect(getByTestId("scroll-shadow")).toHaveAttribute("data-top-scroll", "true");
  });

  it("should support both orientation", () => {
    const {getByTestId} = render(
      <ScrollShadow data-testid="scroll-shadow" orientation="both">
        <div style={{height: 400, width: 400}}>content</div>
      </ScrollShadow>,
    );

    const element = getByTestId("scroll-shadow");

    setScrollDimensions(element, {
      clientHeight: 100,
      scrollHeight: 300,
      clientWidth: 100,
      scrollWidth: 300,
      scrollTop: 20,
      scrollLeft: 10,
    });

    fireEvent.scroll(element);

    expect(element).toHaveAttribute("data-top-bottom-scroll", "true");
    expect(element).toHaveAttribute("data-left-right-scroll", "true");
  });

  it("should clear attributes when disabled", () => {
    const {getByTestId, rerender} = render(
      <ScrollShadow data-testid="scroll-shadow" visibility="bottom" />,
    );

    const element = getByTestId("scroll-shadow");

    expect(element).toHaveAttribute("data-bottom-scroll", "true");

    rerender(<ScrollShadow data-testid="scroll-shadow" isEnabled={false} visibility="bottom" />);

    expect(element).not.toHaveAttribute("data-top-scroll");
    expect(element).not.toHaveAttribute("data-bottom-scroll");
    expect(element).not.toHaveAttribute("data-top-bottom-scroll");
  });
});
