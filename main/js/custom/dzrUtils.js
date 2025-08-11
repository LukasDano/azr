/** @import {Time, FloatTime} from ./../../ts/types.ts */

/**
 * Gibt die Differenz zwischen Start und Ende zurück
 * @param {Time} startTime Arbeitsbeginn
 * @param {Time} endTime Arbeitsende
 * @return {Time} Die Differenz zwischen Start und Ende
 */
function calculateStartEndeTimeDiff(startTime, endTime) {
    const [startHours, startMins] = startTime;
    const [endHours, endMins] = endTime;

    let diffHours = endHours - startHours;
    let diffMins = endMins - startMins;

    if (diffMins < 0) {
        diffHours--;
        diffMins = diffMins + 60;
    }

    return [diffHours, diffMins];
}

/**
 * Berechnet die Differenz zwischen IST und SOLL
 * @param {Time} workTime Zeit die an dem Tag gearbeitet wird
 * @param {Time} sollTime Die zu erfüllende Arbeitszeit
 * @return {[number, number, boolean]} Die Differenz zwischen Ist und Soll,
 *  sowie ob die positiv oder negativ ist
 */
function calculateIstSollTimeDiff(workTime, sollTime) {
    const [workHours, workMins] = workTime;
    const [sollHours, sollMins] = sollTime;

    let diffHours = workHours - sollHours;
    let diffMins;

    if (diffHours === 0 && workMins > sollMins) {
        diffMins = workMins - sollMins;
    } else if (diffHours > 0) {
        diffMins = 60 - sollMins + workMins;
        diffHours--;

        if (diffMins >= 60) {
            diffMins = diffMins - 60;
            diffHours++;
        }
    } else if (workMins > sollMins && workMins < 60) {
        diffMins = 60 - workMins + sollMins;
        diffHours++;
    } else {
        diffMins = sollMins - workMins;
    }

    if (diffMins < 0) {
        diffHours--;
        diffMins = diffMins + 60;
    }

    const positive = !(
        (workHours === sollHours && workMins < sollMins) ||
        workHours < sollHours
    );

    return [diffHours, diffMins, positive];
}

/**
 * Berechnet die reine Arbeitszeit (abzüglich Pause)
 * @param {Time} diffTime Zeit von Beginn bis Ende des Arbeitstages
 * @param {Time} pauseTime Pausenzeit
 * @return {Time} Die reine Arbeitszeit
 */
function calculateWorkTime(diffTime, pauseTime) {
    const [diffHours, diffMins] = diffTime;
    const [pauseHours, pauseMins] = pauseTime;

    let workHours = diffHours - pauseHours;
    let workMins = diffMins - pauseMins;

    if (workMins < 0) {
        workHours--;
        workMins = workMins + 60;
    }

    return [workHours, workMins];
}

/**
 * Berechnet das Ende aus dem Start, der Pausenzeiten und dem Soll des Tages
 * @param {Time} startTime Arbeitsbeginn
 * @param {Time} pauseTime Pausenzeit
 * @param {Time} sollTime Wie viel Arbeitszeit soll erbracht werden
 * @return {Time} Das eigentliche Arbeitsende
 */
function calculateNormalEnd(startTime, pauseTime, sollTime) {
    const [startHours, startMins] = startTime;
    const [pauseHours, pauseMins] = pauseTime;
    const [sollHours, sollMins] = sollTime;

    let endHours = startHours + pauseHours + sollHours;
    let endMins = startMins + pauseMins + sollMins;

    if (endHours >= 24) endHours = endHours - 24;

    // Wenn Start-Minuten + Pausen-Minuten + Soll-Minuten >= 120 sind
    if (endMins >= 120) {
        endMins = endMins - 120;
        endHours += 2;
    }

    // Wenn Start-Minuten + Pausen-Minuten + Soll-Minuten >= 60 sind
    if (endMins >= 60) {
        endMins = endMins - 60;
        endHours++;
    }

    return [endHours, endMins];
}

/**
 * Berechnet die gewertete Zeit aus dem gerundeten Start und dem gerundeten Ende
 * @param {Time} startTime Der Arbeitsbeginn
 * @param {Time} endTime Das Arbeitsende
 * @param {Time} pauseTime Die Pausenzeit
 * @return {Time} Die Zeit, die an dem Tag wirklich gearbeitet wird
 */
