import type {Meta, StoryObj} from "@storybook/react";
import type {ChipProps} from "@sytechui/chip";
import type {
  Selection,
  SelectionBehavior as SelectionBehaviorValue,
  SelectionMode,
  SortDescriptor,
  TableProps,
} from "../src";

import React, {useMemo, useState} from "react";
import {Button} from "@sytechui/button";
import {Chip} from "@sytechui/chip";
import {Pagination} from "@sytechui/pagination";
import {DeleteIcon, EditIcon, EyeIcon, SortIcon} from "@sytechui/shared-icons";
import {Spinner} from "@sytechui/spinner";
import {expect, fireEvent, waitFor, within} from "@storybook/test";
import {Tooltip} from "@sytechui/tooltip";
import {User} from "@sytechui/user";
import useSWR from "swr";

import {Table} from "../src";
import {Switch} from "../../switch/src";

const meta = {
  title: "Components/Table",
  component: Table,
  argTypes: {
    color: {
      control: "select",
      options: ["default", "primary", "secondary", "success", "warning", "danger"],
    },
    isBordered: {control: "boolean"},
    isCompact: {control: "boolean"},
    isGlass: {control: "boolean"},
    isSticky: {control: "boolean"},
    isStriped: {control: "boolean"},
    layout: {control: "select", options: ["auto", "fixed"]},
    overflowMode: {control: "select", options: ["wrap", "truncate"]},
    radius: {control: "select", options: ["none", "sm", "md", "lg"]},
    shadow: {control: "select", options: ["none", "sm", "md", "lg"]},
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultProps: TableProps = {
  className: "max-w-lg",
  color: "default",
  fullWidth: true,
  isGlass: true,
  layout: "auto",
  overflowMode: "wrap",
  radius: "lg",
  shadow: "sm",
};

const rows = [
  {id: "1", name: "Tony Reichert", role: "CEO", status: "Active"},
  {id: "2", name: "Zoey Lang", role: "Technical Lead", status: "Paused"},
  {id: "3", name: "Jane Fisher", role: "Senior Developer", status: "Active"},
  {id: "4", name: "William Howard", role: "Community Manager", status: "Vacation"},
];

const columns = [
  {id: "name", label: "NAME"},
  {id: "role", label: "ROLE"},
  {id: "status", label: "STATUS"},
];

const virtualizedColumns = [
  {id: "name", minWidth: 100},
  {id: "value", minWidth: 100},
  {id: "category", minWidth: 100},
  {id: "status", minWidth: 100},
];

const managedColumns = [
  {id: "name", width: 130},
  {id: "role", flex: 1, minWidth: 140},
  {id: "status", flex: 1, minWidth: 150},
  {id: "actions", width: 100},
];

const pinnedColumns = [
  {id: "name", pinned: "start" as const, width: 160},
  {id: "role", width: 260},
  {id: "status", pinned: "start" as const, width: 160},
  {id: "team", width: 220},
  {id: "email", pinned: "end" as const, width: 260},
  {id: "phone", width: 180},
  {id: "location", width: 180},
  {id: "department", width: 180},
  {id: "actions", width: 120},
];

const paginatedRows = Array.from({length: 25}, (_, index) => ({
  id: String(index + 1),
  name: `Member ${index + 1}`,
  role: ["Engineer", "Designer", "Product Manager"][index % 3],
  status: ["Active", "Paused", "Vacation"][index % 3],
}));

interface SWCharacter {
  id: string;
  name: string;
  height: string;
  mass: string;
  birth_year: string;
}

interface SWCharacterResponse {
  count: number;
  next: string | null;
  results: Array<Omit<SWCharacter, "id">>;
}

function TableShell({
  args,
  children,
  footer,
  removeWrapper = false,
  scrollClassName,
}: {
  args: TableProps;
  children: React.ReactNode;
  footer?: React.ReactNode;
  removeWrapper?: boolean;
  scrollClassName?: string;
}) {
  return (
    <Table
      {...args}
      classNames={
        scrollClassName ? {...args.classNames, scrollContainer: scrollClassName} : args.classNames
      }
      removeWrapper={removeWrapper}
    >
      {children}
      {footer ? <Table.Footer className="flex w-full justify-center">{footer}</Table.Footer> : null}
    </Table>
  );
}

function StaticTemplate({
  args,
  contentProps,
  headerClassName,
  removeWrapper = false,
  withSwitch = false,
}: {
  args: TableProps;
  contentProps?: React.ComponentProps<typeof Table.Content>;
  headerClassName?: string;
  removeWrapper?: boolean;
  withSwitch?: boolean;
}) {
  return (
    <TableShell args={args} removeWrapper={removeWrapper}>
      <Table.Content aria-label="Example static collection table" {...contentProps}>
        <Table.Header className={headerClassName}>
          <Table.Column isRowHeader>NAME</Table.Column>
          <Table.Column>ROLE</Table.Column>
          <Table.Column>{withSwitch ? "ACTIVE" : "STATUS"}</Table.Column>
        </Table.Header>
        <Table.Body>
          {rows.map((item) => (
            <Table.Row key={item.id} id={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.role}</Table.Cell>
              <Table.Cell>{withSwitch ? <Switch /> : item.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </TableShell>
  );
}

function DynamicTemplate(args: TableProps) {
  return (
    <TableShell args={args}>
      <Table.Content aria-label="Example table with dynamic content">
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column id={column.id} isRowHeader={column.id === "name"}>
              {column.label}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={rows}>
          {(item) => (
            <Table.Row columns={columns} id={item.id}>
              {(column) => <Table.Cell>{item[column.id as keyof typeof item]}</Table.Cell>}
            </Table.Row>
          )}
        </Table.Body>
      </Table.Content>
    </TableShell>
  );
}

const customUsers = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=tony",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    status: "paused",
    avatar: "https://i.pravatar.cc/150?u=zoey",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=jane",
    email: "jane.fisher@example.com",
  },
];

const customColumns = [
  {id: "name", label: "NAME"},
  {id: "role", label: "ROLE"},
  {id: "status", label: "STATUS"},
  {id: "actions", label: "ACTIONS"},
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

function CustomCellsTemplate({
  args,
  customClasses = false,
}: {
  args: TableProps;
  customClasses?: boolean;
}) {
  const renderCell = React.useCallback((item: (typeof customUsers)[number], columnId: string) => {
    switch (columnId) {
      case "name":
        return (
          <User
            avatarProps={{radius: "lg", src: item.avatar}}
            description={item.email}
            name={item.name}
          />
        );
      case "role":
        return (
          <div className="flex flex-col">
            <span>{item.role}</span>
            <span className="text-default-400">{item.team}</span>
          </div>
        );
      case "status":
        return (
          <Chip color={statusColorMap[item.status]} size="sm" variant="flat">
            {item.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip content="Details">
              <span className="cursor-pointer text-default-400">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="cursor-pointer text-default-400">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="cursor-pointer text-danger">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
    }
  }, []);

  const classNames = customClasses
    ? {
        base: "max-w-3xl",
        wrapper: "bg-gradient-to-br from-purple-500 to-indigo-900/90 shadow-xl",
        th: "border-b border-white/20 bg-white/10 text-white",
        td: "border-b border-white/10 py-4 text-sm text-white",
      }
    : undefined;

  return (
    <TableShell args={{...args, classNames}}>
      <Table.Content aria-label="Example table with custom cells">
        <Table.Header columns={customColumns}>
          {(column) => (
            <Table.Column
              align={column.id === "actions" ? "center" : "start"}
              id={column.id}
              isRowHeader={column.id === "name"}
            >
              {column.label}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={customUsers}>
          {(item) => (
            <Table.Row columns={customColumns} id={item.id}>
              {(column) => <Table.Cell>{renderCell(item, column.id)}</Table.Cell>}
            </Table.Row>
          )}
        </Table.Body>
      </Table.Content>
    </TableShell>
  );
}

function SelectionTemplate({
  args,
  disabledKeys,
  disallowEmptySelection,
  mode,
  onSelectionChange,
  selectedKeys,
  selectionBehavior,
}: {
  args: TableProps;
  disabledKeys?: Iterable<React.Key>;
  disallowEmptySelection?: boolean;
  mode: SelectionMode;
  onSelectionChange?: (selection: Selection) => void;
  selectedKeys?: Selection;
  selectionBehavior?: SelectionBehaviorValue;
}) {
  const showCheckboxes = mode === "multiple" && selectionBehavior !== "replace";

  return (
    <TableShell args={args}>
      <Table.Content
        aria-label="Selectable table"
        defaultSelectedKeys={disallowEmptySelection ? ["2"] : undefined}
        disabledKeys={disabledKeys}
        disallowEmptySelection={disallowEmptySelection}
        selectedKeys={selectedKeys}
        selectionBehavior={selectionBehavior}
        selectionMode={mode}
        onSelectionChange={onSelectionChange}
      >
        <Table.Header>
          {showCheckboxes ? (
            <Table.Column aria-label="Select rows">
              <Table.SelectionCheckbox aria-label="Select all rows" color="primary" />
            </Table.Column>
          ) : null}
          <Table.Column isRowHeader>NAME</Table.Column>
          <Table.Column>ROLE</Table.Column>
          <Table.Column>STATUS</Table.Column>
        </Table.Header>
        <Table.Body>
          {rows.map((item) => (
            <Table.Row key={item.id} id={item.id}>
              {showCheckboxes ? (
                <Table.Cell>
                  <Table.SelectionCheckbox aria-label={`Select ${item.name}`} color="primary" />
                </Table.Cell>
              ) : null}
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.role}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </TableShell>
  );
}

function SelectionBehaviorTemplate(args: TableProps) {
  const [behavior, setBehavior] = useState<SelectionBehaviorValue>("toggle");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          color="primary"
          variant={behavior === "toggle" ? "solid" : "flat"}
          onPress={() => setBehavior("toggle")}
        >
          Toggle
        </Button>
        <Button
          color="primary"
          variant={behavior === "replace" ? "solid" : "flat"}
          onPress={() => setBehavior("replace")}
        >
          Replace
        </Button>
        <span className="text-small text-foreground-500">
          Selected: {selectedKeys === "all" ? "all" : [...selectedKeys].join(", ") || "none"}
        </span>
      </div>
      <SelectionTemplate
        args={args}
        mode="multiple"
        selectedKeys={selectedKeys}
        selectionBehavior={behavior}
        onSelectionChange={setSelectedKeys}
      />
    </div>
  );
}

function SortableTemplate({args, customIcon = false}: {args: TableProps; customIcon?: boolean}) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const sortedRows = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const column = sortDescriptor.column as keyof (typeof rows)[number];
        const comparison = a[column].localeCompare(b[column]);

        return sortDescriptor.direction === "descending" ? -comparison : comparison;
      }),
    [sortDescriptor],
  );

  return (
    <TableShell args={args}>
      <Table.Content
        aria-label="Example table with client-side sorting"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <Table.Header>
          {columns.map((column) => (
            <Table.Column
              key={column.id}
              allowsSorting
              id={column.id}
              isRowHeader={column.id === "name"}
            >
              {({sortDirection}) => (
                <Table.SortableColumnHeader
                  indicator={customIcon ? <SortIcon /> : undefined}
                  sortDirection={sortDirection}
                >
                  {column.label}
                </Table.SortableColumnHeader>
              )}
            </Table.Column>
          ))}
        </Table.Header>
        <Table.Body>
          {sortedRows.map((item) => (
            <Table.Row key={item.id} id={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.role}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </TableShell>
  );
}

function LoadMoreTemplate(args: TableProps) {
  const [visibleRows, setVisibleRows] = useState(8);
  const items = paginatedRows.slice(0, visibleRows);
  const hasMore = visibleRows < paginatedRows.length;

  return (
    <TableShell
      args={args}
      footer={
        hasMore ? (
          <Button variant="flat" onPress={() => setVisibleRows((value) => value + 4)}>
            Load More
          </Button>
        ) : null
      }
    >
      <DataTable ariaLabel="Load more table" items={items} />
    </TableShell>
  );
}

function DataTable({
  ariaLabel,
  items,
}: {
  ariaLabel: string;
  items: Array<{id: string; name: string; role: string; status: string}>;
}) {
  return (
    <Table.Content aria-label={ariaLabel}>
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column id={column.id} isRowHeader={column.id === "name"}>
            {column.label}
          </Table.Column>
        )}
      </Table.Header>
      <Table.Body items={items}>
        {(item) => (
          <Table.Row id={item.id}>
            <Table.Cell>{item.name}</Table.Cell>
            <Table.Cell>{item.role}</Table.Cell>
            <Table.Cell>{item.status}</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Content>
  );
}

function PaginatedTemplate(args: TableProps) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;
  const pages = Math.ceil(paginatedRows.length / rowsPerPage);
  const items = paginatedRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <TableShell
      args={args}
      footer={
        <Pagination
          isCompact
          showControls
          color="secondary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      }
    >
      <DataTable ariaLabel="Paginated table" items={items} />
    </TableShell>
  );
}

const fetcher = (url: string) => fetch(url).then((response) => response.json());

function AsyncPaginatedTemplate(args: TableProps) {
  const [page, setPage] = useState(1);
  const {data, isValidating} = useSWR<SWCharacterResponse>(
    `https://swapi.py4e.com/api/people?page=${page}`,
    fetcher,
    {keepPreviousData: true},
  );
  const characters = useMemo(
    () => (data?.results ?? []).map((item) => ({...item, id: item.name})),
    [data?.results],
  );
  const pages = Math.ceil((data?.count ?? 0) / 10);

  return (
    <TableShell
      args={args}
      footer={
        pages ? (
          <Pagination
            isCompact
            showControls
            isDisabled={isValidating}
            page={page}
            total={pages}
            onChange={setPage}
          />
        ) : null
      }
    >
      <Table.Content
        aria-busy={isValidating}
        aria-label="Async paginated table"
        className={isValidating ? "pointer-events-none opacity-50 transition-opacity" : undefined}
      >
        <CharacterHeader />
        <Table.Body
          items={characters}
          renderEmptyState={() => (isValidating ? null : "No characters")}
        >
          {(item) => <CharacterRow item={item} />}
        </Table.Body>
      </Table.Content>
      {isValidating ? (
        <Table.LoadingOverlay>
          <Spinner />
        </Table.LoadingOverlay>
      ) : null}
    </TableShell>
  );
}

function CharacterHeader() {
  return (
    <Table.Header>
      <Table.Column isRowHeader>Name</Table.Column>
      <Table.Column>Height</Table.Column>
      <Table.Column>Mass</Table.Column>
      <Table.Column>Birth year</Table.Column>
    </Table.Header>
  );
}

function CharacterRow({item}: {item: SWCharacter}) {
  return (
    <Table.Row id={item.id}>
      <Table.Cell>{item.name}</Table.Cell>
      <Table.Cell>{item.height}</Table.Cell>
      <Table.Cell>{item.mass}</Table.Cell>
      <Table.Cell>{item.birth_year}</Table.Cell>
    </Table.Row>
  );
}

function InfinitePaginationTemplate(args: TableProps) {
  const [items, setItems] = useState<SWCharacter[]>([]);
  const [nextUrl, setNextUrl] = useState("https://swapi.py4e.com/api/people/?search=");
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = React.useCallback(async () => {
    if (!nextUrl || isLoading) return;
    setIsLoading(true);
    const response = await fetch(nextUrl);
    const data = (await response.json()) as SWCharacterResponse;

    setItems((current) => [...current, ...data.results.map((item) => ({...item, id: item.name}))]);
    setNextUrl(data.next ?? "");
    setIsLoading(false);
  }, [isLoading, nextUrl]);

  React.useEffect(() => {
    void loadMore();
  }, []);

  return (
    <TableShell args={args} scrollClassName="max-h-[440px]">
      <Table.Content aria-label="Infinite loading table">
        <CharacterHeader />
        <Table.Body>
          <Table.Collection items={items}>
            {(item) => <CharacterRow item={item} />}
          </Table.Collection>
          {nextUrl ? (
            <Table.LoadMore isLoading={isLoading} onLoadMore={loadMore}>
              <Table.LoadMoreContent>{isLoading ? <Spinner /> : null}</Table.LoadMoreContent>
            </Table.LoadMore>
          ) : null}
        </Table.Body>
      </Table.Content>
    </TableShell>
  );
}

function VirtualizedTemplate({args, rowCount}: {args: TableProps; rowCount: number}) {
  const items = useMemo(
    () =>
      Array.from({length: rowCount}, (_, index) => ({
        id: String(index),
        name: `Item ${index + 1}`,
        value: `Value ${index + 1}`,
        category: ["Product", "Engineering", "Design"][index % 3],
        status: index % 2 === 0 ? "Active" : "Paused",
      })),
    [rowCount],
  );

  return (
    <Table
      {...args}
      isVirtualized
      columns={virtualizedColumns}
      layoutOptions={{headingHeight: 40, rowHeight: 40}}
    >
      <Table.Content
        aria-label={`Virtualized table with ${rowCount} rows`}
        className="h-[300px] overflow-auto scrollbar"
      >
        <Table.Header>
          <Table.Column isRowHeader id="name">
            Name
          </Table.Column>
          <Table.Column id="value">Value</Table.Column>
          <Table.Column id="category">Category</Table.Column>
          <Table.Column id="status">Status</Table.Column>
        </Table.Header>
        <Table.Body items={items}>
          {(item) => (
            <Table.Row id={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.value}</Table.Cell>
              <Table.Cell>{item.category}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Content>
    </Table>
  );
}

function ColumnResizingTemplate({args}: {args: TableProps}) {
  return (
    <Table {...args} isResizable>
      <Table.Content aria-label="Table with resizable columns" className="min-w-[440px]">
        <Table.Header>
          <Table.Column isRowHeader defaultWidth="1fr" id="name" minWidth={140}>
            Name
          </Table.Column>
          <Table.Column defaultWidth="1fr" id="role" minWidth={180}>
            Role
          </Table.Column>
          <Table.Column defaultWidth="1fr" id="status" minWidth={180}>
            Status
          </Table.Column>
          <Table.Column defaultWidth="1fr" id="actions" minWidth={140}>
            Actions
          </Table.Column>
        </Table.Header>
        <Table.Body>
          {rows.map((item) => (
            <Table.Row key={item.id} id={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.role}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>Edit</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table>
  );
}

function FooterWithColumnResizingTemplate({args}: {args: TableProps}) {
  return (
    <Table
      {...args}
      isResizable
      isSticky
      classNames={{...args.classNames, resizableContainer: "max-h-[360px]"}}
      columns={managedColumns}
    >
      <Table.Content aria-label="Managed column geometry table">
        <Table.Header>
          <Table.Column isRowHeader id="name">
            Name
          </Table.Column>
          <Table.Column id="role">Role</Table.Column>
          <Table.Column id="status">Status</Table.Column>
          <Table.Column id="actions">Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {paginatedRows.map((item) => (
            <Table.Row key={item.id} id={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.role}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>Edit</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
      <Table.Footer alignColumns isSticky className="text-small">
        <span className="px-3 py-2">25 members</span>
        <span className="px-3 py-2">3 roles</span>
        <span className="px-3 py-2">Status summary</span>
        <span className="px-3 py-2">Actions</span>
      </Table.Footer>
    </Table>
  );
}

function PinnedColumnsTemplate({args}: {args: TableProps}) {
  return (
    <Table {...args} columns={pinnedColumns}>
      <Table.Content aria-label="Table with naturally positioned pinned columns">
        <Table.Header>
          {pinnedColumns.map((column) => (
            <Table.Column key={column.id} id={column.id}>
              {column.id.toUpperCase()}
            </Table.Column>
          ))}
        </Table.Header>
        <Table.Body>
          {rows.map((item) => (
            <Table.Row key={item.id} id={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.role}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>Platform</Table.Cell>
              <Table.Cell>{`${item.name.toLowerCase().replace(" ", ".")}@sytechui.com`}</Table.Cell>
              <Table.Cell>+1 (555) 010-0000</Table.Cell>
              <Table.Cell>Kuala Lumpur</Table.Cell>
              <Table.Cell>Engineering</Table.Cell>
              <Table.Cell>Edit</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table>
  );
}

function FixedColumnsTemplate() {
  const fixedColumns = [
    {id: "name", width: 100},
    {id: "role", width: 150},
  ];

  return (
    <Table fullWidth className="w-[500px]" columns={fixedColumns}>
      <Table.Content aria-label="Fixed columns table">
        <Table.Header>
          {fixedColumns.map((column) => (
            <Table.Column key={column.id} id={column.id}>
              {column.id.toUpperCase()}
            </Table.Column>
          ))}
        </Table.Header>
        <Table.Body>
          {rows.map((item) => (
            <Table.Row key={item.id} id={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.role}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Content>
    </Table>
  );
}

export const Default: Story = {
  render: (args) => <StaticTemplate args={args} />,
  args: defaultProps,
};

export const Dynamic: Story = {
  render: (args) => <DynamicTemplate {...args} />,
  args: defaultProps,
};

export const EmptyState: Story = {
  render: (args) => (
    <TableShell args={args}>
      <Table.Content aria-label="Empty table">
        <Table.Header>
          <Table.Column isRowHeader>NAME</Table.Column>
          <Table.Column>ROLE</Table.Column>
          <Table.Column>STATUS</Table.Column>
        </Table.Header>
        <Table.Body items={[]} renderEmptyState={() => "No rows to display."} />
      </Table.Content>
    </TableShell>
  ),
  args: defaultProps,
};

export const NoHeader: Story = {
  render: (args) => <StaticTemplate args={args} headerClassName="hidden" />,
  args: defaultProps,
};

export const CustomCells: Story = {
  render: (args) => <CustomCellsTemplate args={args} />,
  args: {...defaultProps, className: "max-w-3xl"},
};

export const Striped: Story = {
  render: (args) => <StaticTemplate args={args} />,
  args: {...defaultProps, isStriped: true},
};

export const Bordered: Story = {
  render: (args) => <StaticTemplate args={args} />,
  args: {...defaultProps, isBordered: true},
};

export const RemoveWrapper: Story = {
  render: (args) => <StaticTemplate removeWrapper args={args} />,
  args: {...defaultProps, shadow: "none"},
};

export const SingleSelection: Story = {
  render: (args) => <SelectionTemplate args={args} mode="single" />,
  args: defaultProps,
};

export const MultipleSelection: Story = {
  render: (args) => <SelectionTemplate args={args} mode="multiple" />,
  args: {...defaultProps, color: "secondary"},
};

export const DisabledKeys: Story = {
  render: (args) => <SelectionTemplate args={args} disabledKeys={["2"]} mode="multiple" />,
  args: {...defaultProps, color: "warning"},
};

export const DisallowEmptySelection: Story = {
  render: (args) => <SelectionTemplate disallowEmptySelection args={args} mode="multiple" />,
  args: {...defaultProps, color: "primary"},
};

export const SelectionBehavior: Story = {
  render: (args) => <SelectionBehaviorTemplate {...args} />,
  args: defaultProps,
};

export const Sortable: Story = {
  render: (args) => <SortableTemplate args={args} />,
  args: defaultProps,
};

export const CustomSortIcon: Story = {
  render: (args) => <SortableTemplate customIcon args={args} />,
  args: defaultProps,
};

export const LoadMore: Story = {
  render: (args) => <LoadMoreTemplate {...args} />,
  args: {...defaultProps, className: "max-w-3xl"},
};

export const Paginated: Story = {
  render: (args) => <PaginatedTemplate {...args} />,
  args: defaultProps,
};

export const AsyncPaginated: Story = {
  render: (args) => <AsyncPaginatedTemplate {...args} />,
  args: {...defaultProps, className: "max-w-3xl min-h-[400px]"},
};

export const InfinityPagination: Story = {
  render: (args) => <InfinitePaginationTemplate {...args} />,
  args: {...defaultProps, className: "max-w-3xl min-h-[400px]"},
};

export const HeaderSticky: Story = {
  render: (args) => <InfinitePaginationTemplate {...args} />,
  args: {...defaultProps, className: "max-w-3xl min-h-[400px]", isSticky: true},
};

export const CustomWithClassNames: Story = {
  render: (args) => <CustomCellsTemplate customClasses args={args} />,
  args: defaultProps,
};

export const DisableAnimation: Story = {
  render: (args) => <StaticTemplate args={args} />,
  args: {
    ...defaultProps,
    className: "max-w-lg [&_*]:!transition-none [&_*]:!animate-none",
    color: "secondary",
  },
};

export const TableWithSwitch: Story = {
  render: (args) => <StaticTemplate withSwitch args={args} />,
  args: defaultProps,
};

export const Virtualized: Story = {
  render: (args) => <VirtualizedTemplate args={args} rowCount={500} />,
  args: {...defaultProps, className: "max-w-3xl"},
  tags: ["table-browser"],
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getAllByRole("row").length).toBeLessThan(500);
    });
  },
};

export const VirtualizedWithHeaderSticky: Story = {
  render: (args) => <VirtualizedTemplate args={args} rowCount={500} />,
  args: {...defaultProps, className: "max-w-3xl", isSticky: true},
};

export const ColumnResizing: Story = {
  render: (args) => <ColumnResizingTemplate args={args} />,
  args: {...defaultProps, className: "max-w-3xl"},
  tags: ["table-browser"],
  play: async ({canvasElement}) => {
    await waitFor(() => {
      const resizers = [
        ...canvasElement.querySelectorAll<HTMLElement>('[data-slot="table-column-resizer"]'),
      ];

      expect(resizers).toHaveLength(4);
      expect(
        resizers.filter((resizer) => getComputedStyle(resizer).display !== "none"),
      ).toHaveLength(3);
    });
  },
};

export const FooterWithColumnResizing: Story = {
  render: (args) => <FooterWithColumnResizingTemplate args={args} />,
  args: {...defaultProps, className: "max-w-xl"},
};

export const PinnedColumns: Story = {
  render: (args) => <PinnedColumnsTemplate args={args} />,
  args: {...defaultProps, className: "max-w-4xl"},
  tags: ["table-browser"],
  play: async ({canvasElement}) => {
    const geometry = canvasElement.querySelector<HTMLElement>("[data-table-geometry]")!;
    const viewport = canvasElement.querySelector<HTMLElement>("[data-table-scroll-container]")!;

    await waitFor(() => expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth));

    viewport.scrollLeft = 300;
    fireEvent.scroll(viewport);
    await waitFor(() => expect(geometry).toHaveAttribute("data-table-start-shadow", "3"));
  },
};

export const PinnedColumnsRtlBrowser: Story = {
  render: (args) => (
    <div dir="rtl">
      <PinnedColumnsTemplate args={args} />
    </div>
  ),
  args: {...defaultProps, className: "max-w-4xl"},
  tags: ["table-browser"],
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const geometry = canvasElement.querySelector<HTMLElement>("[data-table-geometry]")!;
    const viewport = canvasElement.querySelector<HTMLElement>("[data-table-scroll-container]")!;

    await waitFor(() => {
      expect(getComputedStyle(viewport).direction).toBe("rtl");
      expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
    });

    viewport.scrollLeft = -300;
    fireEvent.scroll(viewport);

    await waitFor(() => {
      expect(geometry).toHaveAttribute("data-table-start-shadow", "3");
      expect(getComputedStyle(canvas.getByText("STATUS"), "::after").boxShadow).toContain("-10px");
    });
  },
};

export const TenThousandRows: Story = {
  render: (args) => <VirtualizedTemplate args={args} rowCount={10000} />,
  args: {...defaultProps, className: "max-w-3xl"},
  tags: ["table-browser"],
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getAllByRole("row").length).toBeLessThan(10000);
    });
  },
};

export const FixedColumns: Story = {
  render: () => <FixedColumnsTemplate />,
  tags: ["table-browser"],
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole("grid");
    const columns = canvas.getAllByRole("columnheader");
    const viewport = canvasElement.querySelector<HTMLElement>("[data-table-scroll-container]")!;

    await waitFor(() => {
      const tableWidth = table.getBoundingClientRect().width;

      expect(tableWidth).toBe(viewport.getBoundingClientRect().width);
      expect(
        columns.reduce((width, column) => width + column.getBoundingClientRect().width, 0),
      ).toBe(tableWidth);
      expect(columns[0].getBoundingClientRect().width).toBeGreaterThan(100);
      expect(columns[1].getBoundingClientRect().width).toBeGreaterThan(150);
    });
  },
};
