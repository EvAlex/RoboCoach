import {ResponseActionBase} from "./ResponseActionBase";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry"
import StartWorkoutAction from "./StartWorkoutAction";

export default class ProcessWorkoutStartFailedAction extends ResponseActionBase {
    private error: IRoboCoachError;

    constructor(error: IRoboCoachError, requestAction: StartWorkoutAction) {
        super(requestAction);
        this.error = error;
    }

    public get Error(): IRoboCoachError {
        return this.error;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry("ProcessWorkoutStartFailedAction", LogLevel.Error, { error: this.error.toString() });
    }
}
