# @sytechui/sidebar

## 3.0.0

### Minor Changes

- 85da7fa: Rebuild Sidebar around a shadcn-style compound API while using Sytech Button, Drawer, Input,
  Link, Tooltip, and Divider components. Includes responsive mobile navigation, icon and offcanvas
  collapse modes, inset and floating layouts, menu groups, badges, actions, submenus, and a footer.
  Adds a Sidebar theme recipe with typed slots, layout variants, `classNames` overrides, and global or
  component-level animation control.

  Keeps layout responsibilities on `SidebarProvider`: `variant` selects the visual layout,
  `collapsible` selects the collapse behavior, and `side` selects the docked edge. Sidebar content,
  inset content, triggers, and rails consume the same configuration automatically.

  Adds `width`/`collapsedWidth` and a configurable `toggleShortcut` (with an editable-target guard) to
  `SidebarProvider`, a `drawerProps` passthrough on `Sidebar`, and `closeMobileOnPress` on menu
  buttons. Splits the package into a `use-sidebar` logic layer with render-only component files, and
  removes the dead `--sidebar-width-mobile` variable (mobile width follows the Drawer size).

### Patch Changes

- Updated dependencies [85da7fa]
  - @sytechui/shared-icons@2.2.0
  - @sytechui/button@2.2.32
  - @sytechui/divider@3.0.0
  - @sytechui/input@2.4.41
  - @sytechui/link@2.2.28
  - @sytechui/skeleton@2.2.18
  - @sytechui/tooltip@2.2.29
  - @sytechui/drawer@2.3.2
