// map.js — Zentrale Steuerung deiner Map

// Globale Variablen
let map, fogTiles = [];
const w = 2048;
const h = 1536;
const rows = 24;
const cols = 32;
const tileW = w / cols;
const tileH = h / rows;

// Map initialisieren
function initMap() {
    map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 4,
        zoomControl: true,
    });

    const bounds = [[0, 0], [h, w]];
    L.imageOverlay('Getupia.jpg', bounds).addTo(map);
    map.fitBounds(bounds);

    // Nebelgitter erzeugen
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const rect = L.rectangle([
                [row * tileH, col * tileW],
                [(row + 1) * tileH, (col + 1) * tileW]
            ], {
                color: "#333",
                weight: 0,
                fillOpacity: 0.75,
                className: 'fog'
            }).addTo(map);

            fogTiles.push({ row, col, rect });
        }
    }

    // Nach Aufbau gespeicherte Felder laden
    applyMapState();
}

// Visuell ein Tile freigeben (ohne speichern)
function revealTile(row, col) {
    const tile = fogTiles.find(t => t.row === row && t.col === col);
    if (tile) {
        map.removeLayer(tile.rect);
    }
}

// Speicherfunktionen
function getMapState() {
    return JSON.parse(localStorage.getItem("mapState") || '{"revealedTiles": []}');
}

function setMapState(state) {
    localStorage.setItem("mapState", JSON.stringify(state));
}

function revealTileSave(row, col) {
    const key = `${row}-${col}`;
    const state = getMapState();
    if (!state.revealedTiles.includes(key)) {
        state.revealedTiles.push(key);
        setMapState(state);
    }
    revealTile(row, col);
}

function applyMapState() {
    const state = getMapState();
    state.revealedTiles.forEach(tileKey => {
        const [row, col] = tileKey.split("-").map(Number);
        revealTile(row, col);
    });
}

function resetMap() {
    if (confirm("Wirklich zurücksetzen?")) {
        localStorage.removeItem("mapState");
        location.reload();
    }
}

function saveExport() {
    const state = getMapState();
    const saveData = JSON.stringify(state);
    prompt("Speicherstand (kopieren):", saveData);
}

function saveImport() {
    const saveData = prompt("Speicherstand einfügen:");
    if (saveData) {
        try {
            const state = JSON.parse(saveData);
            setMapState(state);
            location.reload();
        } catch (e) {
            alert("Ungültiges Savegame.");
        }
    }
}

// Dev-Zonen
function Startbereich() {
    for (let h = 5; h <= 14; h++) {
        for (let b = 21; b <= 27; b++) {
            revealTileSave(h, b);
        }
    }
}

function Ruins() {
    for (let h = 12; h <= 16; h++) {
        for (let b = 15; b <= 20; b++) {
            revealTileSave(h, b);
        }
    }
}

function BrightWoods() {
    for (let h = 11; h <= 15; h++) {
        for (let b = 6; b <= 14; b++) {
            revealTileSave(h, b);
        }
    }
}

// Dev-Toolbar direkt beim Laden erzeugen
function createDevToolbar() {
    const toolbar = document.createElement("div");
    toolbar.id = "dev-toolbar";
    toolbar.style = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 10px;
        border-radius: 8px;
        z-index: 9999;
        font-family: sans-serif;
        font-size: 14px;
    `;
    toolbar.innerHTML = `
        <div><b>Dev-Tools</b></div>
        <button onclick="resetMap()">Reset</button>
        <button onclick="Startbereich()">Start</button>
        <button onclick="Ruins()">Ruinen</button>
        <button onclick="BrightWoods()">Wald</button>
        <button onclick="saveExport()">Export</button>
        <button onclick="saveImport()">Import</button>
    `;
    document.body.appendChild(toolbar);
}

// Initialisierung beim Laden
window.addEventListener("load", () => {
    initMap();
    createDevToolbar();
});
