import IAction from "./../Actions/IAction";
import dispatcher from "../Dispatcher/Dispatcher";
import ReceiveWorkoutPlansAction from "../Actions/ReceiveWorkoutPlansAction";
import ReceiveWorkoutPlanAction from "../Actions/ReceiveWorkoutPlanAction";
import WorkoutPlan from "../Models/WorkoutPlan";
import BaseStore from "./BaseStore";

export class WorkoutPlansStore extends BaseStore {
    private plans: WorkoutPlan[] = [];

    constructor() {
        super();
        dispatcher.register((action: IAction) => this.processActions(action));
    }

    public getWorkoutPlans(): WorkoutPlan[] {
        return this.plans;
    }

    public findWorkoutPlan(planId: string): WorkoutPlan {
        return this.plans.filter((p: WorkoutPlan) => p.id === planId)[0] || null;
    }

    private processActions(action: IAction): void {
        if (action instanceof ReceiveWorkoutPlansAction) {
            this.plans = action.Plans;
            this.emitChange();
        } else if (action instanceof ReceiveWorkoutPlanAction) {
            this.processReceiveWorkoutPlanAction(action);
        }
    }

    private processReceiveWorkoutPlanAction(action: ReceiveWorkoutPlanAction): void {
        var match: WorkoutPlan = this.plans.filter((p: WorkoutPlan) => p.id === action.Plan.id)[0];
        if (match) {
            this.plans[this.plans.indexOf(match)] = action.Plan;
        } else {
            this.plans.push(action.Plan);
        }
        this.emitChange();
    }

}

export default new WorkoutPlansStore();
