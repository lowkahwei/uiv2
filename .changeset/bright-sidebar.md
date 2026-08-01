---
"@sytechui/sidebar": minor
"@sytechui/theme": minor
"@sytechui/shared-icons": minor
"@sytechui/react": patch
---

Rebuild Sidebar around a shadcn-style compound API while using Sytech Button, Drawer, Input,
Link, Tooltip, and Divider components. Includes responsive mobile navigation, icon and offcanvas
collapse modes, inset and floating layouts, menu groups, badges, actions, submenus, and a footer.
Adds a Sidebar theme recipe with typed slots, layout variants, `classNames` overrides, and global or
component-level animation control.

Adds `width`/`collapsedWidth` and a configurable `toggleShortcut` (with an editable-target guard) to
`SidebarProvider`, a `drawerProps` passthrough on `Sidebar`, and `closeMobileOnPress` on menu
buttons. Splits the package into a `use-sidebar` logic layer with render-only component files, and
removes the dead `--sidebar-width-mobile` variable (mobile width follows the Drawer size).
