import {Alert} from "@sytechui/react";

const statuses = ["default", "accent", "success", "warning", "danger"];

export default function App() {
  return (
    <div className="flex w-full flex-col gap-4">
      {statuses.map((status) => (
        <Alert key={status} status={status}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{status[0].toUpperCase() + status.slice(1)} alert</Alert.Title>
            <Alert.Description>This is a {status} status message.</Alert.Description>
          </Alert.Content>
        </Alert>
      ))}
    </div>
  );
}
