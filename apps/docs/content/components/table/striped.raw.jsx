import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@sytechui/react";

export default function App() {
  return (
    <Table isStriped>
      <Table.Content aria-label="Example static collection table">
        <TableHeader>
          <TableColumn isRowHeader>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow id="1">
            <TableCell>Tony Reichert</TableCell>
            <TableCell>CEO</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow id="2">
            <TableCell>Zoey Lang</TableCell>
            <TableCell>Technical Lead</TableCell>
            <TableCell>Paused</TableCell>
          </TableRow>
          <TableRow id="3">
            <TableCell>Jane Fisher</TableCell>
            <TableCell>Senior Developer</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow id="4">
            <TableCell>William Howard</TableCell>
            <TableCell>Community Manager</TableCell>
            <TableCell>Vacation</TableCell>
          </TableRow>
        </TableBody>
      </Table.Content>
    </Table>
  );
}
