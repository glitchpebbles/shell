import { createPoll } from "ags/time";
import { Gtk } from "ags/gtk4";
import GLib from "gi://GLib";

export default function DateWidget({
  dateFormat = "<b>%a %d %b</b>"
}) {
  const date = createPoll("", 60000, () =>
    GLib.DateTime.new_now_local().format(dateFormat)!
  );

  return (
    <button
      css="background: transparent; margin: 0; padding: 0;"
      halign={Gtk.Align.CENTER}
    >
      <label
        useMarkup
        halign={Gtk.Align.CENTER}
        label={date}
      />
    </button>
  );
}