function calculateIstTime(startTime, endTime, pauseTime) {
    const [startHours, startMins] = roundStart(startTime);
    const [endHours, endMins] = roundEnd(endTime);
    const [_, pauseMins] = pauseTime;

    let istHours = endHours - startHours;
    let istMins = endMins - startMins - pauseMins;

    while (istMins < 0) {
        istHours--;
        istMins = istMins + 60;
    }

    if (istHours >= 12) istHours = istHours - 2;

    return [istHours, istMins];
}

/**
 * Gibt einem die Gleitzeit zurück, die man anhand der IstZeit macht
 * @param {Time} istTime Die aktuelle Arbeitszeit des Tages
 * @return {Time} Die Gleitzeit, die man damit macht
 */
function calculateGleitzeit(istTime) {
    const [istHours, istMins] = istTime;
    const [sollHours, sollMins] = [7, 6];

    let gleitHours = istHours - sollHours;
    let gleitMins = istMins - sollMins;

    if (istHours < sollHours) {
        gleitHours++;
        gleitMins = gleitMins - 60;
    }

    if (gleitHours > 0 && gleitMins < 0) {
        gleitHours--;
        gleitMins = gleitMins + 60;
    }

    if (gleitMins < -59) {
        gleitHours--;
        gleitMins = gleitMins + 60;
    }

    return [gleitHours, gleitMins];
}

/**
 * Arbeitsbeginn auf 10er und 5er abrunden
 * @param {Time} startTime Aktuelle Startzeit
 * @return {Time} Die abgerundete Startzeit
 */
function roundStart(startTime) {
    let [startHours, startMins] = startTime;
    let tens = 0;

    while (startMins > 9) {
        startMins = startMins - 10;
        tens++;
    }

    if (startMins >= 5)  startMins = 5;
    if (startMins <= 4) startMins = 0;

    startMins = startMins + tens * 10;

    return [startHours, startMins];
}

/**
 * Arbeitsende auf 10er und 5er aufrunden
 * @param {Time} endTime Aktuelle Endzeit
 * @return {Time} Das gerundete Ende
 */
function roundEnd(endTime) {
    let [endHours, endMins] = endTime;
    let tens = 0;

    if (endMins >= 56) {
        endMins = 0;
        endHours++;

        return [endHours, endMins];
    }

    while (endMins > 9) {
        endMins = endMins - 10;
        tens++;
    }

    if (endMins >= 6) {
        endMins = 0;
        tens++;
    } else if (endMins === 0) {
        endMins = 0;
    } else if (endMins <= 4) {
        endMins = 5;
    }

    endMins = endMins + tens * 10;

    return [endHours, endMins];
}

/**
 * Berechnet das Ende basierend auf dem eigentlichen Ende und der erwünschten Gleitzeit
 * @param {Time} normalEnd Die eigentliche Endzeit
 * @param {FloatTime} float Die gewünschte Gleitzeit
 * @return {Time}  Das Ende zu übergebenen Werten
 */
function calculateEndForFloat(normalEnd, float) {
    let [istEndHours, istEndMins] = normalEnd;
    const gleitVorzeichen = float[0];

    let floatTimeRounded;

    if (gleitVorzeichen === 1) {
        floatTimeRounded = calculateTimeToAddForEndWithPositiveFloat(float);
    } else if (gleitVorzeichen === -1) {
        floatTimeRounded = calculateTimeToAddForEndWithNegativeFloat(float);
    }

    const [gleitHours, gleitMins] = floatTimeRounded;

    const sollEndHours = istEndHours + gleitHours * gleitVorzeichen;
    const sollEndMins = istEndMins + gleitMins * gleitVorzeichen;

    return [sollEndHours, sollEndMins];
}

/**
 * Berechnet die Zeit, die dem normalen Ende hinzugefügt werden muss,
 * um die gewünschte Gleitzeit zu bekommen, wenn diese positiv ist
 * @param {FloatTime} float Die gewünschte Gleitzeit
 * @return {Time} Zeit die zum Ende hinzugefügt werden muss
 */
function calculateTimeToAddForEndWithPositiveFloat(float) {
    let [_, gleitHours, gleitMins] = float;
    let tens = 0;

    if (gleitHours !== 0 && gleitMins === 0) {
        gleitMins = 4;
        // Ausgleich, weil man normalerweise schon plus 4 Minuten macht
        return [gleitHours, gleitMins - 4];
    }

    while (gleitMins > 9) {
        gleitMins = gleitMins - 10;
        tens++;
    }

    if (gleitMins <= 4) {
        gleitMins = 4;
    } else if (gleitMins <= 9) {
        gleitMins = 9;
    }

    gleitMins = 10 * tens + gleitMins;

    return [gleitHours, gleitMins - 4];
}

