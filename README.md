## FEH Map Editor
A map editor that integrates [into the game engine](https://github.com/mk360/feh-battles).

### How to use

- Load a map file, ideally a 540x720 image ripped from the game's assets.
- Click on each tile, set its properties. If applicable, you can set it as a starting point for either of the two teams.
- Tiles should be manually saved.

The app will generate an appropriately-formatted JSON file, that you can integrate in the repository's maps data.

### Wall / Void

The void tile type applies to all tiles that only fliers can cross: lava, oceans, mountains. The wall type applies to all tiles that no one can cross.
