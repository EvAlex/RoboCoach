/// <reference path="../../typings/tsd.d.ts" />

import IAction from "../Actions/IAction";
import Dispatcher from "../Dispatcher/Dispatcher";
import {ActionLogEntry, LogLevel} from "./ActionLogEntry";

/**
 * Logger that logs all actions
 */
class ActionLogger {
    public constructor() {
        Dispatcher.register(this.processActions);
    }

    private processActions: (action: IAction) => void = (action: IAction) => {
        this.log(action);
    };

    private log(action: IAction): void {
        let logEntry: ActionLogEntry = action.toLogEntry();

        if (logEntry != null) {
            var msg: string = `${this.dateToString(action.getTimestamp())}> [ActionLogger] ${logEntry.toString()}`;
            if (logEntry.level === LogLevel.Info) {
                console.log(msg);
            } else if (logEntry.level === LogLevel.Warn) {
                console.warn(msg);
            } else if (logEntry.level === LogLevel.Error) {
                console.error(msg);
            }
        }
    }

    private dateToString(date: Date): string {
        return (
            this.pad(date.getHours(), 2) +
            ":" +
            this.pad(date.getMinutes(), 2) +
            ":" +
            this.pad(date.getSeconds(), 2) +
            ":" +
            this.pad(date.getMilliseconds(), 3));
    }

    private pad(n: any, width: any, z?: any): string {
      z = z || "0";
      n = n + "";
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}

export default new ActionLogger();
