/**
 * @returns {string} Den HTML Code für die ShortcutInformationForm Komponente
 */
function shortcutInformation() {
    return `
        <div class="shortcutInformationOverlay" id="shortcutInformationOverlay"></div>
        <div class="form-shortcutInformation" id="shortcutInformationForm">
            <form class="form-container">
                <span class="close" onclick="closeShortcutInformation()">&times;</span>
                <h1>Alle Shortcuts</h1>

                <div class="text-center scrollable" id="shortcuts"></div>

            </form>
        </div>
    `;
}

function createHTMLTableFromShortCutsObject() {
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");

    let thShortcut = document.createElement("th");
    thShortcut.textContent = "Shortcut";
    let thAction = document.createElement("th");
    thAction.textContent = "Action";
    let thCondition = document.createElement("th");
    thCondition.textContent = "Condition";

    headerRow.appendChild(thShortcut);
    headerRow.appendChild(thAction);
    headerRow.appendChild(thCondition);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tbody = document.createElement("tbody");

    Object.entries(keyboardControl).forEach(([key, value]) => {
        let row = document.createElement("tr");

        let tdShortcut = document.createElement("td");
        tdShortcut.textContent = key;

        const [action, condition] = generateActionAndShortcut(value);

        let tdAction = document.createElement("td");
        tdAction.textContent = action;

        let tdCondition = document.createElement("td");
        tdCondition.textContent = condition;

        row.appendChild(tdShortcut);
        row.appendChild(tdAction);
        row.appendChild(tdCondition);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    const shortcuts = document.getElementById("shortcuts");
    if (shortcuts) {
        shortcuts.innerHTML = "";
        shortcuts.appendChild(table);
    }
}

function openShortcutInformation() {
    setCookieFor10Minutes("settingsOpen", true);
    document.getElementById("shortcutInformationOverlay").style.display = "block";
    document.getElementById("shortcutInformationForm").style.display = "block";

    createHTMLTableFromShortCutsObject();

    const shortcutInformationOverlay = document.getElementById("shortcutInformationOverlay");

    shortcutInformationOverlay.addEventListener("pointerdown", () => {
        closeShortcutInformation();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeShortcutInformation();
        }
    });

}

function closeShortcutInformation() {
    document.getElementById("shortcutInformationOverlay").style.display = "none";
    document.getElementById("shortcutInformationForm").style.display = "none";
    deleteCookie("settingsOpen");
}

function setUpShortcutInformation() {
    const shortcutInformationContainer = document.getElementById("shortcutInformation");
    shortcutInformationContainer.innerHTML = shortcutInformation();
}