import {ActionBase} from "./ActionBase";
import ActionLogEntry from "../Log/ActionLogEntry";
import WorkoutPlan from "../Models/WorkoutPlan";

export default class StartWorkoutAction extends ActionBase {
    private workoutPlan: WorkoutPlan;

    constructor(workoutPlan: WorkoutPlan) {
        super();
        this.workoutPlan = workoutPlan;
    }

    public get WorkoutPlan(): WorkoutPlan {
        return this.workoutPlan;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry("StartWorkoutAction");
    }
}
