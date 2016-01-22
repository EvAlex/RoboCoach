
import IAction from "./IAction";
import {ActionLogEntry} from "../Log/ActionLogEntry";

export abstract class ActionBase implements IAction {
    private timestamp: Date;

    constructor() {
        this.timestamp = new Date();
    }

    public getTimestamp(): Date {
        return this.timestamp;
    }

    public abstract toLogEntry(): ActionLogEntry;

}
