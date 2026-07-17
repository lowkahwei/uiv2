const readableText = {
  animation: "none !important",
  "background-image": "none",
  "-webkit-text-fill-color": "currentColor",
};

export default {
  ".sytech-shimmer-text": {
    color: "currentColor",
    "--shimmer-angle": "20deg",
    "--shimmer-spread": "calc(3ch + 40px)",
    "--shimmer-iteration": "infinite",
    "--shimmer-direction": "normal",
    "@supports ((background-clip: text) or (-webkit-background-clip: text)) and (color: color-mix(in srgb, red, blue))":
      {
        "background-image":
          "linear-gradient(calc(90deg + var(--shimmer-angle)), currentColor calc(50% - var(--shimmer-spread)), color-mix(in srgb, var(--shimmer-color, currentColor) 35%, transparent) 50%, currentColor calc(50% + var(--shimmer-spread)))",
        "background-repeat": "no-repeat",
        "background-size": "calc(200% + var(--shimmer-spread) + var(--shimmer-spread)) 100%",
        "background-position": "100% 0",
        "background-clip": "text",
        "-webkit-background-clip": "text",
        "-webkit-text-fill-color": "transparent",
      },
    "&:where([dir='rtl'], [dir='rtl'] *)": {
      "--shimmer-direction": "reverse",
    },
    "&.sytech-shimmer-text-reverse": {
      "--shimmer-direction": "reverse",
    },
    "&.sytech-shimmer-text-reverse:where([dir='rtl'], [dir='rtl'] *)": {
      "--shimmer-direction": "normal",
    },
    "@media (prefers-reduced-motion: reduce)": readableText,
  },
  ".sytech-shimmer-text-once": {
    "--shimmer-iteration": "1",
  },
  ".sytech-shimmer-text-disabled": readableText,
};
