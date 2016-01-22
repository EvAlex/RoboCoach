import {ActionBase} from "./ActionBase";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class RequestWorkoutPlanAction extends ActionBase {

    constructor(planId: string) {
        super();
        this.planId = planId;
    }

    public get PlanId(): string {
        return this.planId;
    }
    private planId: string;

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry("RequestWorkoutPlanAction", LogLevel.Info, { planId: this.planId });
    }
}
