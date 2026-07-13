import {NumberInput} from "@sytechui/react";

export default function App() {
  return (
    <NumberInput
      className="max-w-xs"
      defaultValue={1024}
      description="Enter the amount"
      label="Amount"
    />
  );
}
