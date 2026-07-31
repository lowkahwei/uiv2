import * as React from "react";
import {fireEvent, render, waitFor} from "@testing-library/react";

import {calculateColumnGeometry, Table} from "../src";
import {getPinnedShadowColumns, normalizeScrollOffset} from "../src/column-geometry";

const mockVirtualizer = jest.fn(({children}: {children: React.ReactNode}) => (
  <React.Fragment>{children}</React.Fragment>
));

jest.mock("react-aria-components/Virtualizer", () => {
  const actual = jest.requireActual("react-aria-components/Virtualizer");

  return {
    ...actual,
    Virtualizer: (props: {children: React.ReactNode}) => mockVirtualizer(props),
  };
});

describe("calculateColumnGeometry", () => {
  it("distributes remaining width between fixed and flex columns", () => {
    const geometry = calculateColumnGeometry(
      [
        {id: "selection", width: 50},
        {id: "name", flex: 2, minWidth: 100},
        {id: "role", flex: 1, minWidth: 100},
      ],
      500,
    );

    expect(geometry.widths.get("selection")).toBe(75);
    expect(geometry.widths.get("name")).toBe(250);
    expect(geometry.widths.get("role")).toBe(175);
    expect(geometry.totalWidth).toBe(500);
    expect(geometry.hasHorizontalOverflow).toBe(false);
  });

  it("redistributes flex space when a column reaches its maximum", () => {
    const geometry = calculateColumnGeometry(
      [
        {id: "name", flex: 1, maxWidth: 150, minWidth: 100},
        {id: "role", flex: 1, minWidth: 100},
      ],
      500,
    );

    expect(geometry.widths.get("name")).toBe(150);
    expect(geometry.widths.get("role")).toBe(350);
  });

  it("preserves minimum widths and reports horizontal overflow", () => {
    const geometry = calculateColumnGeometry(
      [
        {id: "name", minWidth: 180},
        {id: "role", minWidth: 160},
      ],
      300,
    );

    expect(geometry.totalWidth).toBe(340);
    expect(geometry.hasHorizontalOverflow).toBe(true);
  });

  it("fills the viewport when every column is fixed and fillContainer is enabled", () => {
    const geometry = calculateColumnGeometry(
      [
        {id: "name", width: 100},
        {id: "role", width: 150},
      ],
      500,
      new Map(),
      true,
    );

    expect(geometry.widths.get("name")).toBe(225);
    expect(geometry.widths.get("role")).toBe(275);
    expect(geometry.totalWidth).toBe(500);
  });

  it("uses resized widths as fixed values while preserving constraints", () => {
    const geometry = calculateColumnGeometry(
      [
        {id: "name", flex: 1, maxWidth: 240, minWidth: 100, pinned: "start"},
        {id: "role", flex: 1, minWidth: 100, pinned: "start"},
      ],
      500,
      new Map([["name", 300]]),
    );

    expect(geometry.widths.get("name")).toBe(240);
    expect(geometry.widths.get("role")).toBe(260);
    expect(geometry.byId.get("role")?.pinnedOffset).toBe(240);
  });

  it("preserves column order and calculates pinned offsets from both edges", () => {
    const geometry = calculateColumnGeometry(
      [
        {id: "name", minWidth: 100},
        {id: "actions", pinned: "end", width: 90},
        {id: "selection", pinned: "start", width: 80},
        {id: "status", pinned: "end", width: 110},
      ],
      500,
    );

    expect(geometry.columns.map((column) => column.id)).toEqual([
      "name",
      "actions",
      "selection",
      "status",
    ]);
    expect(geometry.byId.get("selection")?.pinnedOffset).toBe(0);
    expect(geometry.byId.get("status")?.pinnedOffset).toBe(0);
    expect(geometry.byId.get("actions")?.pinnedOffset).toBe(110);
  });

  it("reports pinned widths that leave no scrollable center area", () => {
    const geometry = calculateColumnGeometry(
      [
        {id: "selection", pinned: "start", width: 80},
        {id: "name", width: 100},
        {id: "actions", pinned: "end", width: 120},
      ],
      200,
    );

    expect(geometry.pinnedStartWidth).toBe(80);
    expect(geometry.pinnedEndWidth).toBe(120);
    expect(geometry.hasValidPinnedWidth).toBe(false);
  });

  it("selects only the outermost active column in each sticky stack", () => {
    const geometry = calculateColumnGeometry(
      [
        {id: "first", pinned: "start", width: 100},
        {id: "second", width: 100},
        {id: "third", pinned: "start", width: 100},
        {id: "fourth", pinned: "end", width: 100},
        {id: "fifth", width: 100},
        {id: "sixth", pinned: "end", width: 100},
      ],
      300,
    );

    const atRest = getPinnedShadowColumns(geometry, 0);

    expect(atRest.start).toBeUndefined();
    expect(atRest.end).toMatchObject({id: "fourth"});
    expect(getPinnedShadowColumns(geometry, 150)).toMatchObject({
      end: {id: "fourth"},
      start: {id: "third"},
    });
    expect(getPinnedShadowColumns(geometry, 350)).toMatchObject({
      start: {id: "third"},
    });
    // Scrolled to the maximum offset: the end stack has fully arrived, so no column
    // is mid-transition anymore and the end shadow disappears (matches antd behavior).
    const maxScrollOffset = geometry.totalWidth - geometry.viewportWidth;

    expect(getPinnedShadowColumns(geometry, maxScrollOffset).end).toBeUndefined();
  });

  it("does not select pinned shadows without horizontal overflow", () => {
    const geometry = calculateColumnGeometry(
      [
        {id: "first", pinned: "start", width: 100},
        {id: "second", pinned: "end", width: 100},
      ],
      200,
    );

    expect(getPinnedShadowColumns(geometry, 0)).toEqual({});
  });

  it("rejects duplicate column ids", () => {
    expect(() => calculateColumnGeometry([{id: "name"}, {id: "name"}], 500)).toThrow(
      "Duplicate table column id: name",
    );
  });
});

