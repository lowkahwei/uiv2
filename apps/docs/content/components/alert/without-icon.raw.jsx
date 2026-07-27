import {Alert} from "@sytechui/react";

export default function App() {
  return (
    <Alert status="success">
      <Alert.Content>
        <Alert.Title>Profile updated</Alert.Title>
        <Alert.Description>Your changes have been saved.</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
