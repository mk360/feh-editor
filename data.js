const tiles = Array.from({ length: 48 }).fill({
    tileType: "ground",
    defensive: false,
    trench: false,
});

const teamSlots = {
    team1: Array.from({ length: 4 }),
    team2: Array.from({ length: 4 })
};

function resetMapData() {
    for (let i = 0; i < tiles.length; i++) {
        tiles[i] = {
            tileType: "ground",
            defensive: false,
            trench: false
        };
    }
    
    teamSlots.team1 = Array.from({ length: 4 });
    teamSlots.team2 = Array.from({ length: 4 });
}

function getMapObject() {
    const json = {
        tileData: [],
        spawnLocations: {
            team1: teamSlots.team1.filter((t) => t),
            team2: teamSlots.team2.filter((t) => t)
        }
    };

    let tileIndex = 0;

    for (let i = 0; i < 8; i++) {
        const rowData = [];
        for (let j = 0; j < 6; j++) {
            const tileData = tiles[tileIndex];
            const tileString = [tileData.tileType, tileData.defensive && "defensive", tileData.trench && "trench"].filter((i) => i).join("-");
            rowData.push(tileString);
            tileIndex++;
        }
        json.tileData.push(rowData);
    }

    return json;
};
