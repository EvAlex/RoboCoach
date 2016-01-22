import {ResponseActionBase} from "./ResponseActionBase";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry"
import StartWorkoutAction from "./StartWorkoutAction";

export default class ProcessWorkoutStartedAction extends ResponseActionBase {
    private workout: IWorkout;

    constructor(workout: IWorkout, requestAction: StartWorkoutAction) {
        super(requestAction);
        this.workout = workout;
    }

    public get Workout(): IWorkout {
        return this.workout;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry("ProcessWorkoutStartedAction", LogLevel.Info, { id: this.workout.id });
    }
}