/**
 * Berechnet die Zeit, die dem normalen Ende hinzugefügt werden muss,
 * um die gewünschte Gleitzeit zu bekommen, wenn diese negative ist
 * @param {FloatTime} float Die gewünschte Gleitzeit
 * @return {Time} Zeit die zum Ende hinzugefügt werden muss
 */
function calculateTimeToAddForEndWithNegativeFloat(float) {
    let [, gleitHours, gleitMins] = float;
    let tens = 0;

    if (gleitHours !== 0 && gleitMins === 0) {
        gleitMins = 56;
        gleitHours--;

        // Ausgleich, weil man normalerweise schon plus 4 Minuten macht
        return [gleitHours, gleitMins + 4];
    } else if (gleitHours === 0 && gleitMins === 0) {
        gleitMins = 1;

        return [gleitHours, gleitMins + 4];
    }

    while (gleitMins > 9) {
        gleitMins = gleitMins - 10;
        tens++;
    }

    if (gleitMins === 0) {
        gleitMins = 6;
        tens--;
    } else if (gleitMins >= 6) {
        gleitMins = 6;
    } else if (gleitMins <= 5) {
        gleitMins = 1;
    }

    gleitMins = 10 * tens + gleitMins;

    return [gleitHours, gleitMins + 4];
}

/**
 * Erstellt ein FloatTime Value aus einem String,
 * wenn kein Wert übergeben wird, wird die UI zurück gesetz und nichts zurückgegeben
 * @param {string} float Die Gleitzeit als String Array
 * @return {FloatTime | void} Die Gleitzeit als FloatTime Value oder nichts, wenn der Parameter ungültig ist
 */
function getFloatValueFromText(float) {
    const floatArray = float.split("");
    let vorzeichen = 1;

    if (floatArray[0] === "-") vorzeichen = -1;

    if (floatArray.length === 5) {
        // Fromat
        // 0,1,2,3,4
        // +,0,.,1,4

        const gleitHours = parseInt(floatArray[1], 10);
        const gleitTens = parseInt(floatArray[3], 10);
        const gleitOnes = parseInt(floatArray[4], 10);

        const gleitMins = gleitTens * 10 + gleitOnes;

        return [vorzeichen, gleitHours, gleitMins];
    } else {
        resetToDefault();
    }
}

/**
 * Nimmt die aktuelle Endezeit und gibt die Endezeit,
 * mit der die gleiche Menge an Gleitzeit gemacht wird und die am wenigsten Arbeitszeit erfordert
 * @param {Time} endTime Aktuelle Endezeit
 * @return {Time} Das optimierte Ende mit der geringsten Arbeitszeit
 */
function calculateOptimizedEnd(endTime) {
    let [endHours, endMins] = endTime;
    let tens = 0;

    while (endMins > 9) {
        endMins = endMins - 10;
        tens++;
    }

    if (endMins === 0 && tens === 0) {
        endMins = 56;
        endHours--;
    } else if (endMins === 0) {
        endMins = 6;
        tens--;
    } else if (endMins >= 6) {
        endMins = 6;
    } else if (endMins <= 5) {
        endMins = 1;
    }

    endMins = 10 * tens + endMins;
    if (endMins <= 9)  endMins = "0" + endMins;

    return [endHours, endMins];
}

/**
 * Rechnet aus dem eigentlichen Ende und der Gleitzeit das Ende für diese Gleitzeit
 * @param {Time} normalEnd Das eigentliche Ende
 * @param {FloatTime} floatTime Die gewünschte Gleitzeit
 * @return {Time} Das Ende, um diese Gleitzeit zu machen
 */
function roundTimeForFloat(normalEnd, floatTime) {
    let [endHours, endMins] = calculateEndForFloat(normalEnd, floatTime);

    while (endMins >= 60) {
        endHours++;
        endMins = endMins - 60;
    }

    while (endMins < 0) {
        endHours--;
        endMins = endMins + 60;
    }

    if (endMins < 10) endMins = "0" + endMins;
    return [endHours, endMins];
}

/**
 * Gibt die nächst größere valide Gleitzeit zurück
 * zum Beispiel: "+0.04" → "+0.09"
 * @param {FloatTime} float Die aktuelle Gleitzeit
 * @return {Time} Die nächst größere Gleitzeit
 */
