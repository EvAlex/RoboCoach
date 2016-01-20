import {ResponseActionBase} from "./ResponseActionBase";
import RequestWorkoutPlansAction from "./RequestWorkoutPlansAction";
import ActionLogEntry from "../Log/ActionLogEntry";
import WorkoutPlan from "../Models/WorkoutPlan";

export default class ReceiveWorkoutPlansAction extends ResponseActionBase {

    constructor(plans: WorkoutPlan[], requestAction: RequestWorkoutPlansAction) {
        super(requestAction);
        this.plans = plans;
    }

    public get Plans(): WorkoutPlan[] {
        return this.plans;
    }
    private plans: WorkoutPlan[];

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(`ReceiveWorkoutPlansAction`);
    }
}
