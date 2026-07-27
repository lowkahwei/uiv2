"use client";

import {Alert, Button} from "@sytechui/react";
import {useState} from "react";

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return isVisible ? (
    <Alert status="warning">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Scheduled maintenance</Alert.Title>
        <Alert.Description>Services will be unavailable briefly on Sunday.</Alert.Description>
      </Alert.Content>
      <Button
        isIconOnly
        aria-label="Close alert"
        size="sm"
        variant="light"
        onPress={() => setIsVisible(false)}
      >
        ×
      </Button>
    </Alert>
  ) : (
    <Button onPress={() => setIsVisible(true)}>Show alert</Button>
  );
}
