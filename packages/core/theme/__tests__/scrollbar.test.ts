import scrollbarUtilities, {scrollbarModes} from "../src/utilities/scrollbar-hide";
import {baseStyles} from "../src/utils/classes";

describe("scrollbar utilities", () => {
  it("uses thin theme-aware scrollbars by default", () => {
    expect(baseStyles("heroui")).toMatchObject({
      "--scrollbar-thumb": "hsl(var(--heroui-foreground) / 0.15)",
      "--scrollbar-track": "transparent",
      "--scrollbar-width": "thin",
      "--table-pinned-bg": "hsl(var(--heroui-content1))",
      "--table-pinned-shadow": "hsl(var(--heroui-foreground) / 0.25)",
    });
    expect(scrollbarUtilities[".scrollbar"]).toEqual({
      "scrollbar-width": "var(--scrollbar-width)",
      "scrollbar-color": "var(--scrollbar-color)",
      "scrollbar-gutter": "var(--scrollbar-gutter)",
    });
  });

  it("supports thin, browser-default, and hidden inherited modes", () => {
    expect(scrollbarModes['[data-scrollbar="thin"]']["--scrollbar-width"]).toBe("thin");
    expect(scrollbarModes['[data-scrollbar="default"]']["--scrollbar-width"]).toBe("auto");
    expect(scrollbarModes['[data-scrollbar="none"]']["--scrollbar-width"]).toBe("none");
  });
});
