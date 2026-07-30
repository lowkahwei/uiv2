import type {ComponentProps} from "react";

import {
  TableBody,
  TableCell,
  TableCollection,
  TableColumn,
  TableContent,
  TableFooter,
  TableHeader,
  TableLoadMoreContent,
  TableLoadMoreItem,
  TableLoadingOverlay,
  TableRoot,
  TableRow,
  TableSelectionCheckbox,
  TableSortableColumnHeader,
} from "./table";

export const Table = Object.assign(TableRoot, {
  Body: TableBody,
  Cell: TableCell,
  Collection: TableCollection,
  Column: TableColumn,
  Content: TableContent,
  Footer: TableFooter,
  Header: TableHeader,
  LoadMore: TableLoadMoreItem,
  LoadMoreContent: TableLoadMoreContent,
  LoadingOverlay: TableLoadingOverlay,
  Root: TableRoot,
  Row: TableRow,
  SelectionCheckbox: TableSelectionCheckbox,
  SortableColumnHeader: TableSortableColumnHeader,
});

export type Table = {
  Props: ComponentProps<typeof TableRoot>;
  RootProps: ComponentProps<typeof TableRoot>;
  ContentProps: ComponentProps<typeof TableContent>;
  HeaderProps: ComponentProps<typeof TableHeader>;
  ColumnProps: ComponentProps<typeof TableColumn>;
  BodyProps: ComponentProps<typeof TableBody>;
  RowProps: ComponentProps<typeof TableRow>;
  CellProps: ComponentProps<typeof TableCell>;
  FooterProps: ComponentProps<typeof TableFooter>;
  LoadMoreProps: ComponentProps<typeof TableLoadMoreItem>;
  LoadMoreContentProps: ComponentProps<typeof TableLoadMoreContent>;
  LoadingOverlayProps: ComponentProps<typeof TableLoadingOverlay>;
  SelectionCheckboxProps: ComponentProps<typeof TableSelectionCheckbox>;
  SortableColumnHeaderProps: ComponentProps<typeof TableSortableColumnHeader>;
};

export {
  TableBody,
  TableCell,
  TableCollection,
  TableColumn,
  TableContent,
  TableFooter,
  TableHeader,
  TableLoadMoreContent,
  TableLoadMoreItem,
  TableLoadingOverlay,
  TableRoot,
  TableRow,
  TableSelectionCheckbox,
  TableSortableColumnHeader,
};

export {
  calculateColumnGeometry,
  type ColumnGeometry,
  type ColumnGeometryDefinition,
  type ColumnPinnedSide,
  type ResolvedColumnGeometry,
} from "./column-geometry";

export type {
  TableBodyProps,
  TableCellProps,
  TableColumnProps,
  TableContentProps,
  TableFooterProps,
  TableHeaderProps,
  TableLoadMoreContentProps,
  TableLoadMoreItemProps,
  TableLoadingOverlayProps,
  TableRootProps,
  TableRootProps as TableProps,
  TableRowProps,
  TableSelectionCheckboxProps,
  TableSortableColumnHeaderProps,
  TableSortDirection,
} from "./table";

export type {Key, Selection, SelectionMode, SortDescriptor} from "react-aria-components/Table";
export type {DisabledBehavior, SelectionBehavior} from "@react-types/shared";

export {getKeyValue} from "@sytechui/shared-utils";
