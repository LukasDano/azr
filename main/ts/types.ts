export type Vorzeichen = 1 | -1;
export type Hours = number;
export type Mins = number;

export type Time = [Hours, Mins];
export type InValidTime = [Hours, Mins | null | undefined];
export type FloatTime = [Vorzeichen, Hours, Mins];

export type DayTime = {
    hours: Hours,
    mins: Mins
};

export type WeekTime = {
    monday: DayTime,
    tuesday: DayTime,
    wednesday: DayTime,
    thursday: DayTime,
    friday: DayTime
};

export type FeiertageHamburg = {
    Neujahr: Date,
    Karfreitag: Date,
    Ostermontag: Date,
    TagDerArbeit: Date,
    ChristiHimmelfahrt: Date,
    Pfingstmontag: Date,
    TagDerDeutschenEinheit: Date,
    Reformationstag: Date,
    ErsterWeihnachtsfeiertag: Date,
    ZweiterWeihnachtsfeiertag: Date
};

export type FlexMonth = {
    daysOff: number;
    flexHours: Hours;
    flexMins: Mins;
};

export type ButtonColor = {
    text: string;
    bg: string;
    hover: string;
    active: string;
};

export type ColorVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export type NotificationType = "info" | "waring" | "error" | "success";

type NotificationConfig = {
    type: NotificationType;
    text: string;
};
