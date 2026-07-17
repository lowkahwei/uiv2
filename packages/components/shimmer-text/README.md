# @sytechui/shimmer-text

A theme-aware text shimmer capability that inherits the current typography and color.

## Installation

```sh
pnpm add @sytechui/shimmer-text
```

## Usage

```tsx
import {ShimmerText} from "@sytechui/shimmer-text";

<ShimmerText className="text-primary" role="status">
  Generating response…
</ShimmerText>;
```

```tsx
<ShimmerText angle={35} duration={1200} once reverse spread="5rem">
  Response generated
</ShimmerText>
```

| Prop               | Type               | Default             |
| ------------------ | ------------------ | ------------------- |
| `duration`         | `number`           | `2000` ms           |
| `spread`           | `number \| string` | `calc(3ch + 40px)`  |
| `angle`            | `number`           | `20` degrees        |
| `once`             | `boolean`          | `false`             |
| `reverse`          | `boolean`          | `false`             |
| `disableAnimation` | `boolean`          | Provider or `false` |

`dir="rtl"` is handled automatically. In RTL, `reverse` flips the animation back against
the reading direction.

The component follows `currentColor`, respects `HeroUIProvider`'s `disableAnimation`
setting, and renders normal readable text when reduced motion is requested.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/heroui-inc/heroui/blob/master/LICENSE).
