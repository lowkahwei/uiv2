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
