import {ResponseActionBase} from "./ResponseActionBase";
import RequestWorkoutPlanAction from "./RequestWorkoutPlanAction";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";
import WorkoutPlan from "../Models/WorkoutPlan";

export default class ReceiveWorkoutPlanAction extends ResponseActionBase {

    constructor(plan: WorkoutPlan, requestAction: RequestWorkoutPlanAction) {
        super(requestAction);
        this.plan = plan;
    }

    public get Plan(): WorkoutPlan {
        return this.plan;
    }
    private plan: WorkoutPlan;

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry("ReceiveWorkoutPlanAction", LogLevel.Info, { planId: this.plan.id });
    }
}
