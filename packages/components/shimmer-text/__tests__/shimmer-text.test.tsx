import * as React from "react";
import {render} from "@testing-library/react";
import {HeroUIProvider} from "@sytechui/system";
import {spy, shouldIgnoreReactWarning} from "@sytechui/test-utils";

import {ShimmerText} from "../src";

describe("ShimmerText", () => {
  it("renders text without changing its semantics", () => {
    const wrapper = render(<ShimmerText>Generating response…</ShimmerText>);
    const element = wrapper.getByText("Generating response…");

    expect(element.tagName).toBe("SPAN");
    expect(element).not.toHaveAttribute("role");
    expect(element).toHaveClass("sytech-shimmer-text", "animate-shimmer-text");

    if (shouldIgnoreReactWarning(spy)) {
      return;
    }

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it("forwards its ref and native props", () => {
    const ref = React.createRef<HTMLParagraphElement>();

    render(
      <ShimmerText
        ref={ref}
        aria-label="Progress"
        as="p"
        className="text-primary"
        data-testid="shimmer"
      >
        Working
      </ShimmerText>,
    );

    expect(ref.current?.tagName).toBe("P");
    expect(ref.current).toHaveAttribute("aria-label", "Progress");
    expect(ref.current).toHaveClass("text-primary");
  });

  it("maps animation controls to styles and classes", () => {
    const wrapper = render(
      <ShimmerText once reverse angle={45} duration={1200} spread={80}>
        Working
      </ShimmerText>,
    );
    const element = wrapper.getByText("Working");

    expect(element).toHaveClass("sytech-shimmer-text-reverse", "sytech-shimmer-text-once");
    expect(element.style.getPropertyValue("--shimmer-duration")).toBe("1200ms");
    expect(element.style.getPropertyValue("--shimmer-spread")).toBe("80px");
    expect(element.style.getPropertyValue("--shimmer-angle")).toBe("45deg");
  });

  it("accepts a CSS length for spread", () => {
    const wrapper = render(<ShimmerText spread="5rem">Working</ShimmerText>);

    expect(wrapper.getByText("Working").style.getPropertyValue("--shimmer-spread")).toBe("5rem");
  });

  it("respects the provider animation setting and local override", () => {
    const wrapper = render(
      <HeroUIProvider disableAnimation>
        <ShimmerText>Disabled globally</ShimmerText>
        <ShimmerText disableAnimation={false}>Enabled locally</ShimmerText>
      </HeroUIProvider>,
    );

    expect(wrapper.getByText("Disabled globally")).toHaveClass("sytech-shimmer-text-disabled");
    expect(wrapper.getByText("Enabled locally")).not.toHaveClass("sytech-shimmer-text-disabled");
  });
});
