const mapGrid = document.getElementById("map-grid");
const defensiveCheckbox = document.getElementById("defensive");
const trenchCheckbox = document.getElementById("trench");
const tileTypeSelectors = document.querySelectorAll("input[name='tile-type']");
const sideSelector = document.getElementById("team");
const teamSlotSelectors = document.querySelectorAll("input[name='team-slot']");
// const saveTileButton = document.getElementById("save");
const saveButton = document.getElementById("save-button");

function getTileIndex(x, y) {
    return (y - 1) * 6 + x;
}

for (let y = 1; y <= 8; y++) {
    for (let x = 1; x <= 6; x++) {
        const btn = document.createElement("button");
        btn.id = `${x}-${y}`;
        btn.classList.add("map-tile");
        mapGrid.appendChild(btn);
        displayTileSettings({
            defensive: false,
            trench: false,
            tileType: "ground",
            id: btn.id
        });
    }
}

let latestSlotValue = "";

teamSlotSelectors.forEach((element) => {
    element.onclick = (e) => {
        if (element.checked && element.id === latestSlotValue) {
            element.checked = false;
            latestSlotValue = "";
        } else {
            latestSlotValue = element.id;
        }
    }
});

function controlSpecialTiles(tileType) {
    trenchCheckbox.disabled = tileType !== "ground";
    trenchCheckbox.checked = tileType !== "ground" ? false : trenchCheckbox.checked;
    defensiveCheckbox.disabled = !["ground", "forest"].includes(tileType);
    defensiveCheckbox.checked = defensiveCheckbox.disabled ? false : defensiveCheckbox.checked;
    if (trenchCheckbox.disabled) {
        Array.from(document.getElementsByClassName("trench-image")).forEach((el) => {
            el.classList.remove("display");
        });
    }

    if (defensiveCheckbox.disabled) {
        Array.from(document.getElementsByClassName("defensive-image")).forEach((el) => {
            el.classList.remove("display");
        });
    }
}

document.getElementById("bonjour").onclick = function(e) {
    if (e.target.nodeName === "INPUT") {
        controlSpecialTiles(e.target.id);
    } 
};

trenchCheckbox.onchange = function(e) {
    const previewTrenchTileTypes = document.getElementsByClassName("trench-image");
    const { checked } = e.target;
    if (checked) {
        for (let i = 0; i < previewTrenchTileTypes.length; i++) {
            const element = previewTrenchTileTypes[i];
            element.classList.add("display");
        }
    } else {
        for (let i = 0; i < previewTrenchTileTypes.length; i++) {
            const element = previewTrenchTileTypes[i];
            element.classList.remove("display");
        }
    }
}

defensiveCheckbox.onchange = function(e) {
    const previewDefensiveTileTypes = document.getElementsByClassName("defensive-image");
    const { checked } = e.target;
    if (checked) {
        for (let i = 0; i < previewDefensiveTileTypes.length; i++) {
            const element = previewDefensiveTileTypes[i];
            element.classList.add("display");
        }
    } else {
        for (let i = 0; i < previewDefensiveTileTypes.length; i++) {
            const element = previewDefensiveTileTypes[i];
            element.classList.remove("display");
        }
    }
}

mapGrid.oncontextmenu = function(e) {
    e.preventDefault();
}

function getParentButton(element) {
    let node = element;
    while (element.parentNode) {
        node = node.parentNode;
        if (!node) return null;
        if (node.nodeName === "BUTTON") return node;
    }
    return null;
}

function clearCell(mouseEvent) {
    const btn = getParentButton(mouseEvent.target);
    if (btn) {
        const [x, y] = btn.id.split("-").map(Number);
        const tileIndex = getTileIndex(x, y);
        tiles[tileIndex] = {
            tileType: "ground",
            defensive: false,
            trench: false,
        };

        displayTileSettings({
            id: btn.id,
            defensive: false,
            trench: false,
            tileType: "ground"
        });
    }
}

