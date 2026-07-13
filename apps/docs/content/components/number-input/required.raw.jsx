import {NumberInput} from "@sytechui/react";

export default function App() {
  return (
    <NumberInput
      isRequired
      className="max-w-xs"
      defaultValue={1024}
      label="Amount"
      placeholder="Enter the amount"
    />
  );
}
