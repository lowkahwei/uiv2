"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@sytechui/react";
import {SortIcon} from "@sytechui/shared-icons";
import {useAsyncList} from "@react-stately/data";
import {useState} from "react";

type SWCharacter = {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
};

const columns = [
  {id: "name", label: "Name"},
  {id: "height", label: "Height"},
  {id: "mass", label: "Mass"},
  {id: "birth_year", label: "Birth year"},
] as const;

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  let list = useAsyncList<SWCharacter>({
    async load({signal}) {
      let res = await fetch(`https://swapi.py4e.com/api/people/?search`, {
        signal,
      });
      let json = await res.json();

      setIsLoading(false);

      return {
        items: json.results,
      };
    },
    async sort({items, sortDescriptor}) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column as keyof SWCharacter];
          let second = b[sortDescriptor.column as keyof SWCharacter];
          let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  return (
    <div className="p-6">
      <Table
        classNames={{
          table: "min-h-[400px]",
        }}
      >
        <Table.Content
          aria-label="Example table with client side sorting"
          sortDescriptor={list.sortDescriptor}
          onSortChange={list.sort}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn
                key={column.id}
                allowsSorting
                id={column.id}
                isRowHeader={column.id === "name"}
              >
                {({sortDirection}) => (
                  <Table.SortableColumnHeader
                    indicator={<SortIcon />}
                    sortDirection={sortDirection}
                  >
                    {column.label}
                  </Table.SortableColumnHeader>
                )}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            items={list.items}
            renderEmptyState={() => (isLoading ? <Spinner label="Loading..." /> : null)}
          >
            {(item) => (
              <TableRow columns={columns} id={item.name}>
                {(column) => <TableCell>{getKeyValue(item, column.id)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table.Content>
      </Table>
    </div>
  );
}
