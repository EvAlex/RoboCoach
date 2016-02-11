import {ResponseActionBase} from "./ResponseActionBase";
import RequestWorkoutPlansAction from "./RequestWorkoutPlansAction";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class ReceiveWorkoutPlansAction extends ResponseActionBase {

    constructor(plans: IWorkoutPlan[], requestAction: RequestWorkoutPlansAction) {
        super(requestAction);
        this.plans = plans;
    }

    public get Plans(): IWorkoutPlan[] {
        return this.plans;
    }
    private plans: IWorkoutPlan[];

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(`ReceiveWorkoutPlansAction`, LogLevel.Info);
    }
}
