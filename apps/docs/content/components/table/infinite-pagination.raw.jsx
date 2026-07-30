import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  getKeyValue,
} from "@sytechui/react";
import {useAsyncList} from "@react-stately/data";

const columns = [
  {id: "name", label: "Name"},
  {id: "height", label: "Height"},
  {id: "mass", label: "Mass"},
  {id: "birth_year", label: "Birth year"},
];

export default function App() {
  const [hasMore, setHasMore] = React.useState(false);

  let list = useAsyncList({
    async load({signal, cursor}) {
      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.
      const res = await fetch(cursor || "https://swapi.py4e.com/api/people/?search=", {signal});
      let json = await res.json();

      setHasMore(json.next !== null);

      return {
        items: json.results,
        cursor: json.next,
      };
    },
  });

  return (
    <Table
      isSticky
      classNames={{
        scrollContainer: "max-h-[520px]",
        table: "min-h-[400px]",
      }}
    >
      <Table.Content aria-label="Example table with infinite pagination">
        <TableHeader>
          <TableColumn isRowHeader id="name">
            Name
          </TableColumn>
          <TableColumn id="height">Height</TableColumn>
          <TableColumn id="mass">Mass</TableColumn>
          <TableColumn id="birth_year">Birth year</TableColumn>
        </TableHeader>
        <TableBody
          renderEmptyState={() =>
            list.loadingState === "loading" ? <Spinner color="white" /> : null
          }
        >
          <Table.Collection items={list.items}>
            {(item) => (
              <TableRow columns={columns} id={item.name}>
                {(column) => <TableCell>{getKeyValue(item, column.id)}</TableCell>}
              </TableRow>
            )}
          </Table.Collection>
          {hasMore ? (
            <Table.LoadMore isLoading={list.isLoading} onLoadMore={list.loadMore}>
              <Table.LoadMoreContent>
                <Spinner color="white" />
              </Table.LoadMoreContent>
            </Table.LoadMore>
          ) : null}
        </TableBody>
      </Table.Content>
    </Table>
  );
}
