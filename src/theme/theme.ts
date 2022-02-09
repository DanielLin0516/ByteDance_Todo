import { themes } from "./model";

export function setTheme(themeName: string) {
  const themeConfig = themes[themeName];
  console.log(themeConfig);
  
  for (let key in themeConfig) {
    console.log('key', key);
    console.log('themeConfig[key]',themeConfig[key]);
    

    document
      .getElementsByTagName("body")[0]
      .style.setProperty(`--${key}`, themeConfig[key]);
  }
}
