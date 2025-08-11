#### v2.1.01
- Bugfix: fehler bei der Gleitzeit berechnung behoben
- metaDaten geändert
- neues Feld: Gewertete Arbeitszeit

#### v2.1.02
- Bugfix: fehler bei der negativen Gleitzeit berechnung behoben

#### v2.1.03
- Bugfix: Gleitzeitberechnung ReWork
- Darstellung der tatsächlichen Zeit angepasst

## v2.2
- Neuer Tab: Wochenarbeitszeit
	- Neues Feature: berechnen der Wochenarbeitszeit
- Update README & ChangeLog
- Anpassungen der MetaDaten in index.html

#### v2.2.01
- Kleinere optische Anpassung im Wochenarbeitszeit-Tab
- Anpassung der MetaDaten

#### v2.2.02
- Bugfix: Beim Reset wird jetzt auch die gewertete Zeit zurückgesetzt

## v2.3
- Arbeitszeitenvorauswahl remake
- Pausenzeitenauswahl remake
- Bugfix: Fehler bei der Berechnung der Gleitzeit behoben (wird jetzt nur noch mit 7.06 als Soll berechnet)
- Neues Feature: Automatische Pausenzeit auswahl
- Neues Feature: Automatische Arbeitszeitenvorauswahl (Hat keinen Effekt auf die Gleitzeit berechnung)
- Neues Feature: Arbeitsende nach gewünschter Gleitzeit ausrechnen
- Neues Feature: Optimales Ende wird angeben (wenigste Arbeitszeit mit maximaler Gleitzeit)
- Anpassung: Bessere Darstellung der Wochenarbeitszeit

## v2.4
- Neues Feature: Gleitzeit pro Woche ausrechnen
	- Neues Feature: Gleitzeit pro Woche ausrechnen, wenn man einen Gleittag genommen hat (funktioniert auch mit mehr als einem Gleittag)
- Neues Feature: Daten bleiben erhalten, wenn man den Tab wechselt
- Changelog Design angepasst
- ReadMe Struktur angepasst
- Beispiel Bild auf v2.4 updated

#### v2.4.1
- Bugfix: Wenn man 6 Stunden Arbeitszeit ausgewählt hat, wurde mit jedem neu laden der Seite die Arbeitszeit jeweils um eine Stunde reduziert
	Wenn man 10 Stunden ausgewählt hat, wurde jeweils um 1 Stunde erhöht
- Bugfix: Gleitzeitfeld kann jetzt nicht mehr leer sein

#### v2.4.2
- Man kann jetzt nicht mehr die Arbeitszeit selbständig auswählen
	- hat mehrere Probleme verursacht
	- war fachlich/praktisch keine sinnvolle Funktion
- Bugfix: wenn man so arbeitet, dass man mehr oder weniger Pause braucht wird jetzt die richtige Zeit angegeben

## v2.5 - 6h Mode
- Neues Feature: Man kann wählen zwischen einem Tag mit 6 Stunden und einem Tag mit 7:06 Stunden
	- Im 6 Stunden Modus kann man auch seine Gleitzeit eintragen
    - Wenn man im 6 Stunden Modus durch Ändern von Ende oder Gleitzeit wieder über die erlaubten 6 Stunden kommt, wird der Modus automatisch beendet
    - Wenn man im 7 Stunden Modus durch Ändern von Ende oder Gleitzeit unter 6 Stunden kommen sollte, aktiviert man automatisch den 6 Stunden Modus
- Bugfix: Man muss nur noch einmal den Rest Button klicken
- Refactoring: Man es gibt jetzt einen Formatter für die Gleitzeitangaben

#### v2.5.1
- Man kann jetzt nicht mehr per Tab in das Pause- und das Arbeitszeitfeld
- Die Gleitzeit pro Woche wird bei Gleittagen jetzt richtig berechnet und angezeigt
- Die Eingaben werden jetzt im LocalStorage gespeichert und einmal pro Tag gelöscht
  - jetzt kann man das Fenster schließen, und wenn man dieselbe Seite am selben Tag wieder aufruft, werden die letzten Eingaben wieder aufgerufen
- Bei der Gleitzeit wird die Zehnerstelle jetzt mit einer 0 Aufgefüllt
- Bugfix: Der Modus wird jetzt beim neuladen automatisch eingestellt gewechselt
- Bugfix: Die Daten werden wirklich aus dem Localstorage gelöscht

#### v2.5.2 - DevOptions
- Neues Feature: DevOptions
  - Es werden neue Tabs angezeigt: aktuelle Version, Testversion, Repo, Restart und Exit (um den Modus wieder zu verlassen)
  - Um in den Modus zu kommen, muss man auf der Konsole "enableDevOptions()" eingeben oder die Seite über einen bestimmten Link aufrufen

