import {Link, Button} from "@sytechui/react";

export default function App() {
  return (
    <Button
      showAnchorIcon
      as={Link}
      color="primary"
      href="https://github.com/heroui-inc/heroui"
      variant="solid"
    >
      Button Link
    </Button>
  );
}
