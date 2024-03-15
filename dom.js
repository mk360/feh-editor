const mapBackground = document.getElementById("map-bg");
const defensiveCheckbox = document.getElementById("defensive");
const trenchCheckbox = document.getElementById("trench");
const tileTypeSelector = document.getElementById("tile-type");

mapBackground.onclick = function(e) {
    mapBackground.getElementsByClassName("highlighted")[0]?.classList.remove("highlighted");
    const btn = e.target;
    btn.classList.add("highlighted");
    const tile = tiles[btn.id];
    console.log(tile);
};

for (let i = 0; i < 48; i++) {
    const btn = document.createElement("button");
    btn.id = i;
    btn.classList.add("map-tile");
    mapBackground.appendChild(btn);
}

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

