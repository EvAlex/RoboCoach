import IAction from "./../Actions/IAction";
import dispatcher from "../Dispatcher/Dispatcher";
import ReceiveWorkoutPlansAction from "../Actions/ReceiveWorkoutPlansAction";
import ReceiveWorkoutPlanAction from "../Actions/ReceiveWorkoutPlanAction";
import CreateWorkoutPlanSuccessAction from "../Actions/CreateWorkoutPlanSuccessAction";
import WorkoutPlan from "../Models/WorkoutPlan";
import BaseStore from "./BaseStore";

export class WorkoutPlansStore extends BaseStore {
    private plans: IWorkoutPlan[] = [];

    constructor() {
        super();
        dispatcher.register((action: IAction) => this.processActions(action));
    }

    public getWorkoutPlans(): IWorkoutPlan[] {
        return this.plans.slice();
    }

    public findWorkoutPlan(planId: string): IWorkoutPlan {
        return this.plans.filter((p: WorkoutPlan) => p.id === planId)[0] || null;
    }

    private processActions(action: IAction): void {
        if (action instanceof ReceiveWorkoutPlansAction) {
            this.plans = action.Plans;
            this.emitChange();
        } else if (action instanceof ReceiveWorkoutPlanAction) {
            this.processReceiveWorkoutPlanAction(action);
        } else if (action instanceof CreateWorkoutPlanSuccessAction) {
            if (!this.plans.some(p => p.id === action.WorkoutPlan.id)) {
                this.plans.push(action.WorkoutPlan);
                this.emitChange();
            } else {
                console.log("====> already there");
            }
        }
    }

    private processReceiveWorkoutPlanAction(action: ReceiveWorkoutPlanAction): void {
        var match: IWorkoutPlan = this.plans.filter((p: WorkoutPlan) => p.id === action.Plan.id)[0];
        if (match) {
            this.plans[this.plans.indexOf(match)] = action.Plan;
        } else {
            this.plans.push(action.Plan);
        }
        this.emitChange();
    }

}

export default new WorkoutPlansStore();
