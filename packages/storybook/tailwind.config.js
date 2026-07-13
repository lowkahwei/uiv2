import {heroui} from "@sytechui/theme/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./.storybook/welcome.mdx",
    "../components/*/src/**/*.{js,jsx,ts,tsx}",
    "../components/*/stories/**/*.{js,jsx,ts,tsx}",
    "../core/theme/src/components/**/*.{js,jsx,ts,tsx}",
    "../core/theme/src/utils/**/*.{js,jsx,ts,tsx}",
    "../core/theme/stories/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  plugins: [
    heroui({
      addCommonColors: true,
      themes: {
        "light": {
          "colors": {
            "default": {
              "50": "#fdfdfd",
              "100": "#ecebeb",
              "200": "#e2e1e1",
              "300": "#d6d5d5",
              "400": "#c8c7c7",
              "500": "#b8b7b7",
              "600": "#999999",
              "700": "#767676",
              "800": "#545454",
              "900": "#2f2f2f",
              "foreground": "#111111",
              "DEFAULT": "#ecebeb"
            },
            "background": "#f5f5f5"
          }
        },
        "dark": {
          "colors": {
            "background": "#111111",
          }
        }
        // "dark": {
        //   extend: "dark", // <- inherit default values from dark theme
        //   colors: {
        //     background: "#0D001A",
        //     foreground: "#ffffff",
        //     content1: "#3B096C",
        //     content2: "#520F83",
        //     content3: "#7318A2",
        //     content4: "#9823C2",
        //     default: {
        //       50: "#3B096C",
        //       100: "#521d86",
        //       200: "#6423a6",
        //       300: "#7524cc",
        //       400: "#8935e8",
        //       500: "#9f57f5",
        //       600: "#ba86fa",
        //       700: "#d4b5fd",
        //       800: "#e7d6fe",
        //       900: "#f2e8ff",
        //       DEFAULT: "#3B096C",
        //       foreground: "#d4b5fd",
        //     },
        //     primary: {
        //       50: "#3B096C",
        //       100: "#520F83",
        //       200: "#7318A2",
        //       300: "#9823C2",
        //       400: "#c031e2",
        //       500: "#DD62ED",
        //       600: "#F182F6",
        //       700: "#FCADF9",
        //       800: "#FDD5F9",
        //       900: "#FEECFE",
        //       DEFAULT: "#DD62ED",
        //       foreground: "#ffffff",
        //     },
        //     focus: "#F182F6",
        //   },
        //   layout: {
        //     disabledOpacity: "0.3",
        //     radius: {
        //       small: "4px",
        //       medium: "6px",
        //       large: "8px",
        //     },
        //     borderWidth: {
        //       small: "1px",
        //       medium: "2px",
        //       large: "3px",
        //     },
        //   },
        // },
      },
    }),
  ],
};
