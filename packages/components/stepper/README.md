# @sytechui/stepper

An accessible, controlled indicator for linear multi-step processes. It owns presentation,
status derivation, and step-selection intent; the application owns validation, routing, and step
content.

```tsx
import {Stepper, StepperItem} from "@sytechui/stepper";

<Stepper aria-label="Account setup" currentKey={currentKey} onCurrentChange={setCurrentKey}>
  <StepperItem key="account" title="Account" />
  <StepperItem key="verify" title="Verification" />
  <StepperItem key="complete" title="Complete" />
</Stepper>;
```

## API

### Stepper

| Prop               | Type                                       | Default        | Purpose                                                                                                    |
| ------------------ | ------------------------------------------ | -------------- | ---------------------------------------------------------------------------------------------------------- |
| `currentKey`       | `React.Key`                                | —              | Identifies the current step in an active process.                                                          |
| `isComplete`       | `boolean`                                  | `false`        | Marks the whole process complete; mutually exclusive with `currentKey`.                                    |
| `onCurrentChange`  | `(key: React.Key) => void`                 | —              | Reports selection intent and enables button triggers.                                                      |
| `items`            | `Iterable<T>`                              | —              | Supplies dynamic data to a render-function child.                                                          |
| `orientation`      | `"horizontal" \| "vertical"`               | `"horizontal"` | Controls layout and connector direction.                                                                   |
| `variant`          | `"solid" \| "bordered" \| "flat" \| "dot"` | `"solid"`      | Uses SytechUI theme variants.                                                                              |
| `color`            | SytechUI semantic color                    | `"primary"`    | Colors current, complete, and loading states.                                                              |
| `size`             | `"sm" \| "md" \| "lg"`                     | `"md"`         | Sizes indicators and labels.                                                                               |
| `radius`           | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"full"`       | Applies SytechUI radius tokens to indicators.                                                              |
| `separatorMode`    | `"spaced" \| "connected"`                  | `"spaced"`     | Controls whether separators leave a gap or connect directly to indicators.                                 |
| `isDisabled`       | `boolean`                                  | `false`        | Disables every step trigger.                                                                               |
| `disableAnimation` | `boolean`                                  | provider value | Disables transitions and loading animation.                                                                |
| `classNames`       | slot class map                             | —              | Styles `base`, `list`, `item`, `trigger`, `indicator`, `content`, `title`, `description`, and `separator`. |

### StepperItem

| Prop          | Type                                              | Purpose                                          |
| ------------- | ------------------------------------------------- | ------------------------------------------------ |
| `title`       | `ReactNode`                                       | Required primary label.                          |
| `description` | `ReactNode`                                       | Optional secondary label.                        |
| `status`      | `"pending" \| "complete" \| "error" \| "loading"` | Overrides the inferred status.                   |
| `indicator`   | `ReactNode \| (state) => ReactNode`               | Replaces the default number or status icon.      |
| `statusLabel` | `ReactNode`                                       | Adds localized assistive text such as “Loading”. |
| `isDisabled`  | `boolean`                                         | Disables one step trigger.                       |
| `triggerRef`  | button ref                                        | Exposes the interactive trigger.                 |

## Contract

- `StepperItem` must be a direct child of `Stepper`; fragments are flattened.
- Keys identify steps. They must be stable and unique for the lifetime of the process.
- Provide `aria-label` or `aria-labelledby` so the progress list or navigation landmark has a name.
- Before `currentKey` is `complete`, the matching step is `current`, and later steps are `pending`.
- Supplying `onCurrentChange` makes steps interactive. Without it, the component is a read-only
  ordered progress list.
- The component does not assume forward-only navigation. The application decides whether a
  requested key is valid and updates `currentKey` only after its own rules pass.
- Horizontal layout scrolls when content cannot fit. Switching to vertical orientation at a
  product-defined breakpoint remains the application's decision.
- Step panels, form state, validation, route changes, persistence, and async orchestration are
  intentionally outside this package.

## Release gate

A change is releasable only when it passes behavioral tests for status derivation, completed and
overridden states, pointer and keyboard activation, disabled behavior, refs, dynamic collections,
semantic slots, and React Strict Mode. Theme variants require slot and compound-variant tests.
Typecheck, package build, lint, formatting, Storybook compilation, and visual checks in horizontal,
vertical, narrow-screen, error, and loading states are also required.
