import GLib from "gi://GLib";
import { readJSONFile, writeJSONFile } from "./util";

export interface Theme {
  accent: {
    primary: string;
    secondary: string;
    border: string;
    overlay: string;
  };

  opacity: {
    medium: number;
  };

  font: {
    size: {
      small: string;
    };
    weight: {
      normal: string;
    };
  };
}

export const defaultTheme: Theme = {
  accent: {
    primary: "rgba(255, 255, 255, 0.9)",
    secondary: "rgba(100, 149, 237, 0.8)",
    border: "rgba(255, 255, 255, 0.2)",
    overlay: "rgba(0, 0, 0, 0.6)",
  },
  opacity: {
    medium: 0.8,
  },
  font: {
    size: {
      small: "0.8em",
    },
    weight: {
      normal: "normal",
    },
  },
};

let currentTheme: Theme = defaultTheme;

export function loadTheme(): Theme {
  const themePath = `${GLib.get_home_dir()}/.config/astal-shell/theme.json`;

  try {
    const userTheme = readJSONFile(themePath);
    if (userTheme && typeof userTheme === "object") {
      currentTheme = deepMerge(defaultTheme, userTheme);
      console.log("Loaded custom theme from:", themePath);
    } else {
      saveTheme(defaultTheme);
      currentTheme = defaultTheme;
      console.log("Created default theme file at:", themePath);
    }
  } catch (error) {
    console.warn("Failed to load theme, using default:", error);
    currentTheme = defaultTheme;
  }

  return currentTheme;
}

export function saveTheme(theme: Theme): void {
  const themePath = `${GLib.get_home_dir()}/.config/astal-shell/theme.json`;
  writeJSONFile(themePath, theme);
}

export function getCurrentTheme(): Theme {
  return currentTheme;
}

function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
