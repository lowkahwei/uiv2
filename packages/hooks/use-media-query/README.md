# @heroui/use-media-query

A React hook that manages media queries.

## Installation

```bash
pnpm add @heroui/use-media-query
```

## Usage

### useMediaQuery

```tsx
import {useMediaQuery} from "@heroui/use-media-query";

const isWide = useMediaQuery("(min-width: 1024px)");
```

### useIsMobile

```tsx
import {useIsMobile} from "@heroui/use-media-query";

const isMobile = useIsMobile(); // default 768px
```

### useView

```tsx
import {useView} from "@heroui/use-media-query";

const view = useView(); // 'desktop' | 'tablet' | 'mobile'
```
