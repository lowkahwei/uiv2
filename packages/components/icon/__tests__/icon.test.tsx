import type {SVGProps} from "react";

import {render} from "@testing-library/react";
import React from "react";

import {Icon} from "../src";

jest.mock("@iconify/react", () => ({
  Icon: ({icon, ssr: _ssr, ...props}: SVGProps<SVGSVGElement> & {icon: string; ssr?: boolean}) => (
    <svg data-icon={icon} {...props} />
  ),
}));

describe("Icon", () => {
  it("renders an Iconify icon with its size and accessibility state", () => {
    const {container} = render(
      <Icon aria-label="Edit" icon={{iconify: "tabler:edit"}} size={16} />,
    );
    const wrapper = container.querySelector('[role="img"]');

    expect(wrapper).toHaveAttribute("aria-label", "Edit");
    expect(wrapper).toHaveStyle({height: "16px", width: "16px"});
    expect(container.querySelector("svg")).toHaveAttribute("data-icon", "tabler:edit");
  });

  it("renders an image icon with accessible alternative text", () => {
    const ref = React.createRef<HTMLImageElement | HTMLSpanElement>();
    const {getByRole} = render(
      <Icon ref={ref} alt="Company logo" icon={{image: "/logo.svg"}} size="2rem" />,
    );
    const image = getByRole("img", {name: "Company logo"});

    expect(image).toHaveAttribute("src", "/logo.svg");
    expect(image).toHaveStyle({height: "2rem", width: "2rem"});
    expect(ref.current).toBe(image);
  });
});
