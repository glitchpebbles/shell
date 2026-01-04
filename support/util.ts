import { exec } from "ags/process";
import { readFile, writeFile, monitorFile } from "ags/file";
import app from "ags/gtk4/app";
import Battery from "gi://AstalBattery";
import GLib from "gi://GLib";
import Gdk from "gi://Gdk";

export const format = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0)
    throw new Error("Invalid byte value");
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.max(
    0,
    Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  );
  const value = bytes / Math.pow(1024, i);
  return `${parseFloat(value.toFixed(2))} ${sizes[i]}`;
};

export function readJSONFile(filePath: string): any {
  try {
    const data = readFile(filePath);
    if (data == "") return {};
    return data.trim() ? JSON.parse(data) : {};
  } catch (e) {
    // File doesn't exist or can't be read
    return {};
  }
}

export function writeJSONFile(filePath: string, data: any) {
  try {
    if (readFile(filePath) == "")
      exec(`mkdir -p ${filePath.split("/").slice(0, -1).join("/")}`);
  } catch (e) {
    // File doesn't exist, create directory
    exec(`mkdir -p ${filePath.split("/").slice(0, -1).join("/")}`);
  }
  try {
    writeFile(filePath, JSON.stringify(data, null, 4));
  } catch (e) {
    console.log(e);
  }
}

export const hasNvidiaGpu = (() => {
  try {
    const [out, err] = exec(["test", "-d", "/proc/driver/nvidia"]);
    return !err;
  } catch {
    return false;
  }
})();

export const hasBattery = (() => {
  try {
    const device = Battery.get_default();
    return device !== null && device.isPresent === true;
  } catch {
    return false;
  }
})();

export function getDisplayId(monitorIndex: number): string | null {
  const display = Gdk.Display.get_default();
  if (!display) return null;

  const monitor = display.get_monitors().get_item(monitorIndex);

  if (!monitor) return null;

  return monitor.get_connector(); 
}


const DISPLAYS_CONFIG_PATH = `${GLib.get_home_dir()}/.config/astal-shell/displays.json`;

let displaysConfig: Record<string, [number, number]> | null = null;

function loadDisplaysConfig(): Record<string, [number, number]> {
  if (displaysConfig !== null) {
    return displaysConfig;
  }

  try {
    displaysConfig = readJSONFile(DISPLAYS_CONFIG_PATH);
  } catch (error) {
    console.warn("Failed to load displays config:", error);
    displaysConfig = {};
  }

  return displaysConfig;
}

export function getAllDisplays(): Record<string, [number, number]> {
  const displays: Record<string, [number, number]> = {};

  const monitors = app.get_monitors();
  const monitorKeys = Object.keys(monitors);

  for (const key of monitorKeys) {
    const monitorNum = Number(key);
    const displayId = getDisplayId(monitorNum);
    displays[displayId] = [300, 100]; // Default margins
  }

  return displays;
}

export function initializeDisplaysConfig(): void {
  try {
    if (readFile(DISPLAYS_CONFIG_PATH) !== "") {
      return;
    }
  } catch (e) {
  }

  // Create config directory if it doesn't exist
  const configDir = DISPLAYS_CONFIG_PATH.split("/").slice(0, -1).join("/");
  try {
    exec(`mkdir -p "${configDir}"`);
  } catch (error) {
    console.warn("Failed to create config directory:", error);
  }

  // Get all displays and create config
  const displays = getAllDisplays();
  writeJSONFile(DISPLAYS_CONFIG_PATH, displays);

  console.log(
    `Initialized displays.json with default margins for ${
      Object.keys(displays).length
    } display(s)`
  );
}

export function getBarMargins(displayId: string): { horizontal: number; vertical: number } {
  const config = loadDisplaysConfig();

  const margins = config[displayId];

  if (margins && Array.isArray(margins) && margins.length >= 2) {
    return {
      horizontal: margins[0],
      vertical: margins[1]
    };
  }

  return { horizontal: 300, vertical: 100 };
}
