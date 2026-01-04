fork of [knoopx's astal shell](https://github.com/knoopx/astal-shell).

### Development

```bash
# Run the main shell
nix run path:.
```

### Using with Home Manager

```nix
{ inputs, pkgs, ... }: {
  imports = [ inputs.astal-shell.homeManagerModules.default ];

services.astal-shell = {
    enable = true;

    # Optional: configure display margins
    displays = {
      "LG HDR 4K" = [390 145];
      "DP-1" = [250 80];
    };

    # Optional: configure theme
    theme = {
      background = {
        primary = "rgba(30, 30, 46, 1.0)";
        secondary = "rgba(24, 24, 37, 1.0)";
      };
      text = {
        primary = "rgba(205, 214, 244, 1.0)";
        secondary = "rgba(186, 194, 222, 0.7)";
      };
      # ... other theme options
    };

    # Optional: use a different package
    package = pkgs.astal-shell;
  };
}
```
