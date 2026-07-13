import {Input} from "@sytechui/react";

export default function App() {
  return (
    <Input
      isReadOnly
      className="max-w-xs"
      defaultValue="junior@heroui.com"
      label="Email"
      type="email"
      variant="bordered"
    />
  );
}
