const mapBackground = document.getElementById("map-bg");
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
    tileTypeSelector.value = tile.tileType;

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

tileTypeSelector.onchange = function(e) {
    const { value } = this;
    if (value !== "Ground") {
        trenchCheckbox.disabled = true;
        trenchCheckbox.checked = false;

        if (["Wall", "Void"].includes(value)) {
            defensiveCheckbox.disabled = true;
            defensiveCheckbox.checked = false;        
        }
    } else {
        trenchCheckbox.disabled = false;
        defensiveCheckbox.disabled = false;
    }
};
