import {Alert, Button} from "@sytechui/react";

export default function App() {
  return (
    <Alert
      classNames={{
        base: "items-center gap-1 rounded-none rounded-r-xl border-s-4 border-default-300 px-6 py-5 shadow-medium",
        indicator: "size-10 rounded-full border border-default-200 bg-background shadow-small",
        title: "text-lg text-foreground",
      }}
    >
      <Alert.Indicator>
        <span
          aria-hidden="true"
          className="flex size-6 items-center justify-center rounded-full bg-foreground text-small font-bold text-background"
        >
          i
        </span>
      </Alert.Indicator>
      <Alert.Content>
        <Alert.Title>The documents you requested are ready to be viewed</Alert.Title>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Button size="sm" variant="bordered">
            View documents
          </Button>
          <Button
            className="h-auto min-w-0 rounded-none p-0 underline underline-offset-4"
            size="sm"
            variant="light"
          >
            Maybe later
          </Button>
        </div>
      </Alert.Content>
    </Alert>
  );
}
