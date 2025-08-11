/**
 * Gibt den HTML-Code für das WochenZeit Modal zurück
 *
 * @return {string} Den HTML Code Abschnitt für das Modal
 */
function weekTimeCalculator() {

    return `
        <div class="weekTimeOverlay" id="weekTimeOverlay"></div>
        <div class="form-weekTime" id="weekTimeForm">
            <form class="form-container">
                <span class="close" onclick="closeWeekTimeCalculator()">&times;</span>
                <h1>Wochenzeitrechner</h1>

                <div class="row justify-content-center">
                    <div class="col-auto">
                        <label for="monday">Montag:</label>
                        <input type="time" id="monday" name="monday" required>
                    </div>
                    
                    <div class="col-auto">
                        <label for="tuesday">Dienstag:</label>
                        <input type="time" id="tuesday" name="tuesday" required>
                    </div>
                    
                    <div class="col-auto">
                        <label for="wednesday">Mittwoch:</label>
                        <input type="time" id="wednesday" name="wednesday" required>
                    </div>
                </div>
                    
                <div class="row justify-content-center">
                    <div class="col-auto">
                        <label for="thursday">Donnerstag:</label>
                        <input type="time" id="thursday" name="thursday" required>
                    </div>
                    
                    <div class="col-auto">
                        <label for="friday">Freitag:</label>
                        <input type="time" id="friday" name="friday" required>
                    </div>
                </div>
                    

                <label id="floatDaysLabel" for="floatDays">Anazahl Gleitage:</label>
                <input type="number" id="floatDays" name="floatDays" max="7" required>

                <div class="text-center" id="weekTimeResult">
                    <div class="row container row-adaption">
                        <div class="col text-center">
                            <label for="weekWorkTime">Wochenarbeitszeit</label>
                            <p class="display-5" id="weekWorkTime"></p>
                        </div>

                        <div class="col text-center">
                            <label for="weekOverTime">Wochengleitzeit</label>
                            <p class="display-5" id="weekOverTime"></p>
                        </div>
                    </div>
                </div>

                <div class="btn-container">
                    <button type="button" class="btn" id="calculateWeekTimeButton" onclick="calculateWeekTime()">Berechnen</button>
                </div>
            </form>
        </div>
    `;
}

/**
 * Öffnet das WochenZeit Modal
 */
function openWeekTimeCalculator() {
    setCookieFor10Minutes("settingsOpen", true);
    document.getElementById("weekTimeForm").style.display = "block";
    document.getElementById("weekTimeOverlay").style.display = "block";
    document.getElementById("weekTimeResult").style.display = "none";
    document.getElementById("floatDaysLabel").style.display = "none";
    document.getElementById("floatDays").style.display = "none";

    const calculateWeekTimeButton = document.getElementById("calculateWeekTimeButton");
    makeReactButton(calculateWeekTimeButton, "primary");

    dayFields.forEach(field => setInitialWeekTimeValue(field));
    dayFields.forEach(field => getDayFieldValue(field));

    document.addEventListener('keydown', (event) => {
        // Eingabe
        if (event.key === 'Enter') {
            calculateWeekTime();
        }

        // Schließen
        if (event.key === 'Escape') {
            event.preventDefault();
            closeWeekTimeCalculator();
        }
    });

    document.getElementById("weekTimeOverlay").addEventListener("pointerdown", () => {
        closeWeekTimeCalculator();
    });

}

/**
 * Schließt das WochenZeit Modal
 */
function closeWeekTimeCalculator() {
    document.getElementById("weekTimeForm").style.display = "none"; // Hide the form
    document.getElementById("weekTimeOverlay").style.display = "none"; // Hide the overlay
    deleteCookie("settingsOpen");
}

/**
 * Setzt den Wert des Feldes auf den Wert des gleichnamigen Cookies.
 *
 * @param {string} field Name des Feldes und des Cookies
 */
function setInitialWeekTimeValue(field) {
    const fieldValue = getCookie(field);

    if (document.getElementById(field).type === "number") {
        document.getElementById(field).value = 0;
        return;
    } else if (!fieldValue) {
        document.getElementById(field).value = "00:00";
        return;
    }

    document.getElementById(field).value = fieldValue;
}

/**
 * Gibt den Wert, den ein Tagesfeld hat zurück
 *
 * @param {string} day ElementID eines Tages Feldes
 * @return {string} Die Arbeitszeiten eines Tages
 */
function getDayFieldValue(day) {
    return document.getElementById(day).value;
}

/**
 * Updated den zum Feld gehörigen Cookie
 *
 * @param {string} day ElementID eines Tages Feldes
 */
function updateFieldValueCookie(day) {
    const dayValue = document.getElementById(day).value;
    setCookieUntilEndOfWeek(day, dayValue);

}

/**
 * Berechnet die Wochenzeiten
 */
function calculateWeekTime() {
    dayFields.forEach(day => updateFieldValueCookie(day));
    const weekTime = getTimeForWeek();

    const weekWorkTime = getWeekWorkTime(weekTime);
    const weekOverTime = calculateWeekOverTime(weekWorkTime);

    const weekWorkTimeString = formatWeekTime(weekWorkTime);
    const weekOverTimeString = formatWeekOverTime(weekOverTime);

    document.getElementById("weekTimeResult").style.display = "block";
    document.getElementById("weekWorkTime").textContent = weekWorkTimeString;
    document.getElementById("weekOverTime").textContent = weekOverTimeString;

}

/**
 * Lädt alle Funktionalitäten und Daten zur Wochenzeitrechnung
 */
function setUpWeekTime() {
    const settingsContainer = document.getElementById("weekTimeCalculator");
    settingsContainer.innerHTML = weekTimeCalculator();
}
