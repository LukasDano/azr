/**
 * Gibt einen kurzen Tipp zu den customDevOptions aus
 */
function customDevOptionAdvice() {
    console.log("Es gibt die Möglichkeit, bestimmte URL täglich zu aktualisieren. Dafür müssen diese unter 'Mittag' oder 'lunch' angelegt werden");
    console.log("Dann muss man auch noch einen 'lunchURLVerificator' setzten. Da muss man je nach dem aufbau des links einen hochladen. Als Tipp kann man hier eine AI fragen");
    console.log("So setzt man den Verificator: setCookieForever('lunchURLVerificator', individueller string); ");
}

/**
 * Startet den Prozess eigene DevOptions hinzuzufügen,
 * es kann immer nur eine zurzeit hinzufügt werden.
 * Insgesamt auf 3 beschränkt, diese können aber überschrieben werden.
 * @param {string} customDevOption Die DevOption die man setzten möchte (1,2,3)
 * @param {string} url Der Link zu dem der neue Button führen soll
 * @param {string} cookieAltName Der Name der Angezeigt wird, wenn die Icons nicht richtig geladen werden
 * @param {string} iconName Der Name des Icons ohne ".png"
 */
function addDevOptionFromModal(customDevOption, url, cookieAltName, iconName) {
    setCookieForever(customDevOption, url);
    setCookieForever(customDevOption + "AltName", cookieAltName);

    const iconFileName = iconName + ".png"
    const iconFilePath = "pictures/icons/" + iconFileName;
    setCookieForever(customDevOption + "Icon", iconFilePath);
}

/**
 * @return {string[]} Eine Liste aller existierenden Icon-File-Namen
 */
async function listAllIcons() {
    const jsonPath = 'database/icons/icons.json';
    let icons = {};

    try {
        const response = await fetch(jsonPath);
        if (!response.ok)  throw new Error(`HTTP error! status: ${response.status}`);
        icons = await response.json();

    } catch (error) {
        console.error('Failed to fetch icon list:', error);
    }

    return icons;
}

/**
 * @return {string[]} Die Namen zu allen existierenden CustomDevOptionsButtons als Liste
 */
function listAllCustomDevOptionButtons() {
    const devOptions = document.querySelectorAll('.devOption');
    const classNames = [];

    devOptions.forEach(devOption => {
        const customDevOption = devOption.querySelector('.customDevOption');
        if (customDevOption) {
            const className = customDevOption.className.replace(/\s+/g, '');
            classNames.push(className);
        }
    });

    return classNames;
}

/**
 * Lädt alle Funktionalitäten und Daten zu den DevOptions
 */
function setUpDevOptions() {
    refreshDevOptionCookies();
    const options = getAllDevOptions();

    const settingsContainer = document.getElementById("devOptionSettings");
    settingsContainer.innerHTML = devOptionSettings();

    options.forEach(option => {
        const { cookiePrefix, id } = option;
        const targetUrl = getCookie(cookiePrefix);
        const devOptionIcon = getCookie(`${cookiePrefix}Icon`);
        const devOptionAltName = getCookie(`${cookiePrefix}AltName`);

        if (typeof devOptionAltName !== "undefined") {
            const devOptionContainer = document.querySelector(`.customDevOption.${id}`);

            if (devOptionContainer) {
                devOptionContainer.innerHTML = customDevOption(targetUrl, devOptionIcon, devOptionAltName);
            } else {
                console.warn(`Container for customDevOption ${id} not found`);
            }
        }
    });
}

/**
 * Guckt welche Cookies für die DevOptions existieren und setzt diese dann neu.
 */
function refreshDevOptionCookies() {
    getAllDevOptions().forEach(option => {
        const targetUrl = getCookie(`${option.cookiePrefix}`);
        const devOptionIcon = getCookie(`${option.cookiePrefix}Icon`);
        const devOptionAltName = getCookie(`${option.cookiePrefix}AltName`);

        if (targetUrl) setCookieForever(option.cookiePrefix, targetUrl);
        if (devOptionIcon) setCookieForever(option.cookiePrefix + "Icon", devOptionIcon);
        if (devOptionAltName) setCookieForever(option.cookiePrefix + "AltName", devOptionAltName);
        if (devOptionAltName === ("Mittag" || "Lunch")) updateLink(targetUrl, option.cookiePrefix);
    });
}

/**
 * @param {string} inputString Der zu prüfende String
 * @return {boolean}
 */
