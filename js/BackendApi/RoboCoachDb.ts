
import * as Firebase from "firebase";
import IAction from "./../Actions/IAction";
import dispatcher from "../Dispatcher/Dispatcher";
import WorkoutPlan from "../Models/WorkoutPlan";

import CommonActionCreators from "../ActionCreators/CommonActionCreators";
import RequestWorkoutPlanAction from "../Actions/RequestWorkoutPlanAction";
import ReceiveWorkoutPlanAction from "../Actions/ReceiveWorkoutPlanAction";

import RoboCoachDbError from "../Errors/RoboCoachDbError";

class RoboCoachDb {
    private firebase: Firebase;

    constructor() {
        this.firebase = new Firebase("https://robocoach-dev.firebaseio.com/");
        dispatcher.register((action: IAction) => this.processAction(action));
    }

    private processAction(action: IAction): void {
        if (action instanceof RequestWorkoutPlanAction) {
            this.processRequestWorkoutPlanAction(action);
        }
    }

    public processRequestWorkoutPlanAction(action: RequestWorkoutPlanAction): void {
        this.firebase.child(`WorkoutPlans/${action.PlanId}`)
            .once(
                "value",
                (s: FirebaseDataSnapshot) => {
                    CommonActionCreators.receiveWorkoutPlan(s.val(), action);
                },
                (err: string|Error) => {
                    var error = new RoboCoachDbError(err);
                    CommonActionCreators.receiveWorkoutPlanFail(action.PlanId, error, action); 
                });
    }

}
