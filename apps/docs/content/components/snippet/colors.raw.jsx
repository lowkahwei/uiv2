import {Snippet} from "@sytechui/react";

export default function App() {
  return (
    <div className="flex flex-wrap gap-4">
      <Snippet color="default">npm install @sytechui/react</Snippet>
      <Snippet color="primary">npm install @sytechui/react</Snippet>
      <Snippet color="secondary">npm install @sytechui/react</Snippet>
      <Snippet color="success">npm install @sytechui/react</Snippet>
      <Snippet color="warning">npm install @sytechui/react</Snippet>
      <Snippet color="danger">npm install @sytechui/react</Snippet>
    </div>
  );
}
