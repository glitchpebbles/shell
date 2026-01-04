import { exec } from "ags/process";
import { Gtk } from "ags/gtk4";
import { hasBattery } from "../../../support/util";

import BatteryMeter from "./BatteryMeter";

const actions = {
  1: () => {
    try {
      exec("missioncenter");
    } catch (error) {
      console.error("Failed to execute missioncenter:", error);
    }
  },
};

export default () => (
  <box
      css={`
        margin-left: 8px;
      `}
      spacing={8}
      valign={Gtk.Align.CENTER}
    >
      {hasBattery && <BatteryMeter />}
  </box>
);
