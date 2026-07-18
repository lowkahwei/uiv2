import type {UserEvent} from "@testing-library/user-event";

import * as React from "react";
import {render, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {Stepper, StepperItem} from "../src";

const steps = (
  <>
    <StepperItem key="account" title="Account" />
    <StepperItem key="verify" description="Verify your email" title="Verification" />
    <StepperItem key="complete" title="Complete" />
  </>
);

describe("Stepper", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders an accessible ordered list and infers linear statuses", () => {
    const {getByRole, getAllByRole, container} = render(
      <Stepper aria-label="Account setup" currentKey="verify">
        {steps}
      </Stepper>,
    );

    expect(getByRole("list", {name: "Account setup"})).toBeInTheDocument();
    expect(getAllByRole("listitem")).toHaveLength(3);
    expect(container.querySelector('[data-key="account"]')).toHaveAttribute(
      "data-status",
      "complete",
    );
    expect(container.querySelector('[data-key="verify"]')).toHaveAttribute(
      "data-status",
      "current",
    );
    expect(container.querySelector('[data-key="complete"]')).toHaveAttribute(
      "data-status",
      "pending",
    );
    expect(container.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
  });

  it("is non-interactive without onCurrentChange", () => {
    const {queryAllByRole} = render(
      <Stepper aria-label="Account setup" currentKey="account">
        {steps}
      </Stepper>,
    );

    expect(queryAllByRole("button")).toHaveLength(0);
  });

  it("requests controlled changes from pointer and keyboard input", async () => {
    const onCurrentChange = jest.fn();
    const {getByRole} = render(
      <Stepper aria-label="Account setup" currentKey="account" onCurrentChange={onCurrentChange}>
        {steps}
      </Stepper>,
    );
    const verification = getByRole("button", {name: /Verification/});
    const complete = getByRole("button", {name: "Complete"});

    await user.click(verification);
    verification.focus();
    await user.keyboard("[Enter]");
    complete.focus();
    await user.keyboard("[Space]");

    expect(onCurrentChange).toHaveBeenNthCalledWith(1, "verify");
    expect(onCurrentChange).toHaveBeenNthCalledWith(2, "verify");
    expect(onCurrentChange).toHaveBeenNthCalledWith(3, "complete");
  });

  it("does not request changes for the current or disabled steps", async () => {
    const onCurrentChange = jest.fn();
    const {getByRole} = render(
      <Stepper aria-label="Account setup" currentKey="account" onCurrentChange={onCurrentChange}>
        <StepperItem key="account" title="Account" />
        <StepperItem key="verify" isDisabled title="Verification" />
      </Stepper>,
    );

    await user.click(getByRole("button", {name: "Account"}));
    await user.click(getByRole("button", {name: "Verification"}));

    expect(getByRole("button", {name: "Verification"})).toBeDisabled();
    expect(onCurrentChange).not.toHaveBeenCalled();
  });

  it("disables every trigger when the stepper is disabled", () => {
    const {getAllByRole} = render(
      <Stepper
        isDisabled
        aria-label="Account setup"
        currentKey="account"
        onCurrentChange={() => {}}
      >
        {steps}
      </Stepper>,
    );

    expect(getAllByRole("button")).toHaveLength(3);
    getAllByRole("button").forEach((trigger) => expect(trigger).toBeDisabled());
  });

  it("supports a completed process and explicit status overrides", () => {
    const {container, getByRole} = render(
      <Stepper isComplete aria-label="Account setup">
        <StepperItem key="account" title="Account" />
        <StepperItem key="verify" status="loading" statusLabel="Loading" title="Verification" />
        <StepperItem key="complete" status="error" title="Complete" />
      </Stepper>,
    );

    expect(container.querySelector('[data-key="account"]')).toHaveAttribute(
      "data-status",
      "complete",
    );
    expect(container.querySelector('[data-key="verify"]')).toHaveAttribute(
      "data-status",
      "loading",
    );
    expect(container.querySelector('[data-key="complete"]')).toHaveAttribute(
      "data-status",
      "error",
    );
    expect(getByRole("list", {name: "Account setup"})).not.toContainElement(
      container.querySelector('[aria-current="step"]'),
    );
    expect(container.querySelector('[data-key="verify"] [aria-busy="true"]')).toBeInTheDocument();
    expect(
      within(container.querySelector('[data-key="verify"]')!).getByText("Loading"),
    ).toHaveClass("sr-only");
  });

  it("supports dynamic items with a render function", () => {
    const items = [
      {id: "account", title: "Account"},
      {id: "verify", title: "Verification"},
    ];
    const {getAllByRole} = render(
      <Stepper aria-label="Account setup" currentKey="account" items={items}>
        {(item) => <StepperItem key={item.id} title={item.title} />}
      </Stepper>,
    );

    expect(getAllByRole("listitem")).toHaveLength(2);
  });

  it("forwards root and trigger refs", () => {
    const rootRef = React.createRef<HTMLElement>();
    const triggerRef = React.createRef<HTMLButtonElement>();

    render(
      <Stepper
        ref={rootRef}
        aria-label="Account setup"
        currentKey="account"
        onCurrentChange={() => {}}
      >
        <StepperItem key="account" title="Account" triggerRef={triggerRef} />
      </Stepper>,
    );

    expect(rootRef.current).not.toBeNull();
    expect(triggerRef.current).not.toBeNull();
  });

  it("exposes orientation and semantic slots", () => {
    const {container} = render(
      <Stepper
        aria-label="Account setup"
        classNames={{indicator: "custom-indicator"}}
        currentKey="account"
        orientation="vertical"
      >
        {steps}
      </Stepper>,
    );

    expect(container.firstElementChild).toHaveAttribute("data-orientation", "vertical");
    expect(container.querySelector("[data-slot='indicator']")).toHaveClass("custom-indicator");
  });

  it("renders dot indicators without step numbers", () => {
    const {container} = render(
      <Stepper aria-label="Account setup" currentKey="verify" variant="dot">
        {steps}
      </Stepper>,
    );

    expect(container.querySelectorAll("[data-slot='indicator']")).toHaveLength(3);
    expect(container.querySelector("[data-slot='indicator']")).toBeEmptyDOMElement();
    expect(container.querySelector("[data-slot='indicator']")).toHaveClass("h-2.5");
  });
});
