import * as React from "react";
import {render} from "@testing-library/react";

import {Divider, LabeledDivider} from "../src";

describe("Divider", () => {
  it("renders a horizontal separator by default", () => {
    const {getByRole} = render(<Divider />);
    const divider = getByRole("separator");

    expect(divider.tagName).toBe("HR");
    expect(divider).toHaveAttribute("data-orientation", "horizontal");
    expect(divider).not.toHaveAttribute("aria-orientation");
  });

  it("renders an accessible vertical separator", () => {
    const {getByRole} = render(<Divider orientation="vertical" />);
    const divider = getByRole("separator");

    expect(divider.tagName).toBe("DIV");
    expect(divider).toHaveAttribute("data-orientation", "vertical");
    expect(divider).toHaveAttribute("aria-orientation", "vertical");
    expect(divider).toHaveClass("self-stretch");
  });

  it("renders an inset divider with a centered visual line", () => {
    const {getByRole} = render(<Divider inset="sm" orientation="vertical" />);
    const divider = getByRole("separator");

    expect(divider).toHaveClass("after:inset-y-[10%]");
    expect(divider).toHaveClass("bg-transparent");
    expect(divider).not.toHaveAttribute("inset");
  });

  it("supports a half-length horizontal divider", () => {
    const {getByRole} = render(<Divider inset="md" />);
    const divider = getByRole("separator");

    expect(divider.tagName).toBe("DIV");
    expect(divider).toHaveClass("after:inset-x-1/4");
    expect(divider).not.toHaveAttribute("aria-orientation");
  });

  it("preserves vertical semantics for a custom component", () => {
    const CustomDivider = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
      function CustomDivider(props, ref) {
        return <section ref={ref} {...props} />;
      },
    );
    const {getByRole} = render(<Divider as={CustomDivider} orientation="vertical" />);
    const divider = getByRole("separator");

    expect(divider.tagName).toBe("SECTION");
    expect(divider).toHaveAttribute("aria-orientation", "vertical");
  });

  it("can be purely decorative", () => {
    const {container, queryByRole} = render(<Divider isDecorative />);

    expect(queryByRole("separator")).toBeNull();
    expect(container.firstChild).toHaveAttribute("role", "presentation");
  });

  it("ref should be forwarded", () => {
    const ref = React.createRef<HTMLElement>();

    render(<Divider ref={ref} />);
    expect(ref.current).not.toBeNull();
  });

  it("should render with custom className", () => {
    const {container} = render(<Divider className="custom-class-name" />);

    expect(container.firstChild).toHaveClass("custom-class-name");
  });
});

describe("LabeledDivider", () => {
  it("renders accessible content between decorative lines", () => {
    const {container, getByText, queryByRole} = render(<LabeledDivider>OR</LabeledDivider>);
    const lines = container.querySelectorAll('[data-slot="line"]');

    expect(getByText("OR")).toBeVisible();
    expect(queryByRole("separator")).toBeNull();
    expect(lines).toHaveLength(2);
    lines.forEach((line) => expect(line).toHaveAttribute("aria-hidden", "true"));
  });

  it("supports slot class names", () => {
    const {container, getByText} = render(
      <LabeledDivider
        className="custom-base"
        classNames={{label: "custom-label", line: "custom-line"}}
      >
        Today
      </LabeledDivider>,
    );

    expect(container.firstChild).toHaveClass("custom-base");
    expect(getByText("Today")).toHaveClass("custom-label");
    expect(container.querySelectorAll(".custom-line")).toHaveLength(2);
  });

  it("forwards its ref", () => {
    const ref = React.createRef<HTMLDivElement>();

    render(<LabeledDivider ref={ref}>OR</LabeledDivider>);

    expect(ref.current).not.toBeNull();
  });
});