describe("normalizeScrollOffset", () => {
  it("normalizes and clamps LTR and RTL browser scroll values", () => {
    expect(normalizeScrollOffset(120, 300, "ltr")).toBe(120);
    expect(normalizeScrollOffset(-120, 300, "rtl")).toBe(120);
    expect(normalizeScrollOffset(-350, 300, "rtl")).toBe(300);
  });
});

describe("Root isVirtualized", () => {
  beforeEach(() => {
    mockVirtualizer.mockClear();
  });

  it("provides resolved column widths to React Aria TableLayout", async () => {
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(500);
    const geometryColumns = [
      {id: "name", flex: 2, minWidth: 100},
      {id: "role", flex: 1, minWidth: 100},
    ];

    render(<Table isVirtualized columns={geometryColumns} />);

    await waitFor(() => {
      const calls = mockVirtualizer.mock.calls;
      const layoutOptions = calls[calls.length - 1]?.[0].layoutOptions;

      expect([...layoutOptions.columnWidths]).toEqual([
        ["name", 300],
        ["role", 200],
      ]);
    });

    clientWidth.mockRestore();
  });

  it("measures the grid viewport instead of the outer wrapper", async () => {
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockImplementation(function (this: HTMLElement) {
        return this.getAttribute("role") === "grid" ? 320 : 500;
      });

    render(
      <Table
        isVirtualized
        columns={[
          {id: "name", flex: 1},
          {id: "role", flex: 1},
        ]}
      >
        <div role="grid" />
      </Table>,
    );

    await waitFor(() => {
      const calls = mockVirtualizer.mock.calls;
      const layoutOptions = calls[calls.length - 1]?.[0].layoutOptions;

      expect([...layoutOptions.columnWidths]).toEqual([
        ["name", 160],
        ["role", 160],
      ]);
    });

    clientWidth.mockRestore();
  });
});

