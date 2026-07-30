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
import {useAsyncList} from "@react-stately/data";

const columns = [
  {id: "name", label: "Name"},
  {id: "height", label: "Height"},
  {id: "mass", label: "Mass"},
  {id: "birth_year", label: "Birth year"},
];

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  let list = useAsyncList({
    async load({signal}) {
      let res = await fetch("https://swapi.py4e.com/api/people/?search", {
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
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
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
          <TableColumn isRowHeader allowsSorting id="name">
            Name
          </TableColumn>
          <TableColumn allowsSorting id="height">
            Height
          </TableColumn>
          <TableColumn allowsSorting id="mass">
            Mass
          </TableColumn>
          <TableColumn allowsSorting id="birth_year">
            Birth year
          </TableColumn>
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
  );
}
