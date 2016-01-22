import {ResponseActionBase} from "./ResponseActionBase";
import RequestWorkoutPlansAction from "./RequestWorkoutPlansAction";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class ReceiveWorkoutPlansFailAction extends ResponseActionBase {

    constructor(error: IRoboCoachError, requestAction: RequestWorkoutPlansAction) {
        super(requestAction);
        this.error = error;
    }

    public get Error(): IRoboCoachError {
        return this.error;
    }
    private error: IRoboCoachError;

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry("ReceiveWorkoutPlansFailAction", LogLevel.Error, { error: this.error.toString() });
    }
}
