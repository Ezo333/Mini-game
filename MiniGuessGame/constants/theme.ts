/**
 * Theme configuration for Mini 1v1 Guessing Game
 */

import { Platform } from "react-native";

const primaryColor = "#6366f1"; // Indigo
const secondaryColor = "#8b5cf6"; // Purple
const successColor = "#10b981"; // Green
const warningColor = "#f59e0b"; // Yellow/Orange
const dangerColor = "#ef4444"; // Red

export const Colors = {
  light: {
    text: "#1f2937",
    background: "#ffffff",
    backgroundSecondary: "#f3f4f6",
    tint: primaryColor,
    icon: "#6b7280",
    tabIconDefault: "#9ca3af",
    tabIconSelected: primaryColor,
    border: "#e5e7eb",

    // Game specific colors
    primary: primaryColor,
    secondary: secondaryColor,
    success: successColor,
    warning: warningColor,
    danger: dangerColor,

    // Feedback colors
    correctPosition: "#10b981", // Green - correct digit, correct position
    wrongPosition: "#f59e0b", // Yellow - correct digit, wrong position
    notInNumber: "#ef4444", // Red - digit not in secret

    // UI elements
    card: "#ffffff",
    cardBorder: "#e5e7eb",
    input: "#ffffff",
    inputBorder: "#d1d5db",
    inputFocus: primaryColor,
    buttonPrimary: primaryColor,
    buttonSecondary: "#e5e7eb",
    buttonText: "#ffffff",
  },
  dark: {
    text: "#f9fafb",
    background: "#111827",
    backgroundSecondary: "#1f2937",
    tint: "#818cf8",
    icon: "#9ca3af",
    tabIconDefault: "#6b7280",
    tabIconSelected: "#818cf8",
    border: "#374151",

    // Game specific colors
    primary: "#818cf8",
    secondary: "#a78bfa",
    success: "#34d399",
    warning: "#fbbf24",
    danger: "#f87171",

    // Feedback colors
    correctPosition: "#34d399", // Green - correct digit, correct position
    wrongPosition: "#fbbf24", // Yellow - correct digit, wrong position
    notInNumber: "#f87171", // Red - digit not in secret

    // UI elements
    card: "#1f2937",
    cardBorder: "#374151",
    input: "#374151",
    inputBorder: "#4b5563",
    inputFocus: "#818cf8",
    buttonPrimary: "#818cf8",
    buttonSecondary: "#374151",
    buttonText: "#ffffff",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};
