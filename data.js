let filename = "";

const tiles = Array.from({ length: 48 }).fill({
    tileType: "ground",
    defensive: false,
    trench: false,
});

const teamSlots = {
    team1: Array.from({ length: 4 }),
    team2: Array.from({ length: 4 })
};

function getMapObject() {
    const json = {
        tileData: [],
        spawnLocations: {
            team1: teamSlots.team1.map((tile) => {
                const [x, y] = tile.split("-");
                return {
                    x: +x,
                    y: +y,
                };
            }),
            team2: teamSlots.team2.map((tile) => {
                const [x, y] = tile.split("-");
                return {
                    x: +x,
                    y: +y,
                };
            }),
        }
    };

    let m = 0;

    for (let i = 0; i < 8; i++) {
        const rowData = [];
        for (let j = 0; j < 6; j++) {
            const tileData = tiles[m];
            const tileString = [tileData.tileType, tileData.defensive && "defensive", tileData.trench && "trench"].filter((i) => i).join("-");
            rowData.push(tileString);
            m++;
        }
        json.tileData.push(rowData);
    }

    return json;
};
