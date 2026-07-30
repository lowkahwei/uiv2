import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  getKeyValue,
} from "@sytechui/react";
import useSWR from "swr";

const columns = [
  {id: "name", label: "Name"},
  {id: "height", label: "Height"},
  {id: "mass", label: "Mass"},
  {id: "birth_year", label: "Birth year"},
];
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App() {
  const [page, setPage] = React.useState(1);

  const {data, isLoading} = useSWR(`https://swapi.py4e.com/api/people?page=${page}`, fetcher, {
    keepPreviousData: true,
  });

  const rowsPerPage = 10;

  const pages = React.useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);

  const loadingState = isLoading || data?.results.length === 0 ? "loading" : "idle";

  return (
    <Table>
      <Table.Content aria-label="Example table with client async pagination">
        <TableHeader>
          <TableColumn isRowHeader id="name">
            Name
          </TableColumn>
          <TableColumn id="height">Height</TableColumn>
          <TableColumn id="mass">Mass</TableColumn>
          <TableColumn id="birth_year">Birth year</TableColumn>
        </TableHeader>
        <TableBody
          items={data?.results ?? []}
          renderEmptyState={() => (loadingState === "loading" ? <Spinner /> : null)}
        >
          {(item) => (
            <TableRow columns={columns} id={item?.name}>
              {(column) => <TableCell>{getKeyValue(item, column.id)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table.Content>
      <Table.Footer>
        {pages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null}
      </Table.Footer>
    </Table>
  );
}
