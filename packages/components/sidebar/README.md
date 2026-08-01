# @sytechui/sidebar

A responsive, collapsible navigation shell built from SytechUI's React Aria primitives.

## Usage

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarMain,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@sytechui/sidebar";

export function AppShell() {
  return (
    <SidebarProvider>
      <Sidebar aria-label="Application sidebar">
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent aria-label="Primary">
          <SidebarGroup title="Workspace">
            <SidebarItem href="/dashboard" icon={<DashboardIcon />} isActive>
              Dashboard
            </SidebarItem>
            <SidebarItem href="/settings" icon={<SettingsIcon />}>
              Settings
            </SidebarItem>
          </SidebarGroup>
          <SidebarSeparator />
        </SidebarContent>
      </Sidebar>
      <SidebarMain>
        <SidebarTrigger />
      </SidebarMain>
    </SidebarProvider>
  );
}
```

`SidebarItem` renders a link when `href` is provided and a button otherwise. The mobile
sidebar uses `Drawer` and closes after an item is pressed.

## API reference

### `SidebarProvider`

| Prop               | Type                      | Default   | Description                                  |
| ------------------ | ------------------------- | --------- | -------------------------------------------- |
| `open`             | `boolean`                 | —         | Controlled desktop state.                    |
| `defaultOpen`      | `boolean`                 | `true`    | Initial uncontrolled desktop state.          |
| `onOpenChange`     | `(open: boolean) => void` | —         | Called when desktop state changes.           |
| `mobileBreakpoint` | `number`                  | `767`     | Maximum width that uses the mobile Drawer.   |
| `toggleShortcut`   | `string \| false \| null` | `"mod+b"` | Toggle shortcut; `false`/`null` disables it. |
| `reduceMotion`     | `boolean`                 | `false`   | Disables Sidebar-owned transitions.          |

### `Sidebar`

| Prop             | Type                              | Default   | Description                                |
| ---------------- | --------------------------------- | --------- | ------------------------------------------ |
| `width`          | `string \| number`                | `"270px"` | Expanded desktop width.                    |
| `collapsedWidth` | `string \| number`                | `"60px"`  | Width of the icon rail.                    |
| `side`           | `"left" \| "right"`               | `"left"`  | Docking side and default Drawer placement. |
| `collapsible`    | `"icon" \| "offcanvas" \| "none"` | `"icon"`  | Desktop collapse behavior.                 |
| `drawerProps`    | `DrawerProps`                     | —         | Props forwarded to the mobile Drawer.      |

### `SidebarItem`

| Prop                  | Type                 | Default    | Description                                      |
| --------------------- | -------------------- | ---------- | ------------------------------------------------ |
| `href`                | `LinkProps["href"]`  | —          | Renders a link when present, otherwise a button. |
| `icon` / `badge`      | `ReactNode`          | —          | Leading icon and trailing badge.                 |
| `isActive`            | `boolean`            | `false`    | Marks the item as the current page.              |
| `tooltip`             | `ReactNode \| false` | item label | Compact-state tooltip content.                   |
| `tooltipProps`        | `TooltipProps`       | —          | Additional compact-state tooltip props.          |
| `action`              | `ReactNode`          | —          | Secondary control revealed on hover/focus.       |
| `closeMobileOnAction` | `boolean`            | `true`     | Closes the mobile Drawer after activation.       |
| `forceReload`         | `boolean`            | `false`    | Uses `target="_top"` to bypass client routing.   |

HTTP(S) links default to `target="_blank" rel="noopener noreferrer"`; an explicit `target`
still wins unless `forceReload` is enabled.

### `SidebarSubmenu`

| Prop                       | Type                 | Default  | Description                                                            |
| -------------------------- | -------------------- | -------- | ---------------------------------------------------------------------- |
| `label`                    | `ReactNode`          | required | Trigger and flyout title.                                              |
| `defaultOpen`              | `boolean`            | `false`  | Initial expanded state.                                                |
| `tooltip` / `tooltipProps` | tooltip props        | —        | Accepted tooltip options; compact mode uses its titled flyout instead. |
| `showGuideLines`           | `boolean \| "hover"` | `true`   | Always, never, or hover-only nested guide line.                        |

`SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarMain`, and
`SidebarSeparator` forward the native props of their underlying element. `SidebarContent`
uses `ScrollShadow`; `SidebarSeparator` forwards `DividerProps`.

### `useSidebar()`

The hook exposes `state`, `open`, `setOpen`, `isMobile`, `openMobile`, `setOpenMobile`,
`toggleSidebar`, `mobileBreakpoint`, `side`, `collapsible`, and `reduceMotion`.

```tsx
const {side, collapsible} = useSidebar();
```

## Persisting the desktop preference

An uncontrolled `SidebarProvider` writes its desktop state to the `sidebar_state` Cookie.
Read it on the server and pass the value back as `defaultOpen` to avoid a hydration jump:

```tsx
import {cookies} from "next/headers";

const cookieStore = await cookies();
const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>;
```

The provider only writes this Cookie; reading remains the application's SSR responsibility.
Controlled providers do not write it, and mobile Drawer state is never persisted.

## Controlled state

Use `open` and `onOpenChange` when the application owns the state completely:

```tsx
<SidebarProvider open={open} onOpenChange={setOpen}>
  {children}
