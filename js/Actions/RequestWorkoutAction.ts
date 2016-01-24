import {ActionBase} from "./ActionBase";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class RequestWorkoutAction extends ActionBase {

    constructor(workoutId: string) {
        super();
        this.workoutId = workoutId;
    }

    public get WorkoutId(): string {
        return this.workoutId;
    }
    private workoutId: string;

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry("RequestWorkoutAction", LogLevel.Info, { workoutId: this.workoutId });
    }
}
