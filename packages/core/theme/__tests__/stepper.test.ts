import {stepper} from "../src";

describe("stepper", () => {
  it("exposes stable semantic slots", () => {
    expect(Object.keys(stepper())).toEqual([
      "base",
      "list",
      "item",
      "trigger",
      "indicator",
      "content",
      "title",
      "description",
      "separator",
    ]);
  });

  it("supports horizontal and vertical layouts", () => {
    expect(stepper().list()).toContain("flex-row");
    expect(stepper({orientation: "vertical"}).list()).toContain("flex-col");
    expect(stepper({orientation: "vertical"}).separator()).toContain("w-0.5");
  });

  it("uses semantic colors for progress and danger for errors", () => {
    expect(stepper().indicator()).toContain("data-[status=current]:bg-primary");
    expect(stepper({color: "success"}).separator()).toContain("data-[status=complete]:bg-success");
    expect(stepper({variant: "bordered"}).indicator()).toContain(
      "data-[status=current]:text-primary",
    );
    expect(stepper().indicator()).toContain("data-[status=error]:bg-danger");
  });

  it("supports solid, bordered, flat, and dot indicators", () => {
    expect(stepper({variant: "solid"}).indicator()).toContain("data-[status=current]:bg-primary");
    expect(stepper({variant: "bordered"}).indicator()).not.toContain(
      "data-[status=current]:bg-primary",
    );
    expect(stepper({variant: "flat"}).indicator()).toContain("data-[status=current]:bg-primary/20");
    expect(stepper({variant: "dot"}).indicator()).toContain("h-2.5");
    expect(stepper({variant: "dot"}).separator()).toContain("mt-[4px]");
  });

  it("controls separator layout independently from the indicator variant", () => {
    expect(stepper({variant: "dot"}).separator()).toContain("mx-2");
    expect(stepper({separatorMode: "connected"}).separator()).toContain("mx-0");
    expect(stepper({separatorMode: "connected"}).content()).toContain("w-0");
    expect(stepper({separatorMode: "connected"}).content()).toContain("overflow-visible");
    expect(
      stepper({
        orientation: "vertical",
        separatorMode: "connected",
        variant: "solid",
      }).separator(),
    ).toContain("top-8");
  });

  it("supports SytechUI radius tokens", () => {
    expect(stepper({radius: "none"}).indicator()).toContain("rounded-none");
    expect(stepper({radius: "md"}).indicator()).toContain("rounded-medium");
    expect(stepper({radius: "full"}).indicator()).toContain("rounded-full");
  });

  it("can disable state transitions", () => {
    expect(stepper().indicator()).toContain("transition-transform");
    expect(stepper({disableAnimation: true}).indicator()).toContain("transition-none");
  });
});
