# @sytechui/sidebar

A composable application sidebar modeled after the shadcn sidebar layout while using SytechUI
components and theme tokens.

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>Workspace</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard">Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>Account</SidebarFooter>
    <SidebarRail />
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
  </SidebarInset>
</SidebarProvider>
```

## Layout configuration

Configure the layout once on `SidebarProvider`. `variant` controls appearance, while
`collapsible` independently controls what happens when the sidebar is closed:

```tsx
<SidebarProvider variant="floating" collapsible="offcanvas">
  <Sidebar>{/* navigation */}</Sidebar>
  <SidebarInset>{/* page content */}</SidebarInset>
</SidebarProvider>
```

- `variant`: `"sidebar"` (default), `"floating"`, or `"inset"`.
- `collapsible`: `"offcanvas"` (default), `"icon"`, or `"none"`.
- `side`: `"left"` (default) or `"right"`.

These options are orthogonal, so combinations such as `variant="inset"` with
`collapsible="icon"` work without coordinating slot classes manually. `SidebarInset`,
`SidebarTrigger`, and `SidebarRail` all consume the same provider configuration.

## Sidebar widths

`width` and `collapsedWidth` set the `--sidebar-width` and `--sidebar-width-icon` CSS variables on
`SidebarProvider`. Both accept a `string` (any CSS length) or a `number` (treated as pixels):

```tsx
<SidebarProvider collapsedWidth="4rem" width={280}>
  {/* sidebar layout */}
</SidebarProvider>
```

These variables only control the desktop sidebar. The mobile Drawer's width is set by its own
`size` prop — see [Customizing the mobile Drawer](#customizing-the-mobile-drawer).

## Keyboard shortcut

`SidebarProvider` toggles the desktop sidebar on `Cmd+B` (Mac) / `Ctrl+B` (Windows/Linux) by
default, using `mod`, `shift`, and `alt` tokens:

```tsx
<SidebarProvider toggleShortcut="mod+shift+s">{/* sidebar layout */}</SidebarProvider>
<SidebarProvider toggleShortcut={false}>{/* sidebar layout */}</SidebarProvider>
```

The shortcut is ignored while focus is inside an `<input>`, `<textarea>`, or any
`contenteditable` element, so it never steals a native editing shortcut like bold text.

## Customizing the mobile Drawer

Forward any `Drawer` prop (`backdrop`, `size`, `motionProps`, `classNames`, ...) through
`drawerProps` on `Sidebar`:

```tsx
<Sidebar drawerProps={{backdrop: "blur", size: "xs"}}>{/* sidebar layout */}</Sidebar>
```

`isOpen` and `onOpenChange` are always owned by the sidebar and cannot be overridden.

## Mobile dismissal

`SidebarMenuButton` and `SidebarMenuSubButton` can close the mobile Drawer after being pressed via
`closeMobileOnPress`. A `SidebarMenuButton` rendered with `href` (a navigation link) and every
`SidebarMenuSubButton` default to `true`; a `SidebarMenuButton` rendered without `href` (a plain
button, often used to trigger a submenu) defaults to `false` so expanding a submenu doesn't also
dismiss the Drawer. Either direction can be overridden explicitly:

```tsx
<SidebarMenuButton href="/dashboard" closeMobileOnPress={false}>
  Dashboard
</SidebarMenuButton>
<SidebarMenuButton closeMobileOnPress onPress={() => setSubmenuOpen((open) => !open)}>
  Settings
</SidebarMenuButton>
```

## Theme slots

`SidebarProvider` accepts Sytech's standard `classNames` slot overrides. A local component
`className` is applied after the provider slot class, so it can make a one-off override.

```tsx
<SidebarProvider
  classNames={{
    base: "bg-content2",
    inner: "bg-content1",
    menuButton: "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
    footer: "border-t border-divider",
  }}
>
  {/* sidebar layout */}
</SidebarProvider>
```

The available slots cover the complete compound component: `base`, `sidebar`, `gap`, `container`,
`inner`, `mobile`, `trigger`, `rail`, `inset`, `input`, `header`, `footer`, `separator`, `content`,
`group`, `groupLabel`, `groupAction`, `groupContent`, `menu`, `menuItem`, `menuButton`, `menuAction`,
`menuBadge`, `menuSub`, `menuSubItem`, and `menuSubButton`.

Animation follows `HeroUIProvider`'s global `disableAnimation` setting and can also be controlled for
one layout with `<SidebarProvider disableAnimation>`.
