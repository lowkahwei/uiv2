# @heroui/drop-zone

## Unreleased

### Patch Changes

- Debug note: if a `Modal` or other parent overlay visually closes but stays mounted after a `DropZone` tab/panel was mounted, switched away, and then closed, first suspect nested `AnimatePresence` / `layout` exit animations inside `DropZone`; treat the parent overlay as the only owner of unmount exit, remove inner `AnimatePresence` chains or force `disableAnimation` for `DropZone` to confirm and fix the issue.

## 2.0.0

### Minor Changes

- Initial HeroUI `DropZone` implementation based on React Aria drag-and-drop primitives.
