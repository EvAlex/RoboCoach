import {ActionBase} from "./ActionBase";
import {ActionLogEntry} from "../Log/ActionLogEntry";

export default class CreateWorkoutPlanAction extends ActionBase {
    private workoutPlan: IWorkoutPlan;

    constructor(workoutPlan: IWorkoutPlan) {
        super();
        this.workoutPlan = workoutPlan;
    }

    public get Plan(): IWorkoutPlan {
        return this.workoutPlan;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(`CreateWorkoutPlanAction`);
    }
}