#### v2.5.3 - DevOption Icons
- Refactoring: DevOptions werden jetzt als Icons angezeigt
- QoL: Die Seite wird automatisch neu geladen, wenn man den Tab öffnet
  - dadurch sollte der Countdown jetzt auch nach dem Sperren des PCs die richtige Zeit anzeigen
- Bugfix: Der Modus wird jetzt auch gespeichert, wenn man die Seite zum ersten Mal öffnet
  - Beim neuen Laden wird jetzt immer ein Knopf als aktiv angezeigt
- Refactoring: DevOptions die eine Funktion aufrufen, sind jetzt buttons
  - Die Buttons sehen aber aus wie alle anderen Tabs

#### v2.5.4 - Cookies
- Auf Cookies umgestellt
    - Local und SessionStorage Methoden wurden entfernt
    - SameDayCheck entfernt, ist mit Expiring Cookies überflüssig
- Code Refactoring
    - var auf const und let geändert und unnötige Zeilen entfernt
    - destructuring implementiert
    - einige zwischen variablen gelöscht einheitliche benennung (snake_case to camelCase)
    - dzr in dzr und dzrUtils unterteilt
      - dzrUtils sind alle funktionen die nicht direkt auf das html zugreifen müssen
    - getter and calculations simplified, sodass man jetzt über eine const immer auf den aktuellen Wert zugreifen kann

#### v2.5.5 - Testing and Refactoring
- introducing: testing with jest
- neues feature: Gleitzeit über die Pfeiltasten erhöhen und verringern
- weekTimeUtils eingeführt
    - tests für die weekTimeUtils geschrieben
- handling für falsche Formate von FloatArrays
- calculate() code etwas reduziert

#### v2.5.6 - New and Custom DevOptions
- Das Plus bei der Wochenarbeitszeit entfernen
- Man kann jetzt bis zu 3 eigene DevOptions vergeben
    - Man kann aus einer Liste von Icons wählen (es gibt keine eigenen Animationen, nur die standard Icon Animation)
    - Man kann eigene links vergeben (es soll keine eigenen Funktionen geben)
- Neue DevOption: Gleitzeit +14 Minuten setzten
- Quality of Life: DevOption links öffnen jetzt immer in einem neuen Tab
- PopUp Fenster um DevOptions hinzuzufügen
- Wenn ein Button Mittag oder Lunch heißt und der Link ein entsprechendes Format hat, wird er bei jedem laden updated
- Neues Format für den ChangLog eingeführt
- CustomDevOptions lassen sich wieder entfernen
- Einige Deprecated Methoden wurden entfernt
- Man kann jetzt die DevTools per F2 öffnen
    - Öffnen oder schließen, je nach aktuellen Status
- JSDoc für devOptions ergänzt
- Dependencies in die Readme geschrieben
- Bugfix: URL wird komisch angezeigt
- Types in JSDoc eingeführt
    - In den Utils Files und an anderen stellen entsprechende Kommentare ergänzt
- ChangeLog als DevButton ergänzt
- Es können nur noch die benötigten Zeichen in das Floatfeld eingetragen werden
    - Entsprechende Tests ergänzt
- Bugfix: Wenn man die Zahlen aus dem Endzeitfeld löscht, wird nicht mehr automatisch die Zeit berechnet, was früher zu fehlern geführt hat


#### v2.5.7 - FlexOffice-Zeitrechner
- Cookies werden jetzt zwischen main und bugfix unterschieden
    - jetzt kann man unterschiedliche Werte in bugfix und main haben und sie bedingen sich nicht mehr
- Neue Funktionalität: Forever Cookies
    - Cookies können jetzt so gespeichert werden, dass sie regelmäßig
      automatisch neu eingespeichert werden und somit nie verloren gehen
- Wochenzeitrechner ist jetzt ein Icon
- Neues Feature:
    - Man kann sich jetzt durch die Eingabe von FlexOffice-Quote, Abwesenheitstagen sowie der Zeit, die diesen Monat schon im FlexOffice erbracht wurde, die Zeit ausrechnen, die man diesen Monat noch im FlexOffice machen kann
    - Die Eingaben werden bei jeder Berechnung gespeichert, sodass man seine Werte immer nur erhöhen muss
      - Die gespeicherten Daten werden immer am Ende des Monats gelöscht
    - Für die neuen Funktionen wurden Teilweise tests geschrieben
