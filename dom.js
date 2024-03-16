const mapBackground = document.getElementById("map");
const defensiveCheckbox = document.getElementById("defensive");
const trenchCheckbox = document.getElementById("trench");
const tileTypeSelector = document.getElementById("tile-type");
const sideSelector = document.getElementById("team");
const teamSlotSelector = document.getElementById("slot");
const saveTileButton = document.getElementById("save");
const exportMapButton = document.getElementById("export");

for (let i = 1; i < 49; i++) {
    const btn = document.createElement("button");
    btn.id = i;
    btn.classList.add("map-tile");
    mapBackground.appendChild(btn);
}

mapBackground.onclick = function(e) {
    mapBackground.getElementsByClassName("highlighted")[0]?.classList.remove("highlighted");
    const btn = e.target;
    btn.classList.add("highlighted");
    const tile = tiles[+btn.id - 1];
    defensiveCheckbox.checked = tile.defensive;
    trenchCheckbox.checked = tile.trench;
    tileTypeSelector.value = tile.tileType;

    controlSpecialTiles(tile.tileType);

    if (teamSlots.team1.includes(+btn.id)) {
        sideSelector.value = 1;
        teamSlotSelector.value = teamSlots.team1.indexOf(+btn.id) + 1;
    } else if (teamSlots.team2.includes(+btn.id)) {
        sideSelector.value = 2;
        teamSlotSelector.value = teamSlots.team2.indexOf(+btn.id) + 1;
    } else {
        sideSelector.value = "";
        teamSlotSelector.value = "";
    }
};

saveTileButton.onclick = function() {
    const highlightedTile = mapBackground.getElementsByClassName("highlighted")[0];
    if (highlightedTile) {
        const defensive = defensiveCheckbox.checked;
        const trench = trenchCheckbox.checked;
        const tileType = tileTypeSelector.value;
        const team = sideSelector.value;
        const slot = +teamSlotSelector.value;
        const tileString = tileType.toLowerCase();
        const tilePayload = {
            tileType: tileString,
            defensive,
            trench,
        };

        if (team && slot) {
            teamSlots[`team${team}`][slot - 1] = +highlightedTile.id;
        }

        tiles[+highlightedTile.id - 1] = tilePayload;
    } else {
        alert("Please select a tile to edit");
    }
};

function controlSpecialTiles(tileValue) {
    if (tileValue !== "ground") {
        trenchCheckbox.disabled = true;
        trenchCheckbox.checked = false;

        if (["wall", "void"].includes(tileValue)) {
            defensiveCheckbox.disabled = true;
            defensiveCheckbox.checked = false;        
        }
    } else {
        trenchCheckbox.disabled = false;
        defensiveCheckbox.disabled = false;
    }
}

tileTypeSelector.onchange = function(e) {
    const { value } = this;
    controlSpecialTiles(value);
};

document.getElementById("prompt-input").onchange = function(e) {
    const { target: { files } } = e;
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById("map-bg").src = reader.result;
        document.getElementById("map-bg").alt = files[0].name;
        document.getElementById("map").classList.add("loaded");
        document.body.removeChild(document.getElementById("load-map"));
        filename = files[0].name.replace("webp", "json");
    };

    reader.readAsDataURL(files[0]);
};

exportMapButton.onclick = function() {
    const obj = getMapObject();
    const objString = JSON.stringify(obj, null, 2);
    const dataString = `data:text/json;charset=utf-8,${encodeURIComponent(objString)}`;
    const anchor = document.createElement("a");
    anchor.download = filename;
    anchor.href = dataString;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
}
