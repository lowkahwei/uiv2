import type {LinkProps} from "@sytechui/react";

import React, {forwardRef} from "react";
import {LinkIcon} from "@sytechui/shared-icons";
import {linkAnchorClasses} from "@sytechui/theme";
import {useLink} from "@sytechui/react";

export interface MyLinkProps extends LinkProps {}

const MyLink = forwardRef<HTMLAnchorElement, MyLinkProps>((props, ref) => {
  const {
    Component,
    children,
    showAnchorIcon,
    anchorIcon = <LinkIcon className={linkAnchorClasses} />,
    getLinkProps,
  } = useLink({
    ...props,
    ref,
  });

  return (
    <Component {...getLinkProps()}>
      <>
        {children}
        {showAnchorIcon && anchorIcon}
      </>
    </Component>
  );
});

MyLink.displayName = "MyLink";

export default MyLink;
