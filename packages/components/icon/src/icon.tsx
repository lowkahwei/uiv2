"use client";

import type {CSSProperties, Ref} from "react";

import {Icon as IconifyIcon} from "@iconify/react";
import {forwardRef} from "react";

export type IconConfig = {iconify: string; image?: never} | {image: string; iconify?: never};

export type IconSize = string | number;

export interface IconProps {
  /**
   * Iconify name or image source to render.
   */
  icon: IconConfig;
  /**
   * Accessible label. Icons are decorative when omitted.
   */
  "aria-label"?: string;
  /**
   * Alternative text for image icons. Defaults to the accessible label or an empty string.
   */
  alt?: string;
  className?: string;
  size?: IconSize;
  style?: CSSProperties;
}

export type IconElement = HTMLSpanElement | HTMLImageElement;

const Icon = forwardRef<IconElement, IconProps>(
  ({icon, size = 24, className, style, alt, "aria-label": ariaLabel}, ref) => {
    const iconStyle = {width: size, height: size, ...style};

    if (icon.iconify) {
      return (
        <span
          ref={ref as Ref<HTMLSpanElement>}
          aria-hidden={ariaLabel ? undefined : true}
          aria-label={ariaLabel}
          className={className}
          role={ariaLabel ? "img" : undefined}
          style={{display: "inline-flex", flex: "none", ...iconStyle}}
        >
          <IconifyIcon ssr height="100%" icon={icon.iconify} width="100%" />
        </span>
      );
    }

    if (icon.image) {
      return (
        <img
          ref={ref as Ref<HTMLImageElement>}
          alt={alt ?? ariaLabel ?? ""}
          className={className}
          src={icon.image}
          style={iconStyle}
        />
      );
    }

    return null;
  },
);

Icon.displayName = "SytechUI.Icon";

export default Icon;