function isValidSpeiseplanURL(inputString) {
    const lunchURLVerificator = getCookie("lunchURLVerificator");
    setCookieForever("lunchURLVerificator", lunchURLVerificator);

    const lunchURLExpression = RegExp(lunchURLVerificator);

    return lunchURLExpression.test(inputString);
}

/**
 * Updated den Speiseplanlink auf die aktuelle Woche
 * @param {string} cookieURL Die in den Cookies gespeicherte URL
 * @param {string} devOptionsButtonName den Namen, unter dem der Cookie gespeichert wurde
 */
function updateLink(cookieURL, devOptionsButtonName) {
    if (isValidSpeiseplanURL(cookieURL));

    const speisePlanURL = cookieURL.substring(0, cookieURL.lastIndexOf('-') + 1);
    const currentSpeisePlanURL = speisePlanURL + getCurrentKW() + ".pdf";
    setCookieForever(devOptionsButtonName, currentSpeisePlanURL);
}

/**
 * @return {{id: string, cookiePrefix: string}[]} Alle CustomDevOptions Namen
 */
function getAllDevOptions() {
    return [
        { id: 'One', cookiePrefix: 'customDevOptionOne' },
        { id: 'Two', cookiePrefix: 'customDevOptionTwo' },
        { id: 'Three', cookiePrefix: 'customDevOptionThree' }
    ];
}

/**
 * Gibt den HTML-Code für eine DevOption als String zurück
 * @param {string} targetUrl Die Ziel führende URL
 * @param {string} devOptionIcon Der Pfad zu dem Icon, welches gesetzt werden soll
 * @param {string} devOptionAltName Der Alternativename, der angezeigt werden soll, wenn das Icon nicht geladen werden kann
 * @return {string} Den HTML Code Abschnitt für die neue DevOption
 */
function customDevOption(targetUrl, devOptionIcon, devOptionAltName) {
    const defaultIcon = "pictures/icons/close.png";

    return `
        <div class="devOption">
            <li class="nav-item">
                <a class="nav-link" href="${targetUrl}" target="_blank" title="${devOptionAltName}">
                    <img class="icon" src="${devOptionIcon || defaultIcon}" alt="${devOptionAltName}">
                </a>
            </li>
        </div>
    `;
}

/**
 * Gibt den HTML-Code für das DevOptionSettingsModal zurück
 * @return {string} Den HTML Code Abschnitt für das Settings Modal
 */
function devOptionSettings() {
    return `
        <div class="devOptionsOverlay" id="devOptionsOverlay"></div>
        <div class="form-popup" id="devOptionsForm">
            <form class="form-container">
                <span class="close" onclick="closeDevOptionsForm()">&times;</span>
                <h1>DevOption Setting</h1>

                <label for="devOptionButtonDropDown">DevOptionButton:</label>
                <select id="devOptionButtonDropDown" onChange="updateValues()"></select>

                <label for="name">Name:</label>
                <input type="text" id="name" name="name" placeholder="Namen vergeben" required>

                <label for="iconDropDown">Icon:</label>
                <select id="iconDropDown"></select>

                <label for="url">URL:</label>
                <input type="text" id="url" name="url" placeholder="URL eingeben" required>

                <div class="btn-container">
                    <button class="btn" id="weekTimeSave" onclick="saveCustomButton()">Save</button>
                    <button class="btn" id="weekTimeDelete" onclick="deleteCustomButton()">Delete</button>
                </div>
            </form>
        </div>
    `;
}

async function openDevOptionsForm() {
    setCookieFor10Minutes("settingsOpen", true);
    document.getElementById("devOptionsForm").style.display = "block";
    document.getElementById("devOptionsOverlay").style.display = "block";

    const weekTimeSave = document.getElementById("weekTimeSave");
    const weekTimeDelete = document.getElementById("weekTimeDelete");

    makeReactButton(weekTimeSave, colorVariants.success);
    makeReactButton(weekTimeDelete, colorVariants.danger);

    const iconDropDownId = "iconDropDown";
    const allIconsList = await listAllIcons();
    populateDropdown(iconDropDownId, allIconsList);

    const devOptionDropDownId = "devOptionButtonDropDown";
    const allDevOptionButtons = listAllCustomDevOptionButtons();
    populateDropdown(devOptionDropDownId, allDevOptionButtons);

    const nameElementId = "name";
    const namePlaceHolderText = getCookie("customDevOptionOneAltName");
    setHTMLTextValueForElement(nameElementId, namePlaceHolderText);

    const urlElementId = "url";
    const ulrPlaceHolderText = getCookie("customDevOptionOne");
    setHTMLTextValueForElement(urlElementId, ulrPlaceHolderText);

    updateValues();

    document.addEventListener('keydown', (event) => {
        // Beenden
        if (event.key === 'Escape') {
            event.preventDefault();
            closeDevOptionsForm();
        }

        // Eingabe
        if (event.key === 'Enter') {
            saveCustomButton();
        }

        // Löschen
        if (event.key === 'Delete') {
            deleteCustomButton();
        }
    });

    document.getElementById("devOptionsOverlay").addEventListener("pointerdown", () => {
        closeDevOptionsForm();
    });
}

