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
  SidebarProvider,
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
        </SidebarContent>
      </Sidebar>
      <main>
        <SidebarTrigger />
      </main>
    </SidebarProvider>
  );
}
```

`SidebarItem` renders a link when `href` is provided and a button otherwise. The mobile
sidebar uses `Drawer` and closes after an item is pressed.

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

Note: the anti-flash CSS that hides the desktop sidebar before hydration only ships for the
default `767` breakpoint (it's a static, build-time Tailwind class). Custom breakpoints skip
that optimization and may briefly flash the desktop layout on mobile viewports before React
hydrates.

## Customizing the mobile Drawer

Forward any `Drawer` prop (`backdrop`, `placement`, `size`, `motionProps`, ...) through
`drawerProps` on `Sidebar`:

```tsx
<Sidebar drawerProps={{placement: "right"}}>{children}</Sidebar>
```

## Disabling the collapsed-state tooltip

`SidebarItem` shows a tooltip with its label while the desktop sidebar is collapsed. Pass
`tooltip={false}` to turn it off for a specific item:

```tsx
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
setup required.

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
- `collapsible="offcanvas"` — collapses to zero width, fully hidden.
- `collapsible="none"` — never collapses; renders as a static column with no mobile Drawer.

With `collapsible="offcanvas"`, any `SidebarTrigger` placed inside the sidebar becomes
unreachable once collapsed (its container is clipped to zero width). Always keep a
`SidebarTrigger` in your `main` content area so users can re-expand it.

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
pressing the submenu trigger expands both the sidebar and its nested items.

## License

MIT
