# @sytechui/sidebar

## 3.0.1

### Patch Changes

- Stopped relying on Tailwind classes hardcoded in this package's compiled output for layout-critical styles. Consumers following the standard HeroUI setup only scan `@sytechui/theme/dist`, so classes such as `w-[var(--sidebar-width-mobile,18rem)]` were never compiled into the app CSS and the mobile Drawer collapsed to its content width. Fixes:
  - The mobile Drawer now applies its default `18rem` width and `85vw` max-width inline; `drawerProps.style.width` / `drawerProps.style.maxWidth` remain supported overrides. The unused `--sidebar-width-mobile` CSS variable was removed.
  - The `collapsible="none"` sidebar now applies its width/height/margin inline instead of via `w-[var(--sidebar-width)]` and friends.
  - Desktop/mobile visibility no longer depends on `hidden md:block` being present in the consumer CSS; the pre-hydration `@media` style tag is now always rendered (previously only for custom `mobileBreakpoint` values).

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
