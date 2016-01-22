import {ResponseActionBase} from "./ResponseActionBase";
import RequestWorkoutPlanAction from "./RequestWorkoutPlanAction";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class ReceiveWorkoutPlanFailAction extends ResponseActionBase {

    constructor(planId: string, error: IRoboCoachError, requestAction: RequestWorkoutPlanAction) {
        super(requestAction);
        this.planId = planId;
        this.error = error;
    }

    public get PlanId(): string {
        return this.planId;
    }
    private planId: string;

    public get Error(): IRoboCoachError {
        return this.error;
    }
    private error: IRoboCoachError;

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(
            "ReceiveWorkoutPlanFailAction",
            LogLevel.Error,
            { id: this.planId, error: this.error.toString() });
    }
}
