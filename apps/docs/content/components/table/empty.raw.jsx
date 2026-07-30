import {Table, TableHeader, TableColumn, TableBody} from "@sytechui/react";

export default function App() {
  return (
    <Table>
      <Table.Content aria-label="Example empty table">
        <TableHeader>
          <TableColumn isRowHeader>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody renderEmptyState={() => "No rows to display."}>{[]}</TableBody>
      </Table.Content>
    </Table>
  );
}
