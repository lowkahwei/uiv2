# @sytechui/bottom-bar

A floating bottom navigation bar for primary application routes.

Please refer to the
[documentation](https://heroui.com/docs/components/bottom-bar)
for more information.

## Installation

```sh
yarn add @sytechui/bottom-bar
# or
npm i @sytechui/bottom-bar
```

## Usage

```tsx
import {BottomBar, BottomBarItem} from "@sytechui/bottom-bar";

export function AppNavigation() {
  return (
    <BottomBar aria-label="Primary navigation" defaultSelectedKey="home">
      <BottomBarItem key="home" href="/" icon={<HomeIcon />}>
        Home
      </BottomBarItem>
      <BottomBarItem key="profile" href="/profile" icon={<ProfileIcon />}>
        Profile
      </BottomBarItem>
    </BottomBar>
  );
}
```

Use `selectedKey` for route-controlled navigation and derive it from the current pathname. Fixed
and sticky bars automatically account for `env(safe-area-inset-bottom)`; applications using a
full-screen viewport should also set `viewport-fit=cover` and reserve enough bottom padding for
page content. Omit `href` when selection is handled only through `onSelectionChange`.

## License

This project is licensed under the terms of the [MIT license](../../../LICENSE).
