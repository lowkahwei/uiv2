import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Button,
} from "@sytechui/react";
import {useAsyncList} from "@react-stately/data";

const columns = [
  {id: "name", label: "Name"},
  {id: "height", label: "Height"},
  {id: "mass", label: "Mass"},
  {id: "birth_year", label: "Birth year"},
];

export default function App() {
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  let list = useAsyncList({
    async load({signal, cursor}) {
      if (cursor) {
        setPage((prev) => prev + 1);
      }

      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.
      const res = await fetch(cursor || "https://swapi.py4e.com/api/people/?search=", {signal});
      let json = await res.json();

      if (!cursor) {
        setIsLoading(false);
      }

      return {
        items: json.results,
        cursor: json.next,
      };
    },
  });

  const hasMore = page < 9;

  return (
    <Table
      isSticky
      classNames={{
        base: "max-h-[520px] overflow-scroll",
        table: "min-h-[420px]",
      }}
    >
      <Table.Content aria-label="Example table with client side sorting">
        <TableHeader>
          <TableColumn isRowHeader id="name">
            Name
          </TableColumn>
          <TableColumn id="height">Height</TableColumn>
          <TableColumn id="mass">Mass</TableColumn>
          <TableColumn id="birth_year">Birth year</TableColumn>
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
      <div>
        {hasMore && !isLoading ? (
          <div className="flex w-full justify-center">
            <Button isDisabled={list.isLoading} variant="flat" onPress={list.loadMore}>
              {list.isLoading && <Spinner color="white" size="sm" />}
              Load More
            </Button>
          </div>
        ) : null}
      </div>
    </Table>
  );
}
