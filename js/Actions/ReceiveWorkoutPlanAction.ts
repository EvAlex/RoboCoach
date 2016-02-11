import {ResponseActionBase} from "./ResponseActionBase";
import RequestWorkoutPlanAction from "./RequestWorkoutPlanAction";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class ReceiveWorkoutPlanAction extends ResponseActionBase {

    constructor(plan: IWorkoutPlan, requestAction: RequestWorkoutPlanAction) {
        super(requestAction);
        this.plan = plan;
    }

    public get Plan(): IWorkoutPlan {
        return this.plan;
    }
    private plan: IWorkoutPlan;

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry("ReceiveWorkoutPlanAction", LogLevel.Info, { planId: this.plan.id });
    }
}
