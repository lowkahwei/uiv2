import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  RadioGroup,
  Radio,
} from "@sytechui/react";

export default function App() {
  const [selectedColor, setSelectedColor] = React.useState("default");

  const colors = ["default", "primary", "secondary", "success", "warning", "danger"];

  return (
    <div className="flex flex-col gap-3">
      <Table color={selectedColor}>
        <Table.Content
          disallowEmptySelection
          aria-label="Example static collection table"
          defaultSelectedKeys={["2", "3"]}
          selectionMode="multiple"
        >
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
      <RadioGroup
        label="Selection color"
        orientation="horizontal"
        value={selectedColor}
        onValueChange={setSelectedColor}
      >
        {colors.map((color) => (
          <Radio key={color} className="capitalize" color={color} value={color}>
            {color}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
