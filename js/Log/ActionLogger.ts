/// <reference path="../../typings/tsd.d.ts" />

import IAction from "../Actions/IAction";
import Dispatcher from "../Dispatcher/Dispatcher";
import {ActionLogEntry, LogLevel} from "./ActionLogEntry";
import * as Utils from "../Utils";

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
            Utils.padNumber(date.getHours(), 2) +
            ":" +
            Utils.padNumber(date.getMinutes(), 2) +
            ":" +
            Utils.padNumber(date.getSeconds(), 2) +
            ":" +
            Utils.padNumber(date.getMilliseconds(), 3));
    }
}

export default new ActionLogger();
