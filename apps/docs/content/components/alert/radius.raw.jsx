import {Alert} from "@sytechui/react";

const radii = ["none", "sm", "md", "lg", "full"];

export default function App() {
  return (
    <div className="flex w-full flex-col gap-4">
      {radii.map((radius) => (
        <Alert key={radius} radius={radius} status="accent">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{radius} radius</Alert.Title>
          </Alert.Content>
        </Alert>
      ))}
    </div>
  );
}
