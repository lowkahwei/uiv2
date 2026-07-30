import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Radio,
  RadioGroup,
} from "@sytechui/react";

const rows = [
  {
    key: "1",
    name: "Tony Reichert",
    role: "CEO",
    status: "Active",
  },
  {
    key: "2",
    name: "Zoey Lang",
    role: "Technical Lead",
    status: "Paused",
  },
  {
    key: "3",
    name: "Jane Fisher",
    role: "Senior Developer",
    status: "Active",
  },
  {
    key: "4",
    name: "William Howard",
    role: "Community Manager",
    status: "Vacation",
  },
];

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "role",
    label: "ROLE",
  },
  {
    key: "status",
    label: "STATUS",
  },
];

export default function App() {
  const [selectionBehavior, setSelectionBehavior] = React.useState("toggle");

  return (
    <div className="flex flex-col gap-3">
      <Table>
        <Table.Content
          aria-label="Selection behavior table example with dynamic content"
          selectionBehavior={selectionBehavior}
          selectionMode="multiple"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn id={column.key} isRowHeader={column.key === "name"}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow columns={columns} id={item.key}>
                {(column) => <TableCell>{getKeyValue(item, column.key)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table.Content>
      </Table>
      <RadioGroup
        label="Selection Behavior"
        orientation="horizontal"
        value={selectionBehavior}
        onValueChange={setSelectionBehavior}
      >
        <Radio value="toggle">Toggle</Radio>
        <Radio value="replace">Replace</Radio>
      </RadioGroup>
    </div>
  );
}
