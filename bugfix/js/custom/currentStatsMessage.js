/** @import {Time} from ./../../ts/types.ts */

/**
 * @return {string} Den HTML Code Abschnitt für das Message Modal
 */
function currentStatsMessage() {
    return `
        <div class="currentStatsMessageOverlay" id="currentStatsMessageOverlay"></div>
        <div class="form-popup" id="currentStatsMessageForm">
            <form class="form-container">
                <span class="close" onclick="closeCurrentStatsMessage()">&times;</span>
                <h1>Aktuelle Übersicht der Arbeitszeit</h1>

                <div class="text-center" id="currentTimeStatsResult">
                    <div class="row container row-adaption">
                        <div class="col text-center">
                            <label for="currentWorkTime">Aktuelle Arbeitszeit</label>
                            <p class="display-5" id="currentWorkTime">0.00</p>
                        </div>

                        <div class="col text-center">
                            <label for="currentFloatTime">Aktuelle Gleitzeit</label>
                            <p class="display-5" id="currentFloatTime">0.00</p>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    `;
}

/**
 * @param {number} diffMins Die Differenz in Minuten zwischen Start und aktueller Zeit
 * @returns {boolean}
 */
function canStatsBeOpend(diffMins) {
    if (!isNaN(diffMins)) return true;

    sendWarningNotification("Noch keine Zeiten eingetragen");
    return false;
}

function openCurrentStatsMessageWithValues() {
    const currentTime = getCurrentTime();
    const currentStart = getTimeFromFieldById("start");
    let currentPause = getTimeFromFieldById("pause");
    const [diffHours, diffMins] = calculateStartEndeTimeDiff(currentStart, currentTime);

    if (!canStatsBeOpend(diffMins)) return;
    if (diffHours < 6) currentPause = [0, 0];

    setCookieFor10Minutes("settingsOpen", true);
    document.getElementById("currentStatsMessageOverlay").style.display = "block";
    document.getElementById("currentStatsMessageForm").style.display = "block";
    document.getElementById("currentTimeStatsResult").style.display = "block";

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            closeCurrentStatsMessage();
        }
    });

    const currentIst = calculateIstTime(currentStart, currentTime, currentPause);
    const currentFloat = calculateGleitzeit(currentIst);

    document.getElementById("currentWorkTime").textContent = formatTime(currentIst);
    document.getElementById("currentFloatTime").textContent = createGleitzeitAusgabeFromFloat(currentFloat);

    document.getElementById("currentStatsMessageOverlay").addEventListener("pointerdown", () => {
        closeCurrentStatsMessage();
    });
}

function closeCurrentStatsMessage() {
    document.getElementById("currentStatsMessageOverlay").style.display = "none";
    document.getElementById("currentStatsMessageForm").style.display = "none";
    document.getElementById("currentTimeStatsResult").style.display = "none";
    deleteCookie("settingsOpen");
}

function setUpCurrentStatsMessage() {
    const settingsContainer = document.getElementById("currentStatsMessage");
    settingsContainer.innerHTML = currentStatsMessage();
}
