import {ResponseActionBase} from "./ResponseActionBase";
import RequestWorkoutAction from "./RequestWorkoutAction";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class ProcessRequestWorkoutFailedAction extends ResponseActionBase {

    constructor(workoutId: string, error: IRoboCoachError, requestAction: RequestWorkoutAction) {
        super(requestAction);
        this.workoutId = workoutId;
        this.error = error;
    }

    public get WorkoutId(): string {
        return this.workoutId;
    }
    private workoutId: string;

    public get Error(): IRoboCoachError {
        return this.error;
    }
    private error: IRoboCoachError;

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(
            "ProcessRequestWorkoutFailedAction",
            LogLevel.Error,
            { id: this.workoutId, error: this.error.toString() });
    }
}
