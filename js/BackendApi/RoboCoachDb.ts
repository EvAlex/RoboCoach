
import * as Firebase from "firebase";
import IAction from "./../Actions/IAction";
import Dispatcher from "../Dispatcher/Dispatcher";
import WorkoutPlan from "../Models/WorkoutPlan";

import CommonActionCreators from "../ActionCreators/CommonActionCreators";
import RequestWorkoutPlansAction from "../Actions/RequestWorkoutPlansAction";
import RequestWorkoutPlanAction from "../Actions/RequestWorkoutPlanAction";
import CreateWorkoutPlanAction  from "../Actions/CreateWorkoutPlanAction";
import StartWorkoutAction from "../Actions/StartWorkoutAction";
import RequestWorkoutAction from "../Actions/RequestWorkoutAction";

import RoboCoachDbError from "../Errors/RoboCoachDbError";

export class RoboCoachDb {
    private firebase: Firebase;
    private testWorkoutPlans: WorkoutPlan[];
    private testWorkouts: IWorkout[];

    constructor() {
        this.firebase = new Firebase("https://robocoach-dev.firebaseio.com/");
        Dispatcher.register((action: IAction) => this.processAction(action));
        this.testWorkoutPlans = this.createTestWorkoutPlans();
        this.testWorkouts = [];
    }

    private processAction(action: IAction): void {
        if (action instanceof RequestWorkoutPlansAction) {
            this.processRequestWorkoutPlansAction(action);
        } else if (action instanceof RequestWorkoutPlanAction) {
            this.processRequestWorkoutPlanAction(action);
        } else if (action instanceof CreateWorkoutPlanAction) {
            this.processCreateWorkoutPlanAction(action);
        } else if (action instanceof StartWorkoutAction) {
            this.processStartWorkoutAction(action);
        } else if (action instanceof RequestWorkoutAction) {
            this.processRequestWorkoutAction(action);
        }
    }

    private processRequestWorkoutPlansAction(action: RequestWorkoutPlansAction): void {
        console.warn("WARNING! Mock Workout Plans in RoboCoachDb.");
        window.setTimeout(() => CommonActionCreators.receiveWorkoutPlans(this.testWorkoutPlans.slice(), action));
    }

    private processRequestWorkoutPlanAction(action: RequestWorkoutPlanAction): void {
        console.warn("WARNING! Mock Workout plan in RoboCoachDb.");
        var plan: WorkoutPlan = this.testWorkoutPlans.filter(p => p.id === action.PlanId)[0];
        if (plan) {
            window.setTimeout(() => CommonActionCreators.receiveWorkoutPlan(plan, action));
        } else {
            window.setTimeout(() => CommonActionCreators.receiveWorkoutPlanFail(
                action.PlanId,
                new RoboCoachDbError("Workout plan with specified id not found"),
                action));
        }
        /*
        this.firebase.child(`WorkoutPlans/${action.PlanId}`)
            .once(
            "value",
            (s: FirebaseDataSnapshot) => {
                if (s.val()) {
                    CommonActionCreators.receiveWorkoutPlan(s.val(), action);
                } else {
                    CommonActionCreators.receiveWorkoutPlanFail(
                        action.PlanId,
                        new RoboCoachDbError("Workout plan with specified id not found"),
                        action);
                }
            },
            (err: string | Error) => {
                var error: RoboCoachDbError = new RoboCoachDbError(err);
                CommonActionCreators.receiveWorkoutPlanFail(action.PlanId, error, action);
            });
            */
    }

    private processCreateWorkoutPlanAction(action: CreateWorkoutPlanAction): void {
        action.Plan.id = this.testWorkoutPlans[this.testWorkoutPlans.length - 1].id;
        action.Plan.id = action.Plan.id + "1";
        this.testWorkoutPlans.push(action.Plan);
        window.setTimeout(() => CommonActionCreators.createWorkoutPlanSucceeded(action.Plan, action));
    }

    private processStartWorkoutAction(action: StartWorkoutAction): void {
        var workout: IWorkout = {
            id: action.WorkoutPlan.id + "w",
            planName: action.WorkoutPlan.name,
            planDescription: action.WorkoutPlan.description,
            actions: action.WorkoutPlan.actions.map(a => {
                var ex: IExcercise = a["excercise"],
                    exCopy: IExcercise = ex
                        ? { name: ex.name }
                        : null;
                return exCopy
                    ? { duration: a.duration, excercise: exCopy }
                    : { duration: a.duration };
            }),
            startTime: new Date()
        };
        this.testWorkouts.push(workout);
        window.setTimeout(() => CommonActionCreators.processWorkoutStarted(workout, action));
    }

    private processRequestWorkoutAction(action: RequestWorkoutAction): void {
        var workout: IWorkout = this.testWorkouts.filter(w => w.id === action.WorkoutId)[0];
        window.setTimeout(() => {
            if (workout) {
                CommonActionCreators.receiveWorkout(workout, action);
            } else {
                CommonActionCreators.processRequestWorkoutFailed(
                    new RoboCoachDbError(`Workout with id = ${action.WorkoutId} not found.`),
                    action);
            }
        });
    }

    private createTestWorkoutPlans(): WorkoutPlan[] {
        var res: WorkoutPlan[] = [];

        var plan: WorkoutPlan = new WorkoutPlan();
        plan.id = "-JRHTHaIs-jNPLXOQivY";
        plan.name = "7 Минут на фитнес - Красный 5";
        plan.actions = [
            { duration: 15000 },
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
            { duration: 15000 },
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
        res.push(plan);

        return res;
    }

}

export default new RoboCoachDb();
