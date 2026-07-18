import {divider, labeledDivider} from "../src";

describe("divider", () => {
  it("supports horizontal and self-stretching vertical layouts", () => {
    expect(divider()).toContain("h-divider");
    expect(divider({orientation: "vertical"})).toContain("self-stretch");
  });

  it("exposes labeled divider slots using divider theme tokens", () => {
    const slots = labeledDivider();

    expect(Object.keys(slots)).toEqual(["base", "line", "label"]);
    expect(slots.line()).toContain("h-divider");
    expect(slots.line()).toContain("bg-divider");
  });
});
