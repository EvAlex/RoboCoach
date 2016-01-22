export class ActionLogEntry {
    name: string;
    level: LogLevel;
    logProperties: { [key: string]: string };

    constructor(name: string, level?: LogLevel, logProperties?: { [key: string]: string }) {
        this.name = name;
        this.level = level || LogLevel.Info;
        this.logProperties = logProperties;
    }

    toString(): string {
        return this.logProperties
            ? `${this.name} | ${JSON.stringify(this.logProperties)}`
            : this.name;
    }
}

export enum LogLevel {
    Info,
    Warn,
    Error
}
