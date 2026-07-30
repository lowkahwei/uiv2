export const scrollbarModes = {
  '[data-scrollbar="thin"]': {
    "--scrollbar-width": "thin",
    "--scrollbar-color": "var(--scrollbar-thumb) var(--scrollbar-track)",
    "--scrollbar-gutter": "auto",
  },
  '[data-scrollbar="default"]': {
    "--scrollbar-width": "auto",
    "--scrollbar-color": "auto",
    "--scrollbar-gutter": "auto",
  },
  '[data-scrollbar="none"]': {
    "--scrollbar-width": "none",
    "--scrollbar-color": "auto",
    "--scrollbar-gutter": "auto",
  },
};

export default {
  /**
   * Theme-aware scrollbar
   */
  ".scrollbar": {
    "scrollbar-width": "var(--scrollbar-width)",
    "scrollbar-color": "var(--scrollbar-color)",
    "scrollbar-gutter": "var(--scrollbar-gutter)",
  },
  ".scrollbar-thin": {
    "scrollbar-width": "thin",
    "scrollbar-color": "var(--scrollbar-thumb) var(--scrollbar-track)",
    "scrollbar-gutter": "auto",
  },
  /**
   * Scroll Hide
   */
  ".scrollbar-hide": {
    /* IE and Edge */
    "-ms-overflow-style": "none",
    /* Firefox */
    "scrollbar-width": "none",
    /* Safari and Chrome */
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  ".scrollbar-default": {
    /* IE and Edge */
    "-ms-overflow-style": "auto",
    /* Firefox */
    "scrollbar-width": "auto",
    "scrollbar-color": "auto",
    "scrollbar-gutter": "auto",
    /* Safari and Chrome */
    "&::-webkit-scrollbar": {
      display: "block",
    },
  },
  ".scrollbar-none": {
    "-ms-overflow-style": "none",
    "scrollbar-width": "none",
    "scrollbar-color": "auto",
    "scrollbar-gutter": "auto",
  },
};
