
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
    private testWorkoutPlans: WorkoutPlan[];

    constructor() {
        this.firebase = new Firebase("https://robocoach-dev.firebaseio.com/");
        dispatcher.register((action: IAction) => this.processAction(action));
        this.testWorkoutPlans = this.createTestWorkoutPlans();
    }

    private processAction(action: IAction): void {
        if (action instanceof RequestWorkoutPlanAction) {
            this.processRequestWorkoutPlanAction(action);
        }
    }

    public processRequestWorkoutPlanAction(action: RequestWorkoutPlanAction): void {
        console.warn("WARNING! Mock Workout plan in RoboCoachDb.");
        var plan: WorkoutPlan = this.testWorkoutPlans.filter(p => p.id == action.PlanId)[0];
        if (plan) {
            CommonActionCreators.receiveWorkoutPlan(plan, action);
        } else {
            CommonActionCreators.receiveWorkoutPlanFail(action.PlanId, new RoboCoachDbError("Workout plan with specified id not found"), action);
        }
        this.firebase.child(`WorkoutPlans/${action.PlanId}`)
            .once(
            "value",
            (s: FirebaseDataSnapshot) => {
                CommonActionCreators.receiveWorkoutPlan(s.val(), action);
            },
            (err: string | Error) => {
                var error = new RoboCoachDbError(err);
                CommonActionCreators.receiveWorkoutPlanFail(action.PlanId, error, action);
            });
    }

    private createTestWorkoutPlans(): WorkoutPlan[] {
        var res: WorkoutPlan[] = [];

        var plan: WorkoutPlan = new WorkoutPlan();
        plan.id = "-JRHTHaIs-jNPLXOQivY";
        plan.name = "7 Минут на фитнес - Красный 5";
        plan.actions = [
            { duration: 30000, excercise: { name: "Бой с тенью" } },
            { duration: 10000 },
            { duration: 30000, excercise: { name: "Выпады" } },
            { duration: 10000 },
            { duration: 30000, excercise: { name: "Приседания в упоре лёжа" } },
            { duration: 10000 },
            { duration: 30000, excercise: { name: "Велосипед" } },
            { duration: 10000 },
            { duration: 30000, excercise: { name: "Отжимания" } },
            { duration: 10000 },
            { duration: 30000, excercise: { name: "Спринт на месте" } },
            { duration: 10000 },
            { duration: 30000, excercise: { name: "Берпи" } },
            { duration: 10000 },
            { duration: 30000, excercise: { name: "Бег по кругу" } },
            { duration: 10000 },
            { duration: 30000, excercise: { name: "Планка с отжиманиями" } },
            { duration: 10000 },
            { duration: 30000, excercise: { name: "Супермен со сменой сторон" } },
            { duration: 10000 },
        ];
        res.push(plan);

        plan = new WorkoutPlan();
        plan.id = "-JRHTHaKuITFIhnj02kE";
        plan.name = "Отжимания по 10 секунд";
        plan.actions = [
            { duration: 10000, excercise: "Отжимания" },
            { duration: 10000 },
            { duration: 10000, excercise: "Суперузкие отжимания" },
            { duration: 10000 },
            { duration: 10000, excercise: "Широкие отжимания" },
            { duration: 10000 },
            { duration: 10000, excercise: "Узкие отжимания" },
            { duration: 10000 },
            { duration: 10000, excercise: "Отжимания" },
            { duration: 10000 },
            { duration: 10000, excercise: "Лизарды" },
            { duration: 2000 },
            { duration: 10000, excercise: "Лизарды" },
            { duration: 10000 },
        ];

        return res;
    }

}
