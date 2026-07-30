import * as React from "react";
import {render} from "@testing-library/react";

import {Table} from "../src";

// Deliberately does NOT mock react-aria-components/Virtualizer (unlike table.test.tsx and
// column-geometry.test.tsx) — the real Virtualizer is what produces the div/role=presentation
// DOM shape these tests inspect.
describe("Root isVirtualized ignores pinned columns", () => {
  function mockGridDimensions() {
    // Narrower than the 300px of fixed-width columns below, so there'd be horizontal overflow
    // to pin against if pinning were supported here.
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(200);
    const clientHeight = jest
      .spyOn(HTMLElement.prototype, "clientHeight", "get")
      .mockReturnValue(400);

    return () => {
      clientWidth.mockRestore();
      clientHeight.mockRestore();
    };
  }

  function renderPinnedTable({
    isGlass,
    isSticky = false,
  }: {
    isGlass?: boolean;
    isSticky?: boolean;
  } = {}) {
    return render(
      <Table
        isGlass={isGlass}
        isSticky={isSticky}
        isVirtualized
        columns={[
          {id: "name", pinned: "start", width: 100},
          {id: "role", width: 100},
          {id: "email", pinned: "end", width: 100},
        ]}
      >
        <Table.Content aria-label="Virtualized table with pinned column definitions">
          <Table.Header>
            <Table.Column id="name">Name</Table.Column>
            <Table.Column id="role">Role</Table.Column>
            <Table.Column id="email">Email</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Ada</Table.Cell>
              <Table.Cell>Engineer</Table.Cell>
              <Table.Cell>ada@x.com</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );
  }

  it("does not mark pinned column headers with data-pinned", () => {
    const restore = mockGridDimensions();
    const wrapper = renderPinnedTable();

    expect(wrapper.getByText("Name")).not.toHaveAttribute("data-pinned");
    expect(wrapper.getByText("Email")).not.toHaveAttribute("data-pinned");
    restore();
  });

  it("puts the glass surface on the row group (not per-cell) for sticky virtualized headers", () => {
    // A virtualized column header is a VirtualizerItem-wrapped div with zero flow height, so
    // per-cell backdrop-filter would clamp its own sampling to that cell's box (a visible seam
    // at every column boundary). The row group is stretched to fill the sticky wrapper instead,
    // so it alone carries the glass and cells stay fully transparent.
    const restore = mockGridDimensions();
    const wrapper = renderPinnedTable({isSticky: true});
    const header = wrapper.getByText("Name");
    const rowgroup = wrapper.getAllByRole("rowgroup")[0];

    expect(rowgroup).toHaveClass(
      "bg-default-100/80",
      "backdrop-blur-sm",
      "[&:not(thead)]:absolute",
      "[&:not(thead)]:inset-0",
    );
    expect(header).toHaveClass("bg-transparent");
    expect(header).not.toHaveClass("bg-default-100/80", "backdrop-blur-sm");
    restore();
  });

  it("stretches the row group to fill its sticky wrapper even when glass is disabled", () => {
    const restore = mockGridDimensions();
    const wrapper = renderPinnedTable({isGlass: false, isSticky: true});
    const header = wrapper.getByText("Name");
    const rowgroup = wrapper.getAllByRole("rowgroup")[0];

    // The stretch is a structural fix (col/row VirtualizerItems need a real-area positioned
    // ancestor), independent of whether the row group ends up painting anything on top of it.
    expect(rowgroup).toHaveClass("[&:not(thead)]:absolute", "[&:not(thead)]:inset-0");
    expect(rowgroup).not.toHaveClass("bg-default-100/80", "backdrop-blur-sm");
    expect(header).toHaveClass("bg-default-100");
    expect(header).not.toHaveClass("bg-transparent");
    restore();
  });

  it("leaves pinned columns in React Aria's own natural (non-sticky) position, on header and body", () => {
    const restore = mockGridDimensions();
    const wrapper = renderPinnedTable();
    const wrapperOf = (element: HTMLElement) => element.parentElement as HTMLElement;

    // Virtualized geometry consumes widths only, so pinned definitions render exactly like the
    // unpinned "role" column: absolute, at their natural flow position, with no edge override.
    expect(wrapperOf(wrapper.getByText("Name")).style.position).toBe("absolute");
    expect(wrapperOf(wrapper.getByText("Email")).style.position).toBe("absolute");
    expect(wrapperOf(wrapper.getByText("Ada")).style.position).toBe("absolute");
    expect(wrapperOf(wrapper.getByText("ada@x.com")).style.position).toBe("absolute");
    restore();
  });

  it("generates no pinned-column stylesheet at all", () => {
    const restore = mockGridDimensions();
    const wrapper = renderPinnedTable();

    // Unlike native mode, the virtualized container never carries a [data-table-geometry]
    // scoping attribute or a generated <style> tag — there's no pinned CSS to scope.
    expect(wrapper.container.querySelector("[data-table-geometry]")).toBeNull();
    expect(wrapper.container.querySelector("style")).toBeNull();
    restore();
  });

  it("still resolves column widths correctly regardless of the pinned prop", () => {
    const restore = mockGridDimensions();
    const wrapper = renderPinnedTable();

    expect(wrapper.getByText("Name").parentElement).toHaveStyle({width: "100px"});
    expect(wrapper.getByText("Email").parentElement).toHaveStyle({width: "100px"});
    restore();
  });
});
