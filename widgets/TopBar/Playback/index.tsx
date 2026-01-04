import Mpris from "gi://AstalMpris";
import { createBinding, For } from "ags";
import Pango from 'gi://Pango';
import { Gtk } from "ags/gtk4";
import { getCurrentTheme } from "../../../support/theme";

// TODO: Automatically pause multiple playing things

function PlayPauseButton({ player }) {
  const canPlay = createBinding(player, "can_play");
  const playbackStatus = createBinding(player, "playbackStatus");

  return (
    <button
      css={`
        padding: 0;
        margin: 0;
        min-width: 24px;
        min-height: 24px;
        border-radius: 100%;
        background-color: ${getCurrentTheme().accent.overlay};
      `}
      onClicked={() => player.play_pause()}
      visible={canPlay}
    >
      <image iconName={playbackStatus((s) => {
          switch (s) {
            case Mpris.PlaybackStatus.PLAYING:
              return "media-playback-pause-symbolic";
            case Mpris.PlaybackStatus.PAUSED:
            case Mpris.PlaybackStatus.STOPPED:
              return "media-playback-start-symbolic";
          }
        })}
      />
    </button>
  );
}

const Player = (player) => {
  const coverArt = createBinding(player, "coverArt");
  const artist = createBinding(player, "artist");
  const title = createBinding(player, "title");
  const canGoNext = createBinding(player, "can_go_next");

  return (
    <box>
      <box>
        <overlay>
          <box
            class="artwork-container"
            valign={Gtk.Align.CENTER}
            css={`
              min-width: 36px;
              min-height: 36px;
              border-radius: 4px;
              border: 2px solid ${getCurrentTheme().accent.border};
            `}
          >
            <box
              class="artwork"
              css={coverArt(
                (cover) => `min-width: 36px;
                min-height: 36px;
                background-image: url('${cover}');
                background-size: cover;
                background-position: center;
                border-radius: 3px;
                `
              )}
            />
          </box>
          <box
            $type="overlay"
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            css={"opacity: 1"}
          >
            <PlayPauseButton player={player} />
          </box>
        </overlay>
      </box>

      <box
        orientation={Gtk.Orientation.VERTICAL}
        css={`
          margin-left: 8px;
          margin-right: 8px;
        `}
        valign={Gtk.Align.CENTER}
      >
        <label
          css={`
            font-size: 0.9em;
            font-weight: bold;
          `}
          label={artist}
          halign={Gtk.Align.START}
          visible={artist((artist) => !!artist)}
          ellipsize={Pango.EllipsizeMode.END}
          max-width-chars={20}
        />
        <label
          css={`
            font-size: 0.8em;
            opacity: 0.8;
          `}
          label={title}
          halign={Gtk.Align.START}
          ellipsize={Pango.EllipsizeMode.END}
          max-width-chars={20}
        />
      </box>

      <button
        css={`
          padding: 0.5em;
          background-color: transparent;
        `}
        onClicked={() => player.next()}
        visible={canGoNext}
      >
        <image iconName={"media-skip-forward-symbolic"} />
      </button>
    </box>
  );
};

export default () => {
  const mpris = Mpris.get_default();
  const players = createBinding(mpris, "players");

  return (
    <box>
      <For each={players}>{(player: any) => Player(player)}</For>
    </box>
  );
};
