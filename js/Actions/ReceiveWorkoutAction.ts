import {ResponseActionBase} from "./ResponseActionBase";
import RequestWorkoutAction from "./RequestWorkoutAction";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class ReceiveWorkoutAction extends ResponseActionBase {

    constructor(workout: IWorkout, requestAction: RequestWorkoutAction) {
        super(requestAction);
        this.workout = workout;
    }

    public get Workout(): IWorkout {
        return this.workout;
    }
    private workout: IWorkout;

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry("ReceiveWorkoutAction", LogLevel.Info, { workout: this.workout.id });
    }
}
