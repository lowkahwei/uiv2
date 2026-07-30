import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@sytechui/react";

function generateRows(count) {
  return Array.from({length: count}, (_, index) => ({
    id: index.toString(),
    name: `Item ${index + 1}`,
    value: `Value ${index + 1}`,
  }));
}

const columns = [
  {id: "name", label: "Name"},
  {id: "value", label: "Value"},
];

export default function App() {
  const rows = generateRows(500);

  return (
    <Table isVirtualized columns={columns} layoutOptions={{headingHeight: 40, rowHeight: 40}}>
      <Table.Content
        aria-label="Example of virtualized table with a large dataset"
        className="h-[500px] overflow-auto scrollbar"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn id={column.id} isRowHeader={column.id === "name"}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow columns={columns} id={item.id}>
              {(column) => <TableCell>{item[column.id]}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table.Content>
    </Table>
  );
}