function calculateIncreasedValue(float) {
    let [floatVorzeichen, floatHours, floatMins] = float;
    // 1,0,4
    floatHours = floatHours * floatVorzeichen;
    floatMins = floatMins * floatVorzeichen;

    if (floatHours === -0) floatHours = 0;

    if (floatMins === 59) {
        floatHours += 1;
        floatMins = 4;

        return [floatHours, floatMins];
    }

    if (floatHours === 0 && floatMins === -1) {
        floatMins = 4;
        return [floatHours, floatMins];
    }

    if (floatHours <= 0 && floatMins === -1) {
        floatHours += 1;
        floatMins = -56;
        return [floatHours, floatMins];
    }

    floatMins = floatMins + 5;
    return [floatHours, floatMins];
}

/**
 * Gibt die nächst kleinere valide Gleitzeit zurück
 * zum Beispiel: "+0.09" → "+0.04"
 * @param {FloatTime} float Die aktuelle Gleitzeit
 * @return {Time} Die nächst kleinere Gleitzeit
 */
function calculateDecreasedValue(float) {
    let [floatVorzeichen, floatHours, floatMins] = float;
    // 1,0,4

    if (floatHours === 0 && floatMins === 4) {
        floatMins = -1;
        return [floatHours, floatMins];
    }

    floatHours = floatHours * floatVorzeichen;
    floatMins = floatMins * floatVorzeichen;

    if (floatHours === -0) floatHours = 0;

    if (floatMins === 4 && floatHours === 0) {
        floatMins = -1
        return [floatHours, floatMins];
    }

    if (floatHours <= 0 && floatMins === -56) {
        floatHours -= 1;
        floatMins = -1;
        return [floatHours, floatMins];
    }

    if (floatMins === 4) {
        floatHours -= 1;
        floatMins = 59;
        return [floatHours, floatMins];
    }

    floatMins = floatMins - 5;
    return [floatHours, floatMins];
}

/**
 * Erzeugt einen lesbareren String, der zur Darstellung genutzt werden kann
 * @param {Time} float Die Gleitzeit, die aktuell in dem Feld steht
 * @return {string} Die Gleitzeit als lesbarer String
 */
function createGleitzeitAusgabeFromFloat(float) {
    let [gleitHours, gleitMins] = float;

    if (typeof jest !== "undefined") var formatNumber = require("./utility.js").formatNumber;

    // Funktion für die Formatierung definieren, falls nicht vorhanden
    formatNumber = formatNumber || ((mins) => String(mins).padStart(2, "0"));

    // Vorzeichen ermitteln
    let sign = (gleitHours < 0 || gleitMins < 0) ? "-" : "+";

    // Absolutwerte nehmen
    gleitHours = Math.abs(gleitHours);
    gleitMins = Math.abs(gleitMins);

    return sign + gleitHours + "." + formatNumber(gleitMins);
}

/**
 * Prüft ob der eingegeben Floatwert nur gültige Zeichen enthält
 * @param {string} float Der zu prüfende Float Wert
 * @return {boolean} Ob die Eingabe valide ist
 */
function validateFloat(float) {
    const validSymbols = ['+', '-', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let isValid = true;

    for (const char of float) {
        if (!validSymbols.includes(char)) {
            isValid = false;
            if (["n", "a"].includes(char.toLowerCase())) {
                resetPage();
            }
            break;
        }
    }
    return isValid;
}

/**
 * Prüft, ob ein Parameter eine Zeit bestehend aus zwei Zahlen ist.
 * @param {Time} numberList Die Zeit die überprüft werden soll
 * @return {boolean} Ist der Parameter eine Time bestehend aus zwei Zahlen
 */
function isValidTime(numberList) {
    const [hours, minutes] = numberList;

    return (
        typeof hours === "number" &&
        typeof minutes === "number" &&
        !isNaN(hours) &&
        !isNaN(minutes) &&
        hours >= 0 &&
        hours < 24 &&
        minutes >= 0 &&
        minutes < 60
    );
}

/**
 * Gibt alle Tastatureingaben aus, und was diese bewirken
 */
function getKeyboardControls() {
    Object.entries(keyboardControl).forEach(item => {
        const [key, value] = item;
        console.log(key + ": " + value);
    });
}

module.exports = {
    calculateStartEndeTimeDiff,
    calculateIstSollTimeDiff,
    calculateWorkTime,
    calculateNormalEnd,
    calculateIstTime,
    calculateGleitzeit,
    roundStart,
    roundEnd,
    calculateEndForFloat,
    calculateTimeToAddForEndWithPositiveFloat,
    calculateTimeToAddForEndWithNegativeFloat,
    getFloatValueFromText,
    calculateOptimizedEnd,
    roundTimeForFloat,
    calculateIncreasedValue,
    calculateDecreasedValue,
    createGleitzeitAusgabeFromFloat,
    validateFloat,
    isValidTime
};
