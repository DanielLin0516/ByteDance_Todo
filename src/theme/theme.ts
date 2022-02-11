import { themes } from "./model";

export function setTheme(themeName: string) {
  const themeConfig = themes[themeName];

  for (let key in themeConfig) {
    document
      .getElementsByTagName("body")[0]
      .style.setProperty(`--${key}`, themeConfig[key]);
  }
}
