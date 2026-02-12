{
  description = "Node + Express dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_20   # Node.js (puedes cambiar versión)
            pkgs.nodePackages.npm
            pkgs.mongosh
          ];

          shellHook = ''
            echo "🚀 Entorno Node + Express listo"
            echo "Node version: $(node -v)"
            echo "NPM version: $(npm -v)"
          '';
        };
      });
}
