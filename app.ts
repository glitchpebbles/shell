import app from "ags/gtk4/app";
import TopBar from "./widgets/TopBar";
import LeftBar from "./widgets/LeftBar";
import { getAllDisplays, initializeDisplaysConfig } from "./support/util";
import { loadTheme } from "./support/theme";

// Store references to bar windows for monitor change updates
const barWindows = new Map<
  number,
  {
    topBar?: any;
    leftBar?: any;
  }
>();

function createBarsForMonitor(monitor: number) {
  const monitorNum = Number(monitor);
  const topBar = TopBar({ monitor: monitorNum });
  const leftBar = LeftBar({ monitor: monitorNum });

  barWindows.set(monitorNum, {
    topBar,
    leftBar,
  });

  return { topBar, leftBar };
}

function destroyBarsForMonitor(monitor: number) {
  const monitorNum = Number(monitor);
  const bars = barWindows.get(monitorNum);

  if (bars) {
    // Destroy each widget if it has a destroy method
    Object.values(bars).forEach((bar) => {
      if (bar && typeof bar.destroy === "function") {
        bar.destroy();
      }
    });

    // Remove from the map
    barWindows.delete(monitorNum);
  }
}



app.start({
  css: `
    levelbar {
      border-radius: 2px;
      min-width: 8px;
    }

    levelbar .filled {
      border-radius: 2px;
      background-clip: padding-box;
    }

    levelbar.low .filled {
      background-color: @success_color;
    }

    levelbar.medium .filled {
      background-color: @theme_selected_bg_color;
    }

    levelbar.high .filled {
      background-color: @error_color;
    }
    `,
  main() {
    console.log("Displays", getAllDisplays());
    initializeDisplaysConfig();

    // Load theme on startup
    loadTheme();

    // Create bars for all current monitors
    for (const monitor in app.get_monitors()) {
      createBarsForMonitor(monitor);
    }
  },
});
