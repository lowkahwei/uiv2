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
  Pagination,
} from "@sytechui/react";
import {useMemo, useState} from "react";
import useSWR from "swr";

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
const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export default function Page() {
  const [page, setPage] = useState(1);

  const {data, isLoading} = useSWR<{
    count: number;
    results: SWCharacter[];
  }>(`https://swapi.py4e.com/api/people?page=${page}`, fetcher, {
    keepPreviousData: true,
  });

  const rowsPerPage = 10;

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);

  return (
    <div className="p-6">
      <Table
        classNames={{
          table: "min-h-[400px]",
        }}
      >
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
            renderEmptyState={() => (isLoading || data?.results.length === 0 ? <Spinner /> : null)}
          >
            {(item) => (
              <TableRow columns={columns} id={item.name}>
                {(column) => <TableCell>{getKeyValue(item, column.id)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table.Content>
        <div>
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
        </div>
      </Table>
    </div>
  );
}
