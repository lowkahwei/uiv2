# @sytechui/use-media-query

A React hook that manages media queries.

## Installation

```bash
pnpm add @sytechui/use-media-query
```

## Usage

### useMediaQuery

```tsx
import {useMediaQuery} from "@sytechui/use-media-query";

const isWide = useMediaQuery("(min-width: 1024px)");
```

### useIsMobile

```tsx
import {useIsMobile} from "@sytechui/use-media-query";

const isMobile = useIsMobile(); // default 768px
```

### useView

```tsx
import {useView} from "@sytechui/use-media-query";

const view = useView(); // 'desktop' | 'tablet' | 'mobile'
```
