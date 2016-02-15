import {ActionBase} from "./ActionBase";
import {ResponseActionBase} from "./ResponseActionBase";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export class EditWorkoutPlanAction extends ActionBase {
    private workoutPlan: IWorkoutPlan;

    constructor(workoutPlan: IWorkoutPlan) {
        super();
        this.workoutPlan = workoutPlan;
    }

    public get Plan(): IWorkoutPlan {
        return this.workoutPlan;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(`EditWorkoutPlanAction`);
    }
}

export class ProcessEditWorkoutPlanSuccessAction extends ResponseActionBase {
    private workoutPlan: IWorkoutPlan;

    constructor(workoutPlan: IWorkoutPlan, request: EditWorkoutPlanAction) {
        super(request);
        this.workoutPlan = workoutPlan;
    }

    public get WorkoutPlan(): IWorkoutPlan {
        return this.workoutPlan;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(`ProcessEditWorkoutPlanSuccessAction`, LogLevel.Info);
    }
}

export class ProcessEditWorkoutPlanFailAction extends ResponseActionBase {
    private error: IRoboCoachError;

    constructor(error: IRoboCoachError, request: EditWorkoutPlanAction) {
        super(request);
        this.error = error;
    }

    public get Error(): IRoboCoachError {
        return this.error;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(`ProcessEditWorkoutPlanFailAction`, LogLevel.Error, { error: this.error.toString() });
    }
}
