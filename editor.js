const tiles = Array.from({ length: 48 }).fill({
    tileType: "plain",
    defensive: false,
    trench: false
});

const teamSlots = {
    team1: [],
    team2: []
};

function getMapObject() {
    const json = {
        tileData: [],
        spawnLocations: {
            team1: teamSlots.team1,
            team2: teamSlots.team2
        }
    };

    let m = 0;

    for (let i = 0; i < 8; i++) {
        const rowData = [];
        for (let j = 0; j < 6; j++) {
            rowData.push(tiles[m]);
            m++;
        }
    }

    return json;
};
