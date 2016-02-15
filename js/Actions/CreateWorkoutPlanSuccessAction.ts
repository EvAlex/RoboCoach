import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";
import {ResponseActionBase} from "./ResponseActionBase";
import CreateWorkoutPlanAction from "./CreateWorkoutPlanAction";

export default class CreateWorkoutPlanSuccessAction extends ResponseActionBase {
    private workoutPlan: IWorkoutPlan;

    constructor(workoutPlan: IWorkoutPlan, request: CreateWorkoutPlanAction) {
        super(request);
        this.workoutPlan = workoutPlan;
    }

    public get WorkoutPlan(): IWorkoutPlan {
        return this.workoutPlan;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(`CreateWorkoutPlanSuccessAction`, LogLevel.Info);
    }
}
