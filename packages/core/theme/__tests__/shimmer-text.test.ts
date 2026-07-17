import {animations} from "../src/animations";
import {shimmerText} from "../src/components/shimmer-text";
import shimmerTextUtilities from "../src/utilities/shimmer-text";

describe("shimmerText", () => {
  it("uses a background-position animation independent from skeleton", () => {
    expect(animations.keyframes["shimmer-text"]).toEqual({
      "0%": {backgroundPosition: "100% 0"},
      "100%": {backgroundPosition: "0 0"},
    });
    expect(animations.keyframes.shimmer).toEqual({
      "100%": {transform: "translateX(200%)"},
    });
  });

  it("exposes the supported variants", () => {
    expect(shimmerText()).toContain("sytech-shimmer-text");
    expect(shimmerText({reverse: true})).toContain("sytech-shimmer-text-reverse");
    expect(shimmerText({once: true})).toContain("sytech-shimmer-text-once");
    expect(shimmerText({disableAnimation: true})).toContain("sytech-shimmer-text-disabled");
  });

  it("restores readable text when motion is disabled", () => {
    expect(shimmerTextUtilities[".sytech-shimmer-text-disabled"]).toEqual({
      animation: "none !important",
      "background-image": "none",
      "-webkit-text-fill-color": "currentColor",
    });
  });
});
