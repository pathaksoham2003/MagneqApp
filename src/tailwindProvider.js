// tailwindProvider.js
import { create } from "twrnc";
import baseConfig from "./tailwind.base";
import { lightTheme, darkTheme } from "./theme";
import { Appearance } from "react-native"; // for initial system theme

const getMergedTheme = (scheme) => {
  const selectedTheme = scheme === "dark" ? darkTheme : lightTheme;
  return {
    ...baseConfig,
    theme: {
      ...baseConfig.theme,
      extend: {
        ...baseConfig.theme.extend,
        colors: {
          ...baseConfig.theme.extend.colors,
          ...selectedTheme,
        },
      },
    },
  };
};

const colorScheme = Appearance.getColorScheme(); // "light" | "dark"
const tw = create(getMergedTheme(colorScheme));

export default tw;
