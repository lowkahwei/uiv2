import {Snippet} from "@sytechui/react";

export default function App() {
  return (
    <div className="flex flex-wrap gap-4">
      <Snippet variant="bordered">npm install @sytechui/react</Snippet>
      <Snippet color="warning" variant="flat">
        npm install @sytechui/react
      </Snippet>
      <Snippet color="primary" variant="solid">
        npm install @sytechui/react
      </Snippet>
      <Snippet color="secondary" variant="shadow">
        npm install @sytechui/react
      </Snippet>
    </div>
  );
}
