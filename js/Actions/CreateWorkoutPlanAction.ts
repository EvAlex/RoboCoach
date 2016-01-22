import {ActionBase} from "./ActionBase";
import {ActionLogEntry} from "../Log/ActionLogEntry";
import WorkoutPlan from "../Models/WorkoutPlan";

export default class CreateWorkoutPlanAction extends ActionBase {
    private workoutPlan: WorkoutPlan;

    constructor(workoutPlan: WorkoutPlan) {
        super();
        this.workoutPlan = workoutPlan;
    }

    public get Plan(): WorkoutPlan {
        return this.workoutPlan;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(`RequestWorkoutPlansAction`);
    }
}
