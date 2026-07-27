import {Alert} from "@sytechui/react";

const SparkleIcon = () => (
  <svg fill="none" height="16" viewBox="0 0 24 24" width="16">
    <path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z" fill="currentColor" />
  </svg>
);

export default function App() {
  return (
    <Alert status="accent">
      <Alert.Indicator>
        <SparkleIcon />
      </Alert.Indicator>
      <Alert.Content>
        <Alert.Title>Custom indicator</Alert.Title>
        <Alert.Description>The default status icon has been replaced.</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
