const mapBackground = document.getElementById("map-container");
const defensiveCheckbox = document.getElementById("defensive");
const trenchCheckbox = document.getElementById("trench");
const tileTypeSelectors = document.querySelectorAll("input[name='tile-type']");
const sideSelector = document.getElementById("team");
const teamSlotSelectors = document.querySelectorAll("input[name='team-slot']");
// const saveTileButton = document.getElementById("save");
const exportMapButton = document.getElementById("export");

function getTileIndex(x, y) {
    return (y - 1) * 6 + x;
}

for (let y = 1; y <= 8; y++) {
    for (let x = 1; x <= 6; x++) {
        const btn = document.createElement("button");
        btn.id = `${x}-${y}`;
        btn.classList.add("map-tile");
        mapBackground.appendChild(btn);
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

mapBackground.oncontextmenu = function(e) {
    console.log(e);
    e.preventDefault();
}

mapBackground.onclick = function(e) {
    const btn = e.target;
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
        const [slot, team] = teamSlot.split("-");
        teamSlots[team][+slot] = {
            x,
            y
        };
    }
    tiles[tileIndex] = saveData;

    displayTileSettings({
        defensive: defensiveCheckbox.checked,
        trench: trenchCheckbox.checked,
        tileType: selectedTileType,
        id: btn.id
    });
};

function displayTileSettings({ defensive, trench, tileType, id }) {
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

// exportMapButton.onclick = function() {
//     const obj = getMapObject();
//     const objString = JSON.stringify(obj, null, 2);
//     const dataString = `data:text/json;charset=utf-8,${encodeURIComponent(objString)}`;
//     const anchor = document.createElement("a");
//     anchor.download = filename;
//     anchor.href = dataString;
//     document.body.appendChild(anchor);
//     anchor.click();
//     anchor.remove();
// }
