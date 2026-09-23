/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const CasioColors = {
  primary: '#0b1f33',
  primaryLight: '#183452',
  accent: '#f5c451',
  accentDark: '#b07b12',
  accentLight: '#fff8e6',
  crimson: '#c23b28',
  crimsonLight: '#fdeeed',
  background: '#f4f1eb',
  surface: '#ffffff',
  surfaceCard: '#ffffff',
  border: '#e4dfd5',
  borderLight: '#eeeae1',
  text: '#162536',
  textSecondary: '#6a737d',
  textMuted: '#9aa0a6',
  white: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
} as const;

export const Colors = {
  light: {
    text: '#162536',
    background: '#f4f1eb',
    backgroundElement: '#ffffff',
    backgroundSelected: '#e8e3d8',
    textSecondary: '#6a737d',
    primary: '#0b1f33',
    accent: '#f5c451',
  },
  dark: {
    text: '#ffffff',
    background: '#0b1f33',
    backgroundElement: '#183452',
    backgroundSelected: '#204066',
    textSecondary: '#a0aec0',
    primary: '#f5c451',
    accent: '#f5c451',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
