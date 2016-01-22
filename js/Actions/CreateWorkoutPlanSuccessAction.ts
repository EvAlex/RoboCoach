import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";
import {ResponseActionBase} from "./ResponseActionBase";
import CreateWorkoutPlanAction from "./CreateWorkoutPlanAction";
import WorkoutPlan from "../Models/WorkoutPlan";

export default class CreateWorkoutPlanSuccessAction extends ResponseActionBase {
    private workoutPlan: WorkoutPlan;

    constructor(workoutPlan: WorkoutPlan, request: CreateWorkoutPlanAction) {
        super(request);
        this.workoutPlan = workoutPlan;
    }

    public get WorkoutPlan(): WorkoutPlan {
        return this.workoutPlan;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(`CreateWorkoutPlanSuccessAction`, LogLevel.Info);
    }
}
