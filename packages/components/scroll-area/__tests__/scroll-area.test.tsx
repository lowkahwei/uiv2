import type * as React from "react";

import {fireEvent, render} from "@testing-library/react";

jest.mock("@radix-ui/react-scroll-area", () => {
  const React = require("react");

  const withDisplayName = <T,>(component: T, displayName: string) => {
    // @ts-expect-error test-only helper
    component.displayName = displayName;

    return component;
  };

  return {
    Root: withDisplayName(
      React.forwardRef(function MockScrollAreaRoot(
        props: React.HTMLAttributes<HTMLDivElement>,
        ref,
      ) {
        return <div ref={ref} {...props} />;
      }),
      "MockScrollAreaRoot",
    ),
    Viewport: withDisplayName(
      React.forwardRef(function MockScrollAreaViewport(
        props: React.HTMLAttributes<HTMLDivElement>,
        ref,
      ) {
        return <div ref={ref} {...props} />;
      }),
      "MockScrollAreaViewport",
    ),
    ScrollAreaScrollbar: withDisplayName(
      React.forwardRef(function MockScrollAreaScrollbar(
        props: React.HTMLAttributes<HTMLDivElement>,
        ref,
      ) {
        return <div ref={ref} {...props} />;
      }),
      "MockScrollAreaScrollbar",
    ),
    ScrollAreaThumb: withDisplayName(
      React.forwardRef(function MockScrollAreaThumb(
        props: React.HTMLAttributes<HTMLDivElement>,
        ref,
      ) {
        return <div ref={ref} {...props} />;
      }),
      "MockScrollAreaThumb",
    ),
    Corner: withDisplayName(
      React.forwardRef(function MockScrollAreaCorner(
        props: React.HTMLAttributes<HTMLDivElement>,
        ref,
      ) {
        return <div ref={ref} {...props} />;
      }),
      "MockScrollAreaCorner",
    ),
  };
});

import {ScrollArea} from "../src";

const setViewportDimensions = (
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

describe("ScrollArea", () => {
  it("renders the full structure for both orientations", () => {
    const {container} = render(
      <ScrollArea orientation="both">
        <div style={{height: 600, width: 600}}>content</div>
      </ScrollArea>,
    );

    expect(container.querySelector('[data-slot="base"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="viewport"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-slot="scrollbar"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-slot="thumb"]')).toHaveLength(2);
    expect(container.querySelector('[data-slot="corner"]')).not.toBeNull();
  });

  it("applies scroll shadow state to the viewport", () => {
    const {container} = render(
      <ScrollArea shadow orientation="both">
        <div style={{height: 600, width: 600}}>content</div>
      </ScrollArea>,
    );

    const viewport = container.querySelector('[data-slot="viewport"]') as HTMLDivElement;

    setViewportDimensions(viewport, {
      clientHeight: 100,
      scrollHeight: 300,
      clientWidth: 100,
      scrollWidth: 300,
      scrollTop: 20,
      scrollLeft: 10,
    });

    fireEvent.scroll(viewport);

    expect(viewport).toHaveAttribute("data-top-bottom-scroll", "true");
    expect(viewport).toHaveAttribute("data-left-right-scroll", "true");
  });

  it("hides scrollbars on mobile when requested", () => {
    const {container} = render(
      <ScrollArea hideScrollBarOnMobile orientation="vertical">
        <div style={{height: 600}}>content</div>
      </ScrollArea>,
    );

    const scrollbar = container.querySelector('[data-slot="scrollbar"]');

    expect(scrollbar?.className).toContain("hidden");
    expect(scrollbar?.className).toContain("sm:flex");
  });
});
