import {divider, labeledDivider} from "../src";

describe("divider", () => {
  it("supports horizontal and self-stretching vertical layouts", () => {
    expect(divider()).toContain("h-divider");
    expect(divider({orientation: "vertical"})).toContain("self-stretch");
  });

  it("uses physical offsets for inset dividers so Safari can position the pseudo-element", () => {
    const styles = divider({orientation: "vertical", inset: "md"});

    expect(styles).toContain("after:top-1/4");
    expect(styles).toContain("after:bottom-1/4");
    expect(styles).toContain("after:left-0");
    expect(styles).toContain("after:right-0");
    expect(styles).not.toContain("after:inset-y-1/4");
  });

  it("exposes labeled divider slots using divider theme tokens", () => {
    const slots = labeledDivider();

    expect(Object.keys(slots)).toEqual(["base", "line", "label"]);
    expect(slots.line()).toContain("h-divider");
    expect(slots.line()).toContain("bg-divider");
  });
});
