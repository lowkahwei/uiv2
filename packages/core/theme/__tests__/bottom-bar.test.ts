import {bottomBar} from "../src";

describe("bottomBar", () => {
  it("exposes the expected slots", () => {
    const slots = bottomBar();

    expect(Object.keys(slots)).toEqual([
      "base",
      "list",
      "item",
      "link",
      "selectionIndicator",
      "icon",
      "label",
    ]);
  });

  it("uses a fixed, safe-area-aware position by default", () => {
    const {base} = bottomBar();
    const classes = base();

    expect(classes).toContain("fixed");
    expect(classes).toContain("bottom-0");
    expect(classes).toContain("env(safe-area-inset-bottom)");
  });

  it("supports sticky and static positioning", () => {
    expect(bottomBar({position: "sticky"}).base()).toContain("sticky");
    expect(bottomBar({position: "static"}).base()).toContain("relative");
  });

  it("provides a solid fallback and an enhanced glass surface", () => {
    const {list} = bottomBar();
    const classes = list();

    expect(classes).toContain("bg-content1/95");
    expect(classes).toContain("supports-[backdrop-filter]:bg-content1/65");
    expect(classes).toContain("supports-[backdrop-filter]:backdrop-blur-2xl");
    expect(classes).not.toContain("before:");
  });

  it("uses the selected state for semantic colors", () => {
    expect(bottomBar({color: "danger"}).link()).toContain("data-[selected=true]:text-danger");
    expect(bottomBar({color: "success"}).selectionIndicator()).toContain("bg-success/15");
  });

  it("supports solid, underlined, and ghost indicators", () => {
    expect(bottomBar().selectionIndicator()).toContain("bg-primary/15");

    const underlined = bottomBar({color: "secondary", variant: "underlined"}).selectionIndicator();

    expect(underlined).toContain("bg-transparent");
    expect(underlined).toContain("after:h-[5px]");
    expect(underlined).toContain("after:w-5");
    expect(underlined).toContain("after:-translate-x-1/2");
    expect(underlined).toContain("after:bg-secondary");

    const ghost = bottomBar({color: "danger", variant: "ghost"}).selectionIndicator();

    expect(ghost).not.toContain("border");
    expect(ghost).toContain("bg-transparent");
  });

  it("slides the shared selection indicator", () => {
    const classes = bottomBar().selectionIndicator();

    expect(classes).toContain("will-change-[left,top,width,height]");
    expect(classes).toContain("data-[animated=true]:transition-[left,top,width,height]");
  });

  it("supports always visible, selected-only, and always hidden labels", () => {
    expect(bottomBar().label()).not.toContain("sr-only");
    expect(bottomBar({hideLabels: "selected"}).label()).toEqual(
      expect.stringContaining("group-data-[selected=true]:max-h-5"),
    );
    expect(bottomBar({hideLabels: "selected"}).label()).toEqual(
      expect.stringContaining("group-data-[selected=true]:opacity-100"),
    );
    expect(bottomBar({hideLabels: "always"}).label()).toContain("sr-only");
  });

  it("animates selected-only labels", () => {
    const classes = bottomBar({hideLabels: "selected"}).label();

    expect(classes).toContain("transition-[color,max-height,opacity]");
    expect(classes).toContain("duration-250");
  });

  it("can disable state transitions", () => {
    const slots = bottomBar({disableAnimation: true});

    expect(slots.link()).toContain("transition-none");
    expect(slots.selectionIndicator()).toContain("transition-none");
    expect(slots.icon()).toContain("transition-none");
    expect(slots.label()).toContain("transition-none");
  });
});