describe("Root native geometry mode", () => {
  it("measures the retained scroll viewport when removeWrapper is enabled", () => {
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockImplementation(function (this: HTMLElement) {
        return this.hasAttribute("data-table-scroll-container") ? 240 : 600;
      });
    const wrapper = render(
      <Table
        removeWrapper
        columns={[
          {id: "name", flex: 1},
          {id: "role", flex: 1},
        ]}
      >
        <Table.Content aria-label="Wrapperless geometry table">
          <Table.Header>
            <Table.Column id="name">Name</Table.Column>
            <Table.Column id="role">Role</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Ada</Table.Cell>
              <Table.Cell>Engineer</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    expect(wrapper.container.querySelectorAll("[data-table-scroll-container]")).toHaveLength(1);
    expect(wrapper.getAllByRole("columnheader")[0]).toHaveStyle({width: "120px"});
    expect(wrapper.getAllByRole("columnheader")[1]).toHaveStyle({width: "120px"});

    clientWidth.mockRestore();
  });

  it("applies the same widths to the native table and footer", () => {
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(300);

    const wrapper = render(
      <Table
        columns={[
          {id: "name", width: 100},
          {id: "role", width: 200},
          {id: "actions", width: 100},
        ]}
      >
        <Table.Content aria-label="Managed geometry table">
          <Table.Header>
            <Table.Column id="name">Name</Table.Column>
            <Table.Column id="role">Role</Table.Column>
            <Table.Column id="actions">Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Ada</Table.Cell>
              <Table.Cell>Engineer</Table.Cell>
              <Table.Cell>Edit</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row id="footer">
              <Table.Cell>Name total</Table.Cell>
              <Table.Cell>Role total</Table.Cell>
              <Table.Cell>Actions total</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Content>
      </Table>,
    );
    const table = wrapper.getByRole("grid");
    const columns = wrapper.getAllByRole("columnheader");
    const footer = wrapper.getByText("Name total").closest("tfoot");

    expect(table).toHaveStyle({tableLayout: "fixed", width: "400px"});
    expect(table).toHaveStyle({minWidth: "400px"});
    expect(columns[0]).toHaveStyle({width: "100px"});
    expect(columns[2]).toHaveStyle({width: "100px"});
    expect(footer?.tagName).toBe("TFOOT");
    clientWidth.mockRestore();
  });

  it("pins aligned footer cells with the same offsets and shadows as their columns", () => {
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(240);
    const wrapper = render(
      <Table
        columns={[
          {id: "name", pinned: "start", width: 100},
          {id: "role", width: 180},
          {id: "actions", pinned: "end", width: 100},
        ]}
      >
        <Table.Content aria-label="Pinned footer table">
          <Table.Header>
            <Table.Column id="name">Name</Table.Column>
            <Table.Column id="role">Role</Table.Column>
            <Table.Column id="actions">Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Ada</Table.Cell>
              <Table.Cell>Engineer</Table.Cell>
              <Table.Cell>Edit</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer isSticky>
            <Table.Row id="footer">
              <Table.Cell>1 member</Table.Cell>
              <Table.Cell>1 role</Table.Cell>
              <Table.Cell>1 action</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Content>
      </Table>,
    );
    const footer = wrapper.getByText("1 member").closest("tfoot");
    const geometryStyle =
      wrapper.container.querySelector("[data-table-geometry] style")?.textContent ?? "";

    expect(footer?.tagName).toBe("TFOOT");
    expect(geometryStyle).toContain("tfoot > tr > td:nth-child(1)");
    expect(geometryStyle).toContain("tfoot > tr > td:nth-child(3)");
    expect(geometryStyle).toContain(
      "background-color: var(--table-pinned-footer-bg, var(--table-pinned-bg))",
    );
    expect(geometryStyle).toContain("tfoot > tr > td:nth-child(1)::after");
    expect(geometryStyle).toContain("tfoot > tr > td:nth-child(3)::after");

    clientWidth.mockRestore();
  });

  it("keeps exact fixed widths when fullWidth is disabled", () => {
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(500);
    const wrapper = render(
      <Table
        columns={[
          {id: "name", width: 100},
          {id: "role", width: 100},
        ]}
        fullWidth={false}
      >
        <Table.Content aria-label="Fixed managed geometry table">
          <Table.Header>
            <Table.Column id="name">Name</Table.Column>
            <Table.Column id="role">Role</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Ada</Table.Cell>
              <Table.Cell>Engineer</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row id="footer">
              <Table.Cell>Name total</Table.Cell>
              <Table.Cell>Role total</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Content>
      </Table>,
    );

    expect(wrapper.getByRole("grid")).toHaveStyle({
      minWidth: "200px",
      width: "200px",
    });
    expect(wrapper.getByText("Name total").closest("tfoot")?.tagName).toBe("TFOOT");
    clientWidth.mockRestore();
  });

  it("warns when pinned columns consume the entire viewport", async () => {
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(200);
    const warn = jest.spyOn(console, "warn").mockImplementation();

    render(
      <Table
        columns={[
          {id: "name", pinned: "start", width: 100},
          {id: "actions", pinned: "end", width: 100},
        ]}
      >
        <Table.Content aria-label="Invalid pinned geometry table">
          <Table.Header>
            <Table.Column id="name">Name</Table.Column>
            <Table.Column id="actions">Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Ada</Table.Cell>
              <Table.Cell>Edit</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    await waitFor(() => {
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("preserve scrollable content"));
    });

    warn.mockRestore();
    clientWidth.mockRestore();
  });

  it("makes isResizable a geometry owner when columns are provided", () => {
    const wrapper = render(
      <Table isResizable columns={[{id: "name", width: 160}]}>
        <Table.Content aria-label="Resizable geometry table">
          <Table.Header>
            <Table.Column id="name">Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Ada</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    expect(wrapper.getByRole("grid")).toHaveStyle({tableLayout: "fixed"});
    expect(wrapper.getByRole("columnheader")).toHaveStyle({width: "160px"});
  });

  it("updates native pinned shadow frontiers without a React render", async () => {
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(200);
    const warn = jest.spyOn(console, "warn").mockImplementation();
    const wrapper = render(
      <Table
        removeWrapper
        columns={[
          {id: "first", pinned: "start", width: 100},
          {id: "second", width: 100},
          {id: "third", pinned: "start", width: 100},
          {id: "fourth", pinned: "end", width: 100},
        ]}
      >
        <Table.Content aria-label="Pinned columns table">
          <Table.Header>
            <Table.Column id="first">First</Table.Column>
            <Table.Column id="second">Second</Table.Column>
            <Table.Column id="third">Third</Table.Column>
            <Table.Column id="fourth">Fourth</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>1</Table.Cell>
              <Table.Cell>2</Table.Cell>
              <Table.Cell>3</Table.Cell>
              <Table.Cell>4</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );
    const geometryContainer = wrapper.container.querySelector<HTMLElement>("[data-table-geometry]");
    const scrollContainer = wrapper.container.querySelector<HTMLElement>(
      "[data-table-scroll-container]",
    );

    expect(scrollContainer).not.toBeNull();
    expect(wrapper.container.querySelectorAll("[data-table-scroll-container]")).toHaveLength(1);
    // At rest (no scroll), the start stack hasn't crossed its sticky threshold yet, so no
    // shadow shows — only the end stack, already up against the viewport edge, does.
    expect(geometryContainer).not.toHaveAttribute("data-table-start-shadow");
    expect(geometryContainer).toHaveAttribute("data-table-end-shadow", "4");
    expect(geometryContainer?.querySelector("style")).toHaveTextContent(
      "var(--table-pinned-shadow, color-mix(in srgb, currentColor 28%, transparent)) inset",
    );
    expect(geometryContainer?.querySelector("style")).toHaveTextContent(":dir(rtl)::after");
    expect(wrapper.getByText("First")).toHaveStyle({
      insetInlineStart: "0",
      position: "sticky",
    });
    expect(wrapper.getByText("Fourth")).toHaveStyle({
      insetInlineEnd: "0",
      position: "sticky",
    });

    if (scrollContainer) {
      scrollContainer.scrollLeft = 150;
      fireEvent.scroll(scrollContainer);
    }

    await waitFor(() => {
      expect(geometryContainer).toHaveAttribute("data-table-start-shadow", "3");
    });

    // Regression: the generated box-shadow rule must actually match the pinned th/td it names —
    // a stray extra `[data-table-geometry]` prefix on top of the already-prefixed cell selector
    // makes it require a second, nested geometry container that never exists, so it silently
    // matches nothing and no shadow ever renders, however the shadow attribute/scroll state.
    const shadowRule = Array.from(
      geometryContainer?.querySelector("style")?.sheet?.cssRules ?? [],
    ).find(
      (rule): rule is CSSStyleRule =>
        rule.cssText.includes("box-shadow") && rule.cssText.includes('data-table-start-shadow="3"'),
    );

    expect(shadowRule).toBeDefined();
    for (const selector of shadowRule!.selectorText.split(",")) {
      expect(
        wrapper.container.querySelector(selector.trim().replace(/::after$/, "")),
      ).not.toBeNull();
    }

    if (scrollContainer) {
      scrollContainer.scrollLeft = 250;
      fireEvent.scroll(scrollContainer);
    }

    await waitFor(() => {
      expect(geometryContainer).not.toHaveAttribute("data-table-end-shadow");
    });

    clientWidth.mockRestore();
    warn.mockRestore();
  });

  it("keeps pinned shadows outside truncated striped body cells", () => {
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(200);
    const warn = jest.spyOn(console, "warn").mockImplementation();
    const wrapper = render(
      <Table
        isStriped
        columns={[
          {id: "name", pinned: "start", width: 100},
          {id: "role", width: 160},
          {id: "actions", pinned: "end", width: 140},
        ]}
        overflowMode="truncate"
      >
        <Table.Content aria-label="Truncated pinned columns table">
          <Table.Header>
            <Table.Column id="name">Name</Table.Column>
            <Table.Column id="role">Role</Table.Column>
            <Table.Column id="actions">Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Very long member name</Table.Cell>
              <Table.Cell>Engineering</Table.Cell>
              <Table.Cell>
                <div data-testid="action-buttons">
                  <button type="button">Edit</button>
                  <button type="button">Delete</button>
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );
    const cells = wrapper.getAllByRole("gridcell");
    const contentWrappers = wrapper.container.querySelectorAll("[data-table-cell-content]");
    const geometryStyle =
      wrapper.container.querySelector("[data-table-geometry] style")?.textContent ?? "";

    expect(cells).toHaveLength(3);
    expect(contentWrappers).toHaveLength(3);
    for (const cell of cells) {
      expect(cell).toHaveClass("whitespace-normal", "break-words");
      expect(cell).not.toHaveClass("truncate");
    }
    for (const content of contentWrappers) {
      expect(content).toHaveClass("truncate");
    }
    expect(wrapper.getByTestId("action-buttons").closest("td")).toBe(cells[2]);
    expect(cells[0]).toHaveClass("group-even/tr:before:bg-default-100/50");
    expect(geometryStyle).toContain("thead > tr > th:nth-child(1)::after, [data-table-geometry");
    expect(geometryStyle).toContain("tbody > tr > td:nth-child(1)::after");
    expect(geometryStyle).toContain("tbody > tr > td:nth-child(3)::after");
    expect(geometryStyle).toContain(":dir(rtl)::after");
    expect(geometryStyle).toContain("background-color: var(--table-pinned-bg)");

    clientWidth.mockRestore();
    warn.mockRestore();
  });

  it("gives start-pinned cells a higher stacking priority than end-pinned cells", () => {
    // Both sides get `position: sticky` unconditionally (not just while actually stuck), so an
    // end-pinned column sliding through its natural scroll position can geometrically cross an
    // already-stuck start-pinned one. Without a deterministic z-index, whichever happens to sit
    // later in the column list wins the paint order by DOM-order tiebreak — start must always
    // win instead, regardless of column order.
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(300);
    const wrapper = render(
      <Table
        columns={[
          {id: "name", width: 100},
          {id: "role", pinned: "start", width: 100},
          {id: "status", width: 100},
          {id: "email", pinned: "end", width: 100},
        ]}
      >
        <Table.Content aria-label="Stacking priority table">
          <Table.Header>
            <Table.Column id="name">Name</Table.Column>
            <Table.Column id="role">Role</Table.Column>
            <Table.Column id="status">Status</Table.Column>
            <Table.Column id="email">Email</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>1</Table.Cell>
              <Table.Cell>2</Table.Cell>
              <Table.Cell>3</Table.Cell>
              <Table.Cell>4</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );
    const geometryContainer = wrapper.container.querySelector<HTMLElement>("[data-table-geometry]");
    const styleText = geometryContainer?.querySelector("style")?.textContent ?? "";
    const bodyZIndexFor = (childIndex: number) => {
      const rule = styleText
        .split("\n")
        .find((line) => line.includes(`td:nth-child(${childIndex}) {`));

      return rule?.match(/z-index:\s*(\d+)/)?.[1];
    };

    expect(wrapper.getByText("Role")).toHaveStyle({zIndex: "4"});
    expect(wrapper.getByText("Email")).toHaveStyle({zIndex: "3"});
    expect(Number(bodyZIndexFor(2))).toBeGreaterThan(Number(bodyZIndexFor(4)));

    clientWidth.mockRestore();
  });

  it("keeps a single scroll listener across column-resize-driven geometry updates", () => {
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(400);
    const addEventListenerSpy = jest.spyOn(HTMLElement.prototype, "addEventListener");
    const wrapper = render(
      <Table
        isResizable
        columns={[
          {id: "first", maxWidth: 200, minWidth: 60, pinned: "start", width: 100},
          {id: "second", width: 100},
        ]}
      >
        <Table.Content aria-label="Resizable pinned columns table">
          <Table.Header>
            <Table.Column id="first">First</Table.Column>
            <Table.Column id="second">Second</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>1</Table.Cell>
              <Table.Cell>2</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );
    const countScrollListeners = () =>
      addEventListenerSpy.mock.calls.filter(([type]) => type === "scroll").length;
    const scrollListenerCountBeforeResize = countScrollListeners();
    const resizer = wrapper
      .getByText("First")
      .querySelector<HTMLElement>('[data-slot="table-column-resizer"]')!;

    resizer.focus();
    // Each key press recalculates column geometry (new pinnedOffsets), the same churn a
    // pointer-drag resize produces every frame — the scroll listener must not be torn down
    // and re-attached for any of them.
    fireEvent.keyDown(resizer, {key: "ArrowRight"});
    fireEvent.keyDown(resizer, {key: "ArrowRight"});
    fireEvent.keyDown(resizer, {key: "ArrowRight"});

    expect(countScrollListeners()).toBe(scrollListenerCountBeforeResize);

    addEventListenerSpy.mockRestore();
    clientWidth.mockRestore();
  });

  it("preserves unmanaged isResizable behavior without column definitions", () => {
    const wrapper = render(
      <Table isResizable>
        <Table.Content aria-label="Unmanaged resizable table">
          <Table.Header>
            <Table.Column defaultWidth={160}>Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Ada</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    expect(wrapper.container.querySelector("[data-table-geometry]")).not.toBeInTheDocument();
  });
});
