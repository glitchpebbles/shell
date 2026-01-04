import Gtk from "gi://Gtk";
import Tray from "gi://AstalTray";
import { createBinding, For } from "ags";

export default () => {
  const tray = Tray.get_default();
  const items = createBinding(tray, "items");

  return (
    <box 
      spacing={8}
      css="background-color: transparent;"
    >
      <For each={items}>
        {(item: any) => {
          const tooltipMarkup = createBinding(item, "tooltipMarkup");
          const gicon = createBinding(item, "gicon");

          return (
            <button
              tooltipMarkup={tooltipMarkup}
              css={`
                padding: 0;
                margin: 0;
                
                background-color: transparent;
                background-image: none;
                border: none;
                box-shadow: none;
                
                min-width: 0;
                min-height: 0;
                border-radius: 0;
              `}
              $={(self) => {
                self.insert_action_group("dbusmenu", item.actionGroup);
                item.connect("notify::action-group", () => {
                  self.insert_action_group("dbusmenu", item.actionGroup);
                });

                const popover = new Gtk.PopoverMenu();
                
                popover.set_parent(self);

                const updateMenu = () => {
                  popover.set_menu_model(item.menuModel);
                };
                
                item.connect("notify::menu-model", updateMenu);
                updateMenu();

                self.connect("clicked", () => {
                  if (item.menuModel) {
                    popover.popup();
                  }
                });
              }}
            >
              <image
                gicon={gicon}
                css={`
                  font-size: 18px;
                  min-width: 0;
                  min-height: 0;
                `}
              />
            </button>
          );
        }}
      </For>
    </box>
  );
};