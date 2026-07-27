import {Alert, Button} from "@sytechui/react";

export default function App() {
  return (
    <Alert status="accent">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Update available</Alert.Title>
        <Alert.Description>Refresh to get the latest features and fixes.</Alert.Description>
      </Alert.Content>
      <Button size="sm">Refresh</Button>
    </Alert>
  );
}
