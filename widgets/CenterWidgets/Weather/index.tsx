import { createState } from "ags";
import { execAsync } from "ags/process";
import { Gtk } from "ags/gtk4";
import niri from "../../../support/niri";
import { getCurrentTheme } from "../../../support/theme";


export default () => {
  const [weather, setWeather] = createState<string>("");

  const updateWeather = async () => {
    try {
      const res = await execAsync('curl "https://wttr.in?format=1"');  
      const formattedRes = res.replace(/\s{2,}/g, ' ').trim();
      setWeather(formattedRes)
    } catch (e) {
      console.warn("Failed to update weather:", e);
    }
  };
  const interval = setInterval(updateWeather, 21600000);
  updateWeather();

  const theme = getCurrentTheme();
  return (
    <button
      css="background: transparent; margin: 0; padding: 0; margin-top: -8px;"
      halign={Gtk.Align.CENTER}
      onClicked={() => {
        niri.toggleOverview();
      }}
    >
      <label
        css={`
          font-size: ${theme.font.size.small};
          font-weight: ${theme.font.weight.normal};
          opacity: ${theme.opacity.medium};
        `}
        halign={Gtk.Align.CENTER}
        onDestroy={() => clearInterval(interval)}
        label={weather}
      />
    </button>
  );
};