- Die neuen Icons wurden in der DB eingefügt
- Das Script zum Erstellen der DB wurde auf ein TS Script geändert
- Nachbesserung: wenn die Zeiten unter 0 sind, werden sie jetzt einfach als 0 angezeigt
- Bugfix: Der Monat zeigt jetzt nicht mehr eine 1 an, wenn die Werte noch nicht geladen sind
- Das Bild in der Readme wurde auf die 2.5.7 ausgetauscht
- Bugfix: Die DevOptions werden beim Laden der Seite jetzt nicht mehr angezeigt
- Bugfix: Die ForeverCookies werden jetzt bei jedem laden der Seite neu gesetzt
- Neue Cookie Funktionen: man kann jetzt welche bis zum Ende des Monats und bis zum Ende der Woche speichern und alle vorhanden Cookies löschen
- Wochenzeitrechner als Modal umgesetzt und die extra HTML Seite entfernt
  - Aktuell funktioniert ist aber nur die Wochenarbeitszeit umgesetzt, die Gleitzeit kommt zu einem späteren Zeitpunkt wieder
- ReDesign: Die nicht DevOption Icons sind jetzt weiß (bzw. ihre Farbe wird invertiert)

#### v2.5.8 - new File structure, overTimeAutomatic, currentStats und KeyboardControl
- Bugfix: es wird maximal 10 Minuten gespeichert, das ein Modal geöffnet ist
- JS Dateien in original und custom unterteilt, für eine besser Übersicht
- utility und dateUtility erstellt: für übergreifende Funktionen, die an mehreren Stellen genutzt werden können
- Bugfix: Die CustomDevOptions werden jetzt beim neuladen der Seite wieder direkt angezeigt
  - Alle DOMContentLoaded Funktionen in einer zusammengefasst, jetzt wird nur noch die einmal aufgerufen (so ist es einfacher die Reihenfolge zu bestimmen)
- Bugfix: Die Flex Office Zeiten lassen sich jetzt wieder berechnen und die Ei gegeben Daten werden gespeichert und geladen
- Neues Feature: Man kann jetzt per DevOptions einen Modus aktivieren, bei dem das Arbeitsende immer weiter aufgeschoben wird, sodass man es beim neu laden nicht per Hand ändern muss
  - Standardmäßig ist das Feature deaktiviert, und es lässt sich NUR über die DevOptions aktivieren
- Neues Feature: Man kann sich anzeigen lassen wie viel Plus oder Minus man machen würde, wenn man jetzt in den Feie raben gehen würde
  - Keine DevOption, ist für alle verfügbar
- Neues Feature: Die Modals sind jetzt per Button steuerbar, Enter zum Eingeben, Delete zum Löschen und Escape zum Schließen
- Bugfix: Wenn man eine CustomDevOption löscht, merkt der User das nun auch
- Neues Feature: Man kann jetzt per Tastendruck die Seite zurücksetzen (Reset), dafür muss man F1 drücken

#### v2.5.9 - Refactoring, Redesign und weitere Verbesserungen
- Anpassung: Es werden jetzt nicht mehr die Arbeitstage im Monat, sondern die Arbeitstage abzüglich der Abwesenheitstage angezeigt
  - Jetzt werden sowohl die gearbeiteten Tage angezeigt als auch die Arbeitstage des jeweiligen Monats
- Neues Feature: Man kann jetzt auch für vergangene Monate sich die FlexOffice Zeiten ausrechnen (jeweils 6 Monte in die Zukunft und 6 Monate in die Vergangenheit)
- Das Design des FlexOffice Rechners wurde angepasst, damit die zusätzlichen Felder jetzt alle aufs Modal passen
- Die FlexOffice Quote wird jetzt auch gespeichert und ausgelesen
- Bugfix: Der AutoOverTimeButton zeigt jetzt auch nach dem neuladen der Seite den richtigen Wert an
- Der Wochenzeitrechner wurde vom Design her an den FlexOffice rechner angepasst und ist übersichtlicher geworden
- Die Gleitzeitwochen Funktion angepasst (überflüssigen Parameter entfernt)
- Bugfix: Es wird jetzt nicht immer nur der aktuelle Monat angezeigt, sondern der mit dem gerechnet wurde
- Refactoring: Die Funktion "formatMins" wurde auf formatNumber umgestellt (selbe Funktion, einheitlicherer Name)
- hotfix: Wenn die Endzeit eine Null enthält, führt das jetzt nicht mehr zu seltsamen Fehlern
- Improvement: In der Monatsauswahl wird jetzt angezeigt, welchen Monat man genau auswählt (es wird das dazugehörige Jahr angezeigt)
  - Die Monatsnamen sind jetzt nur noch Abkürzungen (bzw. ihre ersten 3 Buchstaben)
- Refactoring: Die Options Werte für die Quoten und die Monate werden jetzt per JS aus Listen generiert
- Refactoring: Die API für Feiertage eigenbunden (vlt.)
- hotfix: Die Minuten bei der FlexOffice berechnung, haben jetzt kein Limit mehr, machte Fachlich gesehen keinen Sinn und hat zu Fehlern/komischen Eingaben geführt
- Neues Feature/Improvement: Die Daten für die FlexOffice Monate werden jetzt bis zum letzten Tag des Vormonats gespeichert
- Neue Funktion, Cookies können jetzt für ein Jahr gespeichert werden
- Bugfix: Die Arbeitstage werden jetzt korrekt berechnet
- Refactoring: funktionalitäten ausgelagert, Feiertags API eingebunden (mit der anderen Methode als fallback)
- hotfix: Wenn die Endzeit eine Null enthält, führt das jetzt nicht mehr zu seltsamen Fehlern

