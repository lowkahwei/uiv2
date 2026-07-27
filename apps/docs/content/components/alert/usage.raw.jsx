import {Alert} from "@sytechui/react";

export default function App() {
  return (
    <Alert>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>New features available</Alert.Title>
        <Alert.Description>
          Check out our latest updates including dark mode support and improved accessibility.
        </Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