function paintCell(mouseEvent) {
    const btn = getParentButton(mouseEvent.target);
    if (btn) {
        const [x, y] = btn.id.split("-").map(Number);
        const tileIndex = getTileIndex(x, y) - 1;
        const tile = tiles[tileIndex];
        const selectedTileType = document.querySelector("input[name='tile-type']:checked").id;
        const teamSlotElement = document.querySelector("input[name='team-slot']:checked");
        const saveData = {
            tileType: selectedTileType,
            defensive: defensiveCheckbox.checked,
            trench: trenchCheckbox.checked,
        };
        if (teamSlotElement) {
            let teamSlot = teamSlotElement.id;
            const [, team, slot] = teamSlot.split("-");
            if (teamSlots[`team${team}`][+slot - 1]) {
                const { x, y } = teamSlots[`team${team}`][+slot - 1];
                const existingSlotTile = document.getElementById(`${x}-${y}`);
                existingSlotTile.getElementsByClassName("summoner-slot")[0].remove();
                existingSlotTile.getElementsByClassName("grid-summoner")[0].remove();
            }
            teamSlots[`team${team}`][+slot - 1] = {
                x,
                y
            };
        }
        tiles[tileIndex] = saveData;

        displayTileSettings({
            defensive: defensiveCheckbox.checked,
            trench: trenchCheckbox.checked,
            tileType: selectedTileType,
            id: btn.id,
            teamSlot: teamSlotElement?.id
        });
    }
}

mapGrid.onclick = paintCell;

mapGrid.onmousedown = function(e) {
    if (e.buttons === 1) {
        paintCell(e);
    } else if (e.buttons === 2) {
        clearCell(e);
    }
};

mapGrid.onmouseover = function(e) {
    if (e.buttons === 1) {
        paintCell(e);
    } else if (e.buttons === 2) {
        clearCell(e);
    }
};

function displayTileSettings({ defensive, trench, tileType, id, teamSlot }) {
    const button = document.getElementById(id);
    while (button.children.length) {
        button.removeChild(button.firstChild);
    }

    const div = document.createElement("div");
    div.classList.add("square", tileType);
    if (defensive) {
        const defensiveImage = document.createElement("img");
        defensiveImage.classList.add("defensive-image", "display-cell");
        defensiveImage.src = "./assets/defensive.png";
        div.appendChild(defensiveImage);
    }

    if (trench) {
        const trenchImage = document.createElement("img");
        trenchImage.classList.add("trench-image", "display-cell");
        trenchImage.src = "./assets/trench.png";
        div.appendChild(trenchImage);
    }

    if (teamSlot) {
        const [, team, slot] = teamSlot.split("-");
        const imgUrl = team === "1" ? './assets/blue-summoner.png' : './assets/red-summoner.png';
        const summonerImg = document.createElement("img");
        summonerImg.src = imgUrl;
        summonerImg.classList.add("grid-summoner");
        const summonerSlot = document.createElement("div");
        summonerSlot.innerText = slot;
        summonerSlot.classList.add("summoner-slot");
        div.appendChild(summonerImg);
        div.appendChild(summonerSlot);
    }

    button.appendChild(div);
}

// document.getElementById("prompt-input").onchange = function(e) {
//     const { target: { files } } = e;
//     const reader = new FileReader();
    // reader.onload = function() {
    //     document.getElementById("map-bg").src = reader.result;
    //     document.getElementById("map-bg").alt = files[0].name;
    //     document.body.removeChild(document.getElementById("load-map"));
    //     filename = files[0].name.replace("webp", "json");
    // };

    // reader.readAsDataURL(files[0]);
// };

saveButton.onclick = function() {
    const saveData = getMapObject();
    const objString = JSON.stringify(saveData, null, 2);
    const dataString = `data:text/json;charset=utf-8,${encodeURIComponent(objString)}`;
    const anchor = document.createElement("a");
    anchor.download = filename;
    anchor.href = dataString;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
}
