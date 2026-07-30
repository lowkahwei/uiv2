import type {UserEvent} from "@testing-library/user-event";

import * as React from "react";
import {render, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {Table} from "../src";

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

const columns = [
  {id: "name", name: "Name"},
  {id: "role", name: "Role"},
];

const rows = [
  {id: "1", name: "Kate", role: "CEO"},
  {id: "2", name: "John", role: "CTO"},
];

function StaticTable(props: React.ComponentProps<typeof Table.Content> = {}) {
  return (
    <Table>
      <Table.Content aria-label="Users" {...props}>
        <Table.Header>
          <Table.Column isRowHeader>Name</Table.Column>
          <Table.Column>Role</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row id="1">
            <Table.Cell>Kate</Table.Cell>
            <Table.Cell>CEO</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table>
  );
}

describe("Table", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders the v3 compound structure with the v2 theme slots", () => {
    const wrapper = render(
      <Table
        classNames={{
          base: "custom-base",
          wrapper: "custom-wrapper",
          scrollContainer: "custom-scroll-container",
          table: "custom-table",
          thead: "custom-header",
          tbody: "custom-body",
          tr: "custom-row",
          th: "custom-column",
          td: "custom-cell",
          tfoot: "custom-footer",
          loadingWrapper: "custom-loading",
        }}
      >
        <Table.Content aria-label="Users">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Kate</Table.Cell>
              <Table.Cell>CEO</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
        <Table.Footer data-testid="footer">Footer</Table.Footer>
        <Table.LoadingOverlay data-testid="loading-overlay">Loading</Table.LoadingOverlay>
      </Table>,
    );

    const scrollContainer = wrapper.container.querySelector("[data-table-scroll-container]");

    expect(wrapper.container.firstChild).toHaveClass("custom-base");
    expect(scrollContainer).toHaveClass("custom-scroll-container", "scrollbar", "overflow-x-auto");
    expect(scrollContainer?.parentElement).toHaveClass("custom-wrapper");
    expect(wrapper.getByRole("grid")).toHaveClass("custom-table");
    expect(wrapper.getAllByRole("rowgroup")[0]).toHaveClass("custom-header");
    expect(wrapper.getAllByRole("rowgroup")[1]).toHaveClass("custom-body");
    expect(wrapper.getAllByRole("columnheader")[0]).toHaveClass("custom-column");
    expect(wrapper.getByRole("rowheader")).toHaveClass("custom-cell");
    expect(wrapper.getByTestId("footer")).toHaveClass("custom-footer");
    expect(wrapper.getByTestId("loading-overlay")).toHaveClass("custom-loading");
  });

  it("controls long-content wrapping from the root with per-cell overrides", () => {
    const wrapper = render(
      <Table overflowMode="truncate">
        <Table.Content aria-label="Users">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Kate</Table.Cell>
              <Table.Cell overflowMode="wrap">Chief executive officer</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    expect(wrapper.getByRole("rowheader")).toHaveClass("whitespace-normal", "break-words");
    expect(wrapper.getByRole("rowheader")).not.toHaveClass("truncate");
    expect(wrapper.getByText("Kate")).toHaveClass("truncate");
    expect(wrapper.getByRole("gridcell")).toHaveClass("whitespace-normal", "break-words");
    expect(wrapper.getByText("Chief executive officer")).not.toHaveClass("truncate");
  });

  it("isBordered draws horizontal inner row lines on cells only", () => {
    const wrapper = render(
      <Table isBordered>
        <Table.Content aria-label="Users">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Kate</Table.Cell>
              <Table.Cell>CEO</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    expect(wrapper.getByRole("grid")).not.toHaveClass("border-s", "border-t");
    expect(wrapper.getAllByRole("columnheader")[0]).toHaveClass(
      "before:content-['']",
      "before:bg-default-300",
      "[&:is(th):last-child]:before:hidden",
    );
    expect(wrapper.getAllByRole("columnheader")[0]).not.toHaveClass("border-e", "border-b");
    expect(wrapper.getByRole("rowheader")).toHaveClass("border-b", "border-divider");
    expect(wrapper.getByRole("rowheader")).not.toHaveClass("border-e");
    expect(
      wrapper.container.querySelector('[data-slot="table-column-resizer"]'),
    ).not.toBeInTheDocument();
    // The last row drops its bottom border through the row.
    expect(wrapper.getByRole("rowheader")).toHaveClass("group-last/tr:border-b-0");
  });

  it("positions column resizers at the column edge with an accessible hit area", () => {
    const wrapper = render(
      <Table isResizable classNames={{columnResizer: "custom-resizer"}}>
        <Table.Content aria-label="Resizable users">
          <Table.Header>
            <Table.Column isRowHeader defaultWidth="1fr" minWidth={120}>
              Name
            </Table.Column>
            <Table.Column defaultWidth="1fr" minWidth={120}>
              Role
            </Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Kate</Table.Cell>
              <Table.Cell>CEO</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    const resizableContainer = wrapper.getByRole("grid").parentElement as HTMLElement;

    expect(resizableContainer).toHaveClass("overflow-auto");
    expect(resizableContainer).not.toHaveClass("p-4", "gap-4");
    expect(resizableContainer.parentElement).toHaveClass("p-4", "gap-4");
    expect(wrapper.getAllByRole("columnheader")[0]).toHaveClass("relative");
    const columnResizers = wrapper.container.querySelectorAll('[data-slot="table-column-resizer"]');

    expect(columnResizers).toHaveLength(2);
    expect(wrapper.getAllByRole("rowgroup")[0]).toHaveClass(
      "[&>tr>th:last-child>[data-slot=table-column-resizer]]:hidden",
    );
    expect(columnResizers[0]).toHaveClass(
      "custom-resizer",
      "absolute",
      "end-0",
      "box-content",
      "px-2",
    );
  });

  it("drives sticky header and footer styles through their slots", () => {
    const wrapper = render(
      <Table isSticky>
        <Table.Content aria-label="Sticky users">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Kate</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
        <Table.Footer isSticky data-testid="footer">
          Footer
        </Table.Footer>
      </Table>,
    );

    expect(wrapper.getAllByRole("rowgroup")[0]).toHaveClass(
      "sticky",
      "top-0",
      "z-20",
      "bg-default-100/80",
      "backdrop-blur-sm",
    );
    expect(wrapper.getAllByRole("columnheader")[0]).toHaveClass("bg-transparent");
    expect(wrapper.getByTestId("footer")).toHaveClass(
      "sticky",
      "bottom-0",
      "z-20",
      "bg-default-100/80",
      "backdrop-blur-sm",
    );
  });

  it("keeps a non-sticky footer visually neutral", () => {
    const wrapper = render(
      <Table>
        <Table.Footer data-testid="footer">Footer</Table.Footer>
      </Table>,
    );

    expect(wrapper.getByTestId("footer")).not.toHaveClass("sticky", "rounded-lg", "bg-default-100");
  });

  it("uses opaque native sticky surfaces when glass is disabled", () => {
    const wrapper = render(
      <Table isSticky isGlass={false}>
        <Table.Content aria-label="Opaque sticky users">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Kate</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
        <Table.Footer isSticky data-testid="opaque-footer">
          Footer
        </Table.Footer>
      </Table>,
    );

    expect(wrapper.getAllByRole("rowgroup")[0]).toHaveClass("sticky");
    expect(wrapper.getAllByRole("rowgroup")[0]).not.toHaveClass(
      "bg-default-100/80",
      "backdrop-blur-sm",
    );
    expect(wrapper.getAllByRole("columnheader")[0]).toHaveClass("bg-default-100");
    expect(wrapper.getAllByRole("columnheader")[0]).not.toHaveClass("bg-transparent");
    expect(wrapper.getByTestId("opaque-footer")).toHaveClass("sticky", "bg-default-100");
    expect(wrapper.getByTestId("opaque-footer")).not.toHaveClass(
      "bg-default-100/80",
      "backdrop-blur-sm",
    );
  });

  it("gives pinned column headers an opaque background under a sticky header", () => {
    const clientWidth = jest
      .spyOn(HTMLElement.prototype, "clientWidth", "get")
      .mockReturnValue(200);
    const wrapper = render(
      <Table
        isSticky
        columns={[
          {id: "name", pinned: "start", width: 100},
          {id: "role", width: 100},
        ]}
      >
        <Table.Content aria-label="Sticky pinned users">
          <Table.Header>
            <Table.Column id="name">Name</Table.Column>
            <Table.Column id="role">Role</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Kate</Table.Cell>
              <Table.Cell>CEO</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );
    const [nameHeader, roleHeader] = wrapper.getAllByRole("columnheader");

    expect(nameHeader).toHaveAttribute("data-pinned", "start");
    expect(nameHeader).toHaveClass("data-[pinned]:bg-default-100/80");
    expect(roleHeader).not.toHaveAttribute("data-pinned");

    clientWidth.mockRestore();
  });

  it("forwards the content ref to the table element", () => {
    const ref = React.createRef<HTMLTableElement>();

    render(
      <Table>
        <Table.Content ref={ref} aria-label="Users">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Kate</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it("forwards header, body, and row refs in React 18", () => {
    const headerRef = React.createRef<HTMLDivElement | HTMLTableSectionElement>();
    const bodyRef = React.createRef<HTMLDivElement | HTMLTableSectionElement>();
    const rowRef = React.createRef<HTMLDivElement | HTMLTableRowElement>();

    render(
      <Table>
        <Table.Content aria-label="Users">
          <Table.Header ref={headerRef}>
            <Table.Column isRowHeader>Name</Table.Column>
          </Table.Header>
          <Table.Body ref={bodyRef}>
            <Table.Row ref={rowRef} id="1">
              <Table.Cell>Kate</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    expect(headerRef.current).toBeInstanceOf(HTMLTableSectionElement);
    expect(bodyRef.current).toBeInstanceOf(HTMLTableSectionElement);
    expect(rowRef.current).toBeInstanceOf(HTMLTableRowElement);
  });

  it("keeps table context stable for equivalent inline classNames", () => {
    const renderContent = jest.fn();
    const MemoizedContent = React.memo(function MemoizedContent() {
      renderContent();

      return (
        <Table.Content aria-label="Users">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Kate</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      );
    });

    function Harness({version}: {version: number}) {
      return (
        <Table classNames={{td: "custom-cell"}} data-version={version}>
          <MemoizedContent />
        </Table>
      );
    }

    const wrapper = render(<Harness version={1} />);

    wrapper.rerender(<Harness version={2} />);

    expect(renderContent).toHaveBeenCalledTimes(1);
  });

  it("renders dynamic columns and rows", () => {
    const wrapper = render(
      <Table>
        <Table.Content aria-label="Users">
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column id={column.id} isRowHeader={column.id === "name"}>
                {column.name}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={rows}>
            {(item) => (
              <Table.Row id={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.role}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    expect(wrapper.getAllByRole("columnheader")).toHaveLength(2);
    expect(wrapper.getAllByRole("row")).toHaveLength(3);
    expect(wrapper.getAllByRole("rowheader")).toHaveLength(2);
    expect(wrapper.getAllByRole("gridcell")).toHaveLength(2);
  });

  it("renders the v3 empty state with the v2 empty wrapper slot", () => {
    const wrapper = render(
      <Table classNames={{emptyWrapper: "custom-empty"}}>
        <Table.Content aria-label="Empty users">
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
          </Table.Header>
          <Table.Body items={[]} renderEmptyState={() => "No users"} />
        </Table.Content>
      </Table>,
    );

    expect(wrapper.getByText("No users")).toHaveClass(
      "custom-empty",
      "flex",
      "items-center",
      "justify-center",
    );
  });

  it("renders functional selection checkboxes for multiple selection", async () => {
    const onSelectionChange = jest.fn();
    const wrapper = render(
      <Table color="secondary">
        <Table.Content
          aria-label="Users"
          selectionMode="multiple"
          onSelectionChange={onSelectionChange}
        >
          <Table.Header>
            <Table.Column aria-label="Select rows">
              <Table.SelectionCheckbox aria-label="Select all rows" />
            </Table.Column>
            <Table.Column isRowHeader>Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>
                <Table.SelectionCheckbox aria-label="Select Kate" />
              </Table.Cell>
              <Table.Cell>Kate</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    const rowCheckbox = wrapper.getByRole("checkbox", {name: /^Select Kate/});

    await user.click(rowCheckbox);

    expect([...onSelectionChange.mock.calls[0][0]]).toEqual(["1"]);
    expect(wrapper.getAllByRole("row")[1]).toHaveAttribute("aria-selected", "true");
    expect(rowCheckbox).toBeChecked();
  });

  it("delegates selection to React Aria Components", async () => {
    const onSelectionChange = jest.fn();
    const wrapper = render(
      <StaticTable selectionMode="single" onSelectionChange={onSelectionChange} />,
    );

    await user.click(wrapper.getAllByRole("row")[1]);

    expect([...onSelectionChange.mock.calls[0][0]]).toEqual(["1"]);
    expect(wrapper.getAllByRole("row")[1]).toHaveAttribute("aria-selected", "true");
  });

  it("keeps text color stable and separates hover from selected backgrounds", () => {
    const wrapper = render(
      <Table color="primary">
        <Table.Content
          aria-label="Selected users"
          defaultSelectedKeys={["1"]}
          selectionMode="single"
        >
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Kate</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );
    const cell = wrapper.getByRole("rowheader");

    expect(cell).toHaveClass(
      "before:bg-primary/20",
      "group-aria-[selected=true]/tr:before:!bg-primary/20",
      "group-aria-[selected=false]/tr:group-data-[hovered]/tr:before:!bg-default-100",
      "group-aria-[selected=false]/tr:group-data-[hovered]/tr:before:!opacity-70",
    );
    expect(
      cell.className
        .split(" ")
        .filter((className) => /hovered|selected/.test(className))
        .every((className) => !className.includes("text-")),
    ).toBe(true);
  });

  it("lets selected row backgrounds override stripes", () => {
    const wrapper = render(
      <Table isStriped color="primary">
        <Table.Content
          aria-label="Selected striped users"
          defaultSelectedKeys={["2"]}
          selectionMode="single"
        >
          <Table.Header>
            <Table.Column isRowHeader>Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row id="1">
              <Table.Cell>Kate</Table.Cell>
            </Table.Row>
            <Table.Row id="2">
              <Table.Cell>John</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>,
    );

    expect(wrapper.getByRole("rowheader", {name: "John"})).toHaveClass(
      "group-aria-[selected=true]/tr:before:!bg-primary/20",
      "group-aria-[selected=false]/tr:group-data-[hovered]/tr:before:!bg-default-100",
    );
  });

  it("delegates sorting to React Aria Components", async () => {
    function SortableTable() {
      const [sortDescriptor, setSortDescriptor] =
        React.useState<React.ComponentProps<typeof Table.Content>["sortDescriptor"]>();

      return (
        <Table>
          <Table.Content
            aria-label="Users"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
          >
            <Table.Header>
              <Table.Column allowsSorting isRowHeader id="name">
                {({sortDirection}) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    Name
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="1">
                <Table.Cell>Kate</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table>
      );
    }

    const wrapper = render(<SortableTable />);
    const column = wrapper.getByRole("columnheader");

    expect(column).toHaveAttribute("aria-sort", "none");
    await user.click(column);
    expect(column).toHaveAttribute("aria-sort", "ascending");
  });

  describe("Root shape props", () => {
    it("auto-wraps children in a scroll container by default", () => {
      const wrapper = render(
        <Table>
          <Table.Content aria-label="Users">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="1">
                <Table.Cell>Kate</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table>,
      );
      const scrollContainer = wrapper.container.querySelector("[data-table-scroll-container]");

      expect(scrollContainer).toHaveClass("scrollbar", "overflow-x-auto");
      expect(scrollContainer).not.toHaveClass("p-4", "gap-4");
      expect(scrollContainer?.parentElement).toHaveClass("p-4", "gap-4");
      expect(scrollContainer).toContainElement(wrapper.getByRole("grid"));
    });

    it("removeWrapper keeps the functional scroll container without decoration", () => {
      const wrapper = render(
        <Table
          removeWrapper
          classNames={{
            scrollContainer: "custom-scroll-container",
            wrapper: "custom-wrapper",
          }}
        >
          <Table.Content aria-label="Users">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="1">
                <Table.Cell>Kate</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table>,
      );

      const scrollContainer = wrapper.container.querySelector("[data-table-scroll-container]");

      expect(scrollContainer).toHaveClass(
        "custom-scroll-container",
        "scrollbar",
        "overflow-x-auto",
      );
      expect(scrollContainer).not.toHaveClass(
        "custom-wrapper",
        "p-4",
        "bg-content1",
        "shadow-small",
      );
      expect(wrapper.container.firstChild).toHaveClass("flex", "flex-col");
      expect(wrapper.getByRole("grid").parentElement).toBe(scrollContainer);
      expect(wrapper.container.querySelectorAll("[data-table-scroll-container]")).toHaveLength(1);
    });

    it("isResizable auto-wraps in a split wrapper/resizable-container structure", () => {
      const onResize = jest.fn();
      const wrapper = render(
        <Table isResizable onResize={onResize}>
          <Table.Content aria-label="Resizable users">
            <Table.Header>
              <Table.Column isRowHeader defaultWidth="1fr" minWidth={120}>
                Name
              </Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="1">
                <Table.Cell>Kate</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table>,
      );
      const resizableContainer = wrapper.getByRole("grid").parentElement;

      expect(resizableContainer).toHaveClass("overflow-auto");
      expect(resizableContainer).not.toHaveClass("p-4", "gap-4");
      expect(resizableContainer?.parentElement).toHaveClass("p-4", "gap-4");
      expect(
        wrapper.container.querySelector('[data-slot="table-column-resizer"]'),
      ).toBeInTheDocument();
    });

    it("isResizable measures the scroll container, not the padded wrapper", () => {
      const clientWidth = jest
        .spyOn(HTMLElement.prototype, "clientWidth", "get")
        .mockImplementation(function (this: HTMLElement) {
          return this.hasAttribute("data-table-scroll-container") ? 300 : 500;
        });

      const wrapper = render(
        <Table isResizable columns={[{id: "name", flex: 1}]}>
          <Table.Content aria-label="Resizable geometry viewport table">
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

      expect(wrapper.getByRole("columnheader")).toHaveStyle({width: "300px"});

      clientWidth.mockRestore();
    });

    it("isVirtualized with columns feeds resolved column widths to the layout", async () => {
      const geometryColumns = [
        {id: "name", flex: 2, minWidth: 100},
        {id: "role", flex: 1, minWidth: 100},
      ];

      mockVirtualizer.mockClear();

      render(
        <Table isVirtualized columns={geometryColumns} layoutOptions={{rowHeight: 40}}>
          <Table.Content aria-label="Virtualized users">
            <Table.Header>
              <Table.Column isRowHeader id="name">
                Name
              </Table.Column>
              <Table.Column id="role">Role</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="1">
                <Table.Cell>Kate</Table.Cell>
                <Table.Cell>CEO</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Content>
        </Table>,
      );

      await waitFor(() => {
        const calls = mockVirtualizer.mock.calls;
        const layoutOptions = calls[calls.length - 1]?.[0].layoutOptions;

        expect(layoutOptions.rowHeight).toBe(40);
        expect([...layoutOptions.columnWidths]).toEqual([
          ["name", 100],
          ["role", 100],
        ]);
      });
    });

    it("aligns the footer through the native geometry mode", () => {
      const clientWidth = jest
        .spyOn(HTMLElement.prototype, "clientWidth", "get")
        .mockReturnValue(300);

      const wrapper = render(
        <Table
          columns={[
            {id: "name", width: 100},
            {id: "role", width: 200},
          ]}
        >
          <Table.Content aria-label="Footer-aligned columns table">
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
          <Table.Footer alignColumns>
            <span>Name total</span>
            <span>Role total</span>
          </Table.Footer>
        </Table>,
      );
      const columnHeaders = wrapper.getAllByRole("columnheader");
      const footer = wrapper.getByText("Name total").parentElement;

      expect(columnHeaders[0]).toHaveStyle({width: "100px"});
      expect(columnHeaders[1]).toHaveStyle({width: "200px"});
      expect(footer).toHaveStyle({display: "grid", gridTemplateColumns: "100px 200px"});

      clientWidth.mockRestore();
    });
  });
});
