import * as React from "react";
import {render, screen} from "@testing-library/react";

import {Alert} from "../src";

const renderAlert = (status: Alert.Props["status"] = "default") =>
  render(
    <Alert status={status}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Testing Title</Alert.Title>
        <Alert.Description>Testing Description</Alert.Description>
      </Alert.Content>
    </Alert>,
  );

describe("Alert", () => {
  it("renders the v3 anatomy and forwards the root ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    const {container} = render(
      <Alert ref={ref}>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Testing Title</Alert.Title>
          <Alert.Description>Testing Description</Alert.Description>
        </Alert.Content>
      </Alert>,
    );

    expect(ref.current).toBe(screen.getByRole("alert"));
    expect(container.querySelector('[data-slot="alert-indicator"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="alert-content"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="alert-title"]')).toHaveTextContent("Testing Title");
    expect(container.querySelector('[data-slot="alert-description"]')).toHaveTextContent(
      "Testing Description",
    );
  });

  it.each([
    ["default", "border-default-300"],
    ["accent", "border-primary-300"],
    ["success", "border-success-300"],
    ["warning", "border-warning-300"],
    ["danger", "border-danger-300"],
  ] as const)("applies the %s status styles", (status, borderClass) => {
    const {container} = renderAlert(status);
    const indicator = container.querySelector('[data-slot="alert-indicator"]');

    expect(container.querySelector('[data-slot="alert-root"]')).toHaveClass(
      "bg-[oklch(100%_0_0)]",
      borderClass,
    );
    expect(indicator?.className).toContain(status === "default" ? "text-inherit" : "color-mix");
  });

  it("renders a visible success icon", () => {
    const {container} = renderAlert("success");

    expect(container.querySelector('[data-slot="alert-default-icon"]')).toHaveAttribute(
      "fill",
      "currentColor",
    );
  });

  it("renders a custom indicator instead of the default icon", () => {
    const {container} = render(
      <Alert status="success">
        <Alert.Indicator>
          <span data-testid="custom-icon">custom</span>
        </Alert.Indicator>
      </Alert>,
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="alert-indicator"]')).toHaveClass("size-6");
    expect(container.querySelector('[data-slot="alert-default-icon"]')).not.toBeInTheDocument();
  });

  it("supports slot class names and polymorphic elements", () => {
    render(
      <Alert
        as="section"
        className="custom-root"
        classNames={{content: "custom-content", title: "shared-title"}}
      >
        <Alert.Content>
          <Alert.Title as="h2" className="custom-title">
            Heading
          </Alert.Title>
        </Alert.Content>
      </Alert>,
    );

    expect(screen.getByRole("alert")).toHaveClass("custom-root");
    expect(screen.getByRole("heading", {level: 2})).toHaveClass("shared-title", "custom-title");
    expect(screen.getByRole("heading", {level: 2}).parentElement).toHaveClass("custom-content");
  });

  it.each([
    ["none", "rounded-none"],
    ["sm", "rounded-small"],
    ["md", "rounded-medium"],
    ["lg", "rounded-[24px]"],
    ["full", "rounded-full"],
  ] as const)("applies the %s radius", (radius, className) => {
    render(<Alert radius={radius}>Content</Alert>);

    expect(screen.getByRole("alert")).toHaveClass(className);
  });
});
