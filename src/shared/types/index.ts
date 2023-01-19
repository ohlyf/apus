import { UserConfig as ViteConfiguration } from 'vite';

export interface NavItemWithLink {
  text: string;
  link: string;
}

export interface SidebarGroup {
  text: string;
  items: SidebarItem[];
}

export interface Footer {
  message: string;
}

export interface SidebarItem {
  text?: string;
  link?: string;
  footer?: Footer;
}

export interface Sidebar {
  [path: string]: SidebarGroup[];
}
export interface ThemeConfig {
  nav?: NavItemWithLink[];
  sidebar?: Sidebar;
}

export interface UserConfig {
  title: string;
  description: string;
  themeConfig: ThemeConfig;
  vite: ViteConfiguration;
}

export interface SiteConfig {
  root: string;
  configPath: string;
  siteData: UserConfig;
}
