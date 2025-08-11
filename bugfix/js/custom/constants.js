/** @import {NotificationConfiguration} from ./../../ts/types.ts */

const conditions = {
    "FloatFoucs": " (Gleitzeitfeld muss aktiv sein)",
    "DevOptionsActive": " (DevOptions müssen aktiv sein)",
    "InFlexOfficeModal": " (In der FlexOffice Anwendung)",
    "ModalIsOpen": " (Ein Modal muss geöffnet sein)"
};

const keyboardControl = {
    "F1": "Open DevOptions",
    "F2": "Reset Page",
    "F3": "+14 Min Overtime" + conditions.DevOptionsActive,
    "F4": "OvertimeAutomatic on/off" + conditions.DevOptionsActive,
    "Shift + S": "Six-Hour-Mode aktivieren",
    "Shift + G": "Springt in das Gleitzeitfeld",
    "Alt + w": "Open WeekTimeCalculator",
    "Alt + f": "Open FlexOfficeCalculator",
    "Alt + c": "Open CurrentStatsMessageWithValues",
    "Alt + d": "Open DevOptionsForm" + conditions.DevOptionsActive,
    "Alt + a": "Open TimeAdder" + conditions.InFlexOfficeModal,
    "Alt + h": "Open HelpPage" + conditions.DevOptionsActive,
    "ArrowUp": "Erhöht die Gleitzeit nach erlaubten Interwallen" + conditions.FloatFoucs,
    "ArrowDown": "Verringert die Gleitzeit nach erlaubten Interwallen" + + conditions.FloatFoucs,
    "Esc": "Modal schließen" + conditions.ModalIsOpen,
    "Enter": "Eingabe beim Modal" + conditions.ModalIsOpen
};

const dayFields = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const colorVariants = {
    primary: "primary",
    secondary: "secondary",
    success: "success",
    danger: "danger",
    warning: "warning",
    info: "info",
    light: "light",
    dark: "dark",
};

const mainPageFieldIds = ["start", "pause", "end", "soll", "float"];
