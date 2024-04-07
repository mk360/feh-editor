function getPreviewMapButtonElement(elem) {
    let p = elem.parentNode;
    while (p) {
        if (p.nodeName === "BUTTON") return p;
        if (p.parentNode) p = p.parentNode;
        else return null;
    }
    return null;
}

document.getElementById("set-background").onclick = function() {
    const parentContainer = document.getElementById("map-container");
    const backgroundSelector = document.createElement("div");
    backgroundSelector.id = "map-selector";
    backgroundSelector.onclick = function(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        resetMapData();
        const button = getPreviewMapButtonElement(e.target);
        const chosenMap = button.id;
        document.getElementById("map-bg").src = `./assets/maps/${chosenMap}.webp`;
        backgroundSelector.remove();
        Array.from(document.getElementsByClassName("map-tile")).forEach((tile) => {
            while (tile.firstChild) tile.removeChild(tile.firstChild);
            const recreatedSlot = document.createElement("div");
            recreatedSlot.classList.add("square", "ground");
            tile.appendChild(recreatedSlot);
        });


    };

    parentContainer.appendChild(backgroundSelector);

    for (let i = 1; i <= 90; i++) {
        const mapChoice = generateMapChoice(i);
        backgroundSelector.appendChild(mapChoice);
    }
}

function generateMapChoice(id) {
    const mapId = `Z${id.toString().padStart(4, "0")}`;
    const previewImage = document.createElement("img");
    previewImage.src = `./assets/maps/${mapId}.webp`;
    previewImage.classList.add("preview-map");
    const previewContainer = document.createElement("button");
    previewContainer.classList.add("preview-container");
    previewContainer.id = mapId;
    previewContainer.appendChild(previewImage);

    const mapIdLabel = document.createElement("div");
    mapIdLabel.innerText = id;
    previewContainer.appendChild(mapIdLabel);

    return previewContainer;
}