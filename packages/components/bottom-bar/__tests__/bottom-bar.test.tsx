import type {BottomBarProps} from "../src";

import * as React from "react";
import {render, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {HeroUIProvider} from "@sytechui/system";

import {BottomBar, BottomBarItem} from "../src";

function TestBottomBar(props: Omit<BottomBarProps, "children"> = {}) {
  return (
    <BottomBar aria-label="Primary navigation" {...props}>
      <BottomBarItem key="home">Home</BottomBarItem>
      <BottomBarItem key="activity">Activity</BottomBarItem>
      <BottomBarItem key="profile">Profile</BottomBarItem>
    </BottomBar>
  );
}

describe("BottomBar", () => {
  it("renders navigation links without tab semantics", () => {
    const {getByRole, queryByRole} = render(<TestBottomBar />);
    const navigation = getByRole("navigation", {name: "Primary navigation"});

    expect(within(navigation).getAllByRole("listitem")).toHaveLength(3);
    expect(within(navigation).getAllByRole("link")).toHaveLength(3);
    expect(queryByRole("tablist")).not.toBeInTheDocument();
    expect(queryByRole("tab")).not.toBeInTheDocument();
    expect(queryByRole("tabpanel")).not.toBeInTheDocument();
  });

  it("forwards refs to the navigation and link elements", () => {
    const navigationRef = React.createRef<HTMLElement>();
    const itemRef = React.createRef<HTMLAnchorElement>();

    render(
      <BottomBar ref={navigationRef} aria-label="Primary navigation">
        <BottomBarItem key="home" ref={itemRef} href="#home">
          Home
        </BottomBarItem>
      </BottomBar>,
    );

    expect(navigationRef.current?.tagName).toBe("NAV");
    expect(itemRef.current?.tagName).toBe("A");
  });

  it("selects the first enabled item by default", () => {
    const {getByRole} = render(
      <BottomBar aria-label="Primary navigation">
        <BottomBarItem key="disabled" isDisabled href="#disabled">
          Disabled
        </BottomBarItem>
        <BottomBarItem key="home" href="#home">
          Home
        </BottomBarItem>
      </BottomBar>,
    );

    expect(getByRole("link", {name: "Disabled"})).not.toHaveAttribute("aria-current");
    expect(getByRole("link", {name: "Home"})).toHaveAttribute("aria-current", "page");
  });

  it("supports uncontrolled selection", async () => {
    const user = userEvent.setup();
    const {getByRole} = render(<TestBottomBar defaultSelectedKey="activity" />);
    const activity = getByRole("link", {name: "Activity"});
    const profile = getByRole("link", {name: "Profile"});

    expect(activity).toHaveAttribute("aria-current", "page");
    expect(profile).not.toHaveAttribute("href");

    await user.click(profile);

    expect(activity).not.toHaveAttribute("aria-current");
    expect(profile).toHaveAttribute("aria-current", "page");
  });

  it("supports controlled selection", async () => {
    const user = userEvent.setup();
    const onSelectionChange = jest.fn();
    const wrapper = render(
      <TestBottomBar selectedKey="home" onSelectionChange={onSelectionChange} />,
    );
    const home = wrapper.getByRole("link", {name: "Home"});
    const profile = wrapper.getByRole("link", {name: "Profile"});

    await user.click(profile);

    expect(onSelectionChange).toHaveBeenCalledWith("profile");
    expect(home).toHaveAttribute("aria-current", "page");
    expect(profile).not.toHaveAttribute("aria-current");

    wrapper.rerender(<TestBottomBar selectedKey="profile" onSelectionChange={onSelectionChange} />);

    expect(home).not.toHaveAttribute("aria-current");
    expect(profile).toHaveAttribute("aria-current", "page");
  });

  it("does not report a selection change for the selected item", async () => {
    const user = userEvent.setup();
    const onSelectionChange = jest.fn();
    const {getByRole} = render(
      <TestBottomBar selectedKey="home" onSelectionChange={onSelectionChange} />,
    );

    await user.click(getByRole("link", {name: "Home"}));

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("does not select or press a disabled item", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    const onSelectionChange = jest.fn();
    const {getByRole} = render(
      <BottomBar
        aria-label="Primary navigation"
        selectedKey="home"
        onSelectionChange={onSelectionChange}
      >
        <BottomBarItem key="home" href="#home">
          Home
        </BottomBarItem>
        <BottomBarItem key="profile" isDisabled href="#profile" onPress={onPress}>
          Profile
        </BottomBarItem>
      </BottomBar>,
    );
    const profile = getByRole("link", {name: "Profile"});

    expect(profile).toHaveAttribute("aria-disabled", "true");

    await user.click(profile);

    expect(onPress).not.toHaveBeenCalled();
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(getByRole("link", {name: "Home"})).toHaveAttribute("aria-current", "page");
  });

  it("switches between default and selected icons", async () => {
    const user = userEvent.setup();
    const {getByRole, getByTestId, queryByTestId} = render(
      <BottomBar aria-label="Primary navigation" defaultSelectedKey="home">
        <BottomBarItem
          key="home"
          href="#home"
          icon={<span data-testid="home-default" />}
          selectedIcon={<span data-testid="home-selected" />}
        >
          Home
        </BottomBarItem>
        <BottomBarItem key="profile" href="#profile">
          Profile
        </BottomBarItem>
      </BottomBar>,
    );

    expect(getByTestId("home-selected")).toBeInTheDocument();
    expect(queryByTestId("home-default")).not.toBeInTheDocument();

    await user.click(getByRole("link", {name: "Profile"}));

    expect(getByTestId("home-default")).toBeInTheDocument();
    expect(queryByTestId("home-selected")).not.toBeInTheDocument();
  });

  it("keeps hidden labels accessible", () => {
    const {getByRole, getByText} = render(<TestBottomBar hideLabels />);

    expect(getByRole("link", {name: "Home"})).toBeInTheDocument();
    expect(getByText("Home")).toHaveClass("sr-only");
  });

  it("keeps prominent items as route links", () => {
    const {getByRole} = render(
      <BottomBar aria-label="Primary navigation">
        <BottomBarItem key="create" isProminent href="/create">
          Create
        </BottomBarItem>
      </BottomBar>,
    );
    const link = getByRole("link", {name: "Create"});

    expect(link).toHaveAttribute("href", "/create");
    expect(link).toHaveAttribute("data-prominent", "true");
    expect(link.closest("li")).toHaveAttribute("data-prominent", "true");
  });

  it("uses the provider href transformer", () => {
    const useHref = (href: string) => `/app${href}`;
    const {getByRole} = render(
      <HeroUIProvider navigate={jest.fn()} useHref={useHref}>
        <BottomBar aria-label="Primary navigation">
          <BottomBarItem key="home" href="/home">
            Home
          </BottomBarItem>
        </BottomBar>
      </HeroUIProvider>,
    );

    expect(getByRole("link", {name: "Home"})).toHaveAttribute("href", "/app/home");
  });

  it("applies custom classes to every slot", () => {
    const {container, getByRole, getByText} = render(
      <BottomBar
        aria-label="Primary navigation"
        classNames={{
          base: "custom-base",
          icon: "custom-icon",
          item: "custom-item",
          label: "custom-label",
          link: "custom-link",
          list: "custom-list",
          selectionIndicator: "custom-indicator",
        }}
      >
        <BottomBarItem key="home" href="#home" icon={<span>Icon</span>}>
          Home
        </BottomBarItem>
      </BottomBar>,
    );

    expect(getByRole("navigation")).toHaveClass("custom-base");
    expect(getByRole("list")).toHaveClass("custom-list");
    expect(getByRole("listitem")).toHaveClass("custom-item");
    expect(getByRole("link", {name: "Home"})).toHaveClass("custom-link");
    expect(container.querySelector("[data-slot='selectionIndicator']")).toHaveClass(
      "custom-indicator",
    );
    expect(container.querySelector("[data-slot='icon']")).toHaveClass("custom-icon");
    expect(getByText("Home")).toHaveClass("custom-label");
  });

  it("moves one shared selection indicator between routes", () => {
    const rectSpy = jest
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        if (this.dataset.slot === "list") {
          return {height: 60, left: 10, top: 20, width: 300} as DOMRect;
        }

        if (this.dataset.slot === "link") {
          const left = this.textContent === "Home" ? 20 : 210;

          return {height: 48, left, top: 26, width: 90} as DOMRect;
        }

        return {height: 0, left: 0, top: 0, width: 0} as DOMRect;
      });

    try {
      const view = render(<TestBottomBar selectedKey="home" />);
      const indicator = view.container.querySelector<HTMLElement>(
        "[data-slot='selectionIndicator']",
      );

      expect(view.container.querySelectorAll("[data-slot='selectionIndicator']")).toHaveLength(1);
      expect(indicator?.parentElement).toBe(view.getByRole("list"));
      expect(indicator).toHaveStyle({height: "36px", left: "18px", width: "74px"});

      view.rerender(<TestBottomBar selectedKey="profile" />);

      expect(indicator).toHaveStyle({left: "208px"});
    } finally {
      rectSpy.mockRestore();
    }
  });
});
