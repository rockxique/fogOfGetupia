// saveManager.js

// Holt den aktuellen Spielstand (du kannst hier deine eigenen Objekte verwenden)
function getCurrentSaveData() {
    return {
        character: JSON.parse(localStorage.getItem("characterData") || "{}"),
        activities: JSON.parse(localStorage.getItem("getupia_activities") || "[]"),
        mapState: JSON.parse(localStorage.getItem("mapState") || "{}"),
    };
}

// Lädt einen Savegame-Datensatz in den LocalStorage
function loadSaveData(saveData) {
    localStorage.setItem("characterData", JSON.stringify(saveData.character));
    localStorage.setItem("getupia_activities", JSON.stringify(saveData.activities));
    localStorage.setItem("mapState", JSON.stringify(saveData.mapState));
    alert("Savegame erfolgreich geladen!");
}

// Export-Funktion
function exportSaveData() {
    const data = getCurrentSaveData();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "getupia_savegame.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// Import-Funktion
function importSaveData(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const saveData = JSON.parse(event.target.result);
            loadSaveData(saveData);
            location.reload();  // Optional: Seite neu laden, um neuen Stand sofort zu laden
        } catch (err) {
            alert("Fehler beim Laden des Savegames.");
            console.error(err);
        }
    };
    reader.readAsText(file);
}