</SidebarProvider>
```

## Custom mobile breakpoint

`SidebarProvider` switches to the mobile Drawer at a max viewport width of `767px` by
default. Override it with `mobileBreakpoint`:

```tsx
<SidebarProvider mobileBreakpoint={1024}>{children}</SidebarProvider>
```

The default breakpoint uses a static responsive class. Custom breakpoints emit a scoped inline
media rule so the desktop sidebar also stays hidden before hydration on narrow viewports.

## Customizing the mobile Drawer

Forward any `Drawer` prop (`backdrop`, `placement`, `size`, `motionProps`, ...) through
`drawerProps` on `Sidebar`:

```tsx
<Sidebar drawerProps={{placement: "right"}}>{children}</Sidebar>
```

## Customizing the collapsed-state tooltip

`SidebarItem` shows a tooltip with its label while the desktop sidebar is collapsed. Pass
additional options through `tooltipProps`, or use `tooltip={false}` to turn it off:

```tsx
<SidebarItem tooltipProps={{delay: 500, placement: "bottom"}}>Home</SidebarItem>
<SidebarItem icon={<HomeIcon />} tooltip={false}>
  Home
</SidebarItem>
```

## Custom trigger icon

`SidebarTrigger` renders a built-in icon by default. Pass `children` to use your own:

```tsx
<SidebarTrigger>
  <MenuIcon />
</SidebarTrigger>
```

## Keyboard shortcut

`SidebarProvider` toggles the desktop sidebar on `Cmd+B` (Mac) / `Ctrl+B` (Windows/Linux), no
setup required. Shortcuts use `mod`, `shift`, and `alt` tokens:

```tsx
<SidebarProvider toggleShortcut="mod+shift+s">{children}</SidebarProvider>
<SidebarProvider toggleShortcut={false}>{children}</SidebarProvider>
```

## Docking side and collapse behavior

`Sidebar` docks to the left edge and collapses to an icon rail by default. Use `side` to dock
right (also flips the default mobile Drawer placement) and `collapsible` to change how it
collapses on desktop:

```tsx
<Sidebar collapsible="offcanvas" side="right">
  {children}
</Sidebar>
```

- `collapsible="icon"` (default) — collapses to `collapsedWidth`, showing icons only.
- `collapsible="offcanvas"` — slides the full-width sidebar beyond the viewport.
- `collapsible="none"` — never collapses; renders as a static column with no mobile Drawer.

With `collapsible="offcanvas"`, any `SidebarTrigger` placed inside the sidebar becomes
unreachable once collapsed. Always keep a
`SidebarTrigger` in your `main` content area so users can re-expand it.

## Mobile actions and link routing

Keep the Drawer open for actions that should not dismiss navigation:

```tsx
<SidebarItem closeMobileOnAction={false}>Choose workspace</SidebarItem>
```

Use `forceReload` when a same-origin destination must perform a full document navigation:

```tsx
<SidebarItem forceReload href="/reports/export">
  Export report
</SidebarItem>
```

## Item actions

Pass `action` to render a secondary control (e.g. an icon-only menu button) at the trailing
edge of a `SidebarItem`. It appears on hover/focus and is hidden while the desktop sidebar is
collapsed:

```tsx
<SidebarItem
  action={
    <Button isIconOnly size="sm" variant="light">
      <MoreIcon />
    </Button>
  }
  icon={<HomeIcon />}
>
  Home
</SidebarItem>
```

## Nested items

`SidebarSubmenu` renders an expandable group of `SidebarItem`s:

```tsx
<SidebarSubmenu icon={<SettingsIcon />} label="Settings">
  <SidebarItem href="/settings/profile">Profile</SidebarItem>
  <SidebarItem href="/settings/billing">Billing</SidebarItem>
</SidebarSubmenu>
```

Set `defaultOpen` to expand it initially. While the desktop sidebar is collapsed to icons,
pressing the submenu trigger opens a titled Popover with full-width nested items. Selecting an
item closes the Popover without expanding the sidebar.

Guide lines can be always visible, hidden, or revealed while hovering the submenu:

```tsx
<SidebarSubmenu defaultOpen label="Settings" showGuideLines="hover">
  <SidebarItem href="/settings/profile">Profile</SidebarItem>
</SidebarSubmenu>
```

## Motion and CSS variables

Set `reduceMotion` for instant Sidebar transitions. The following CSS variables can customize
motion and nested-menu spacing without theme configuration:

```tsx
<SidebarProvider reduceMotion>{children}</SidebarProvider>
```

| Variable                     | Default                      |
| ---------------------------- | ---------------------------- |
| `--sidebar-duration`         | `150ms`                      |
| `--sidebar-ease`             | `ease-in-out`                |
| `--sidebar-menu-indent`      | `1rem`                       |
| `--sidebar-menu-row-gap`     | `0.25rem`                    |
| `--sidebar-menu-guide-color` | `hsl(var(--heroui-divider))` |

```tsx
<Sidebar style={{"--sidebar-duration": "600ms"}}>{children}</Sidebar>
```

Compact submenu Popovers render in a portal, so CSS variables set only on `Sidebar` do not
inherit into the flyout; the documented fallback values apply there. Set variables on a shared
ancestor (such as `body`) when the flyout should use custom values too.

## License

MIT