#### v2.5.10 - Typescript Testing
- Die Jest Tests wurden von JS auf TS umgestellt
- Typen in den Tests ergänzt
- Frühzeitiger Feierabend Rechnung verbessert
- Bugfix: Cookies bis zum Ende eines Monats werden jetzt richtig gestate und gelöscht
- Refactoring: Die overTimeAutomatic on/off funktion wurde vereinfacht
- Animation für die Overtimeautomatic hinzugefügt
- Das offDays Feld wird immer auf die Tage des Monats limitiert
- Die Wochengleitzeit wird jetzt wieder berechnet
- Bugfix: Das Flexoffice Stunden Feld wird jetzt beim Monatswechsel begrenzen
- UI Utilitys erstellt und eingebunden
- currentStatsMassage braucht keine Parameter mehr
- Cookies sollen jetzt einmal alle sauber gelöscht werden
- Anleitung für Keyboard control eingebaut
- Event listener "click" durch "pointerdown" ersetzt
- Tastensteuerung für +14 und den 6er-Modus
- Sortierung der Skripte im HTML (mit Anmerkungen wofür sie sind)
- Wochenzeit Berechnung funktioniert wieder (dafür gehen die tests aber nicht)
- constants.js eingeführt
- Tägliche Arbeitszeit wird bis zum Ende der Woche gespeichert
- better placing in flexOffice UI
- Schließen der Modals jetzt per klick auf das Overlay möglich
- Alle Buttons mit Icons haben jetzt einen Tooltip/Title
- Bei den CustomDevOptions gibt es jetzt keine Doppelungen mehr (in den Dropdowns)
- Buttons können jetzt zu Reactbuttons gemacht werden
  - Die Buttons in den Modals wurden entsprechend angepasst

#### v2.5.11 - GitHub Actions und Keyboard Control Improvements
- GitHub Actions um Tests zu Automatisieren
- WeekTime Modal angepasst
  - mehr Breite weniger Höhe, bessere Verteilung der Komponenten
- bugfix: Wochenzeit Berechnung ging nicht, wenn Minuten und Stunden nicht dasselbe Vorzeichen haben
- fixing tests
  - Type Benennung angepasst
  - Funktion in andere Datei verschoben
- bugfix: restliche FlexOffice Zeit diesen Monat
- bugfix: Die DevOptions können jetzt wieder über eine bestimmte URL automatisch gestartet werden
- type float entfernt (css wird ist jetzt an die id gebunden)
- besserer Text bei der CurrentStatsMessageWithValues
- bessere Keyboard Control (Beschreibung entsprechen angepasst)
  - F1 und F2 getauscht
  - F3: +14 Min Gleitzeit
  - F4: OverTimeAutomatic on/off
  - Shift + G: zum Gleitzeitfeld fokussieren
  - Shift + S: Six-Hour-Mode aktivieren
  - Alt + w: WeekTimeCalculator öffnen
  - Alt + f: FlexOfficeCalculator öffnen
  - Alt + c: CurrentStatsMessageWithValues öffnen
  - Alt + d: DevOptionsForm öffnen
  - F3, F4 und Alt + d funktionieren nur noch wenn die DevOptions aktiv sind
- new Utility Function (addTimeValues())
    - entsprechende Tests
    - Test für subtractTimeValues() verbessert
- Zeit hinzufügen Button bei FlexOffice eingebaut, damit man einfach Zeiten ergänzen kann
- getNumberFromFloat() gefixt, falls "" als Wert gefunden wird
- Man kann jetzt FlexOffice Zeit auf einem extra Modal hinzufügen
- bessere und mehr Testcases
- Help Page eingebaut (alle Shortcuts werden aufgelistet)
    - In einer Tabelle mit Shortcut, Action und Condition
- alle Felder im Haupt Fenster per Esc verlassen
- CurrentStatsMessage lässt sich nur noch öffnen, wenn der Rechner aktiv ist
- Bessere Typ Sicherheit
- TS Types werden für JSDoc verwendet
- Der verwendete Modus wird jetzt nicht mehr durch eine neue Startzeit ersetzt

#### v2.5.12 - Notifications
- CSS Imports umsortiert
- Keine Alerts mehr Benachrichtigungen werden jetzt ordentlich angezeigt
- Externe Libraries in die ReadMe aufgenommen
- Loggen der VersionsNr und des Versionsnamens beim Seitenaufruf