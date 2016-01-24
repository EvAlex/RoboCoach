import {ActionBase} from "./ActionBase";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class StartWorkoutAction extends ActionBase {
    private workoutPlan: IWorkoutPlan;

    constructor(workoutPlan: IWorkoutPlan) {
        super();
        this.workoutPlan = workoutPlan;
    }

    public get WorkoutPlan(): IWorkoutPlan {
        return this.workoutPlan;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry("StartWorkoutAction", LogLevel.Info, { planId: this.workoutPlan.id });
    }
}