function closeDevOptionsForm() {
    document.getElementById("devOptionsForm").style.display = "none";
    document.getElementById("devOptionsOverlay").style.display = "none";
    deleteCookie("settingsOpen");
}

/**
 * Speichet den CutsomButton
 * und lädt die Seite neu
 */
function saveCustomButton() {
    const customButtonName = document.getElementById("devOptionButtonDropDown").value;
    const name = document.getElementById("name").value;
    const icon = document.getElementById("iconDropDown").value;
    const url = document.getElementById("url").value;

    addDevOptionFromModal(customButtonName, url, name, icon);

    removeCustomButtonParameters();
    window.location.href = "";
}

/**
 * Löscht einen CutsomButton
 */
function deleteCustomButton() {
    const selectedCustomDevOptionsButton = document.getElementById("devOptionButtonDropDown").value;
    deleteForeverCookie(selectedCustomDevOptionsButton);
    deleteForeverCookie(selectedCustomDevOptionsButton + "Icon");
    deleteForeverCookie(selectedCustomDevOptionsButton + "AltName");

    closeDevOptionsForm();
    document.getElementById(selectedCustomDevOptionsButton).style.display = "none";
}

/**
 * Schreibt Daten aus einem Objekt oder einer Liste in ein DropDownMenu mit der angegebenen ID
 * @param {string} dropDownId Die ID des DropDownMenu HTML-Elements
 * @param {[] | {}} optionsList Die Liste/das Objekt mit den Daten
 */
function populateDropdown(dropDownId, optionsList) {
    const dropdown = document.getElementById(dropDownId);
    
    dropdown.innerHTML = '';
    
    if (Array.isArray(optionsList)) {
        optionsList.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
    
            dropdown.appendChild(opt);
        });
    } else if (typeof optionsList === "object") {
        Object.entries(optionsList).forEach(option => {
            if (optionsList.hasOwnProperty(option[0])) {
                const optionName = option[0];
                const opt = document.createElement('option');
                opt.value = optionName;
                opt.textContent = optionName;
                dropdown.appendChild(opt);
            }
        });
}

/**
 * Updateted die Anzegeigten Werte im SettingsModal, wenn der Button, der bearbeitet wird sich ändert
 * @returns {Promise<void>}
 */
async function updateValues() {
    const dropdown = document.getElementById("devOptionButtonDropDown");
    const nameInput = document.getElementById("name");
    const urlInput = document.getElementById("url");
    const iconDropDown = document.getElementById("iconDropDown");

    const selectedValue = dropdown.value;
    const defaultNameText = "";
    const defaultURLText = "";
    const defaultIconText = Object.keys(await listAllIcons())[0];

    switch (selectedValue) {
        case "customDevOptionOne":
            nameInput.value = getCookie("customDevOptionOneAltName") || defaultNameText;
            urlInput.value = getCookie("customDevOptionOne") || defaultURLText;
            iconDropDown.value = getJSONIconNameCookie("customDevOptionOneIcon") || defaultIconText;
            break;
        case "customDevOptionTwo":
            nameInput.value = getCookie("customDevOptionTwoAltName") || defaultNameText;
            urlInput.value = getCookie("customDevOptionTwo") || defaultURLText;
            iconDropDown.value = getJSONIconNameCookie("customDevOptionTwoIcon") || defaultIconText;
            break;
        case "customDevOptionThree":
            nameInput.value = getCookie("customDevOptionThreeAltName") || defaultNameText;
            urlInput.value = getCookie("customDevOptionThree") || defaultURLText;
            iconDropDown.value = getJSONIconNameCookie("customDevOptionThreeIcon") || defaultIconText;
            break;
    }
}
