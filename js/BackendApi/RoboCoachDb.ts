
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
                var ex: IExercise = a["exercise"],
                    exCopy: IExercise = ex
                        ? { name: ex.name }
                        : null;
                return exCopy
                    ? { duration: a.duration, exercise: exCopy }
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
            { duration: 30000, exercise: { name: "Бой с тенью" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Выпады" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Приседания в упоре лёжа" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Велосипед" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Отжимания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Спринт на месте" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Берпи" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Бег по кругу" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Планка с отжиманиями" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Супермен со сменой сторон" } },
            { duration: 10000 },
        ];
        res.push(plan);

        plan = new WorkoutPlan();
        plan.id = "-JRHTHaKuITFIhnj02kE";
        plan.name = "Отжимания по 10 секунд";
        plan.actions = [
            { duration: 15000 },
            { duration: 10000, exercise: { name: "Отжимания" } },
            { duration: 10000 },
            { duration: 10000, exercise: { name: "Суперузкие отжимания" } },
            { duration: 10000 },
            { duration: 10000, exercise: { name: "Широкие отжимания" } },
            { duration: 10000 },
            { duration: 10000, exercise: { name: "Узкие отжимания" } },
            { duration: 10000 },
            { duration: 10000, exercise: { name: "Лизарды" } },
            { duration: 2000 },
            { duration: 10000, exercise: { name: "Лизарды" } },
            { duration: 60000 },
            { duration: 10000, exercise: { name: "Отжимания" } },
            { duration: 10000 },
            { duration: 10000, exercise: { name: "Суперузкие отжимания" } },
            { duration: 10000 },
            { duration: 10000, exercise: { name: "Широкие отжимания" } },
            { duration: 10000 },
            { duration: 10000, exercise: { name: "Узкие отжимания" } },
            { duration: 10000 },
            { duration: 10000, exercise: { name: "Лизарды" } },
            { duration: 2000 },
            { duration: 10000, exercise: { name: "Лизарды" } },
            { duration: 60000 },
            { duration: 10000, exercise: { name: "Отжимания" } },
            { duration: 10000 },
            { duration: 10000, exercise: { name: "Суперузкие отжимания" } },
            { duration: 10000 },
            { duration: 10000, exercise: { name: "Широкие отжимания" } },
            { duration: 10000 },
            { duration: 10000, exercise: { name: "Узкие отжимания" } },
            { duration: 10000 },
            { duration: 10000, exercise: { name: "Лизарды" } },
            { duration: 2000 },
            { duration: 10000, exercise: { name: "Лизарды" } },
            { duration: 60000 },
        ];
        res.push(plan);

        plan = new WorkoutPlan();
        plan.id = "-JRHTHaKuITFIhnj02kW";
        plan.name = "7 минут на фитнес - красная 17, 18";
        plan.actions = [
            { duration: 15000 },
            { duration: 30000, exercise: { name: "Выпады" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "С десяти до двух" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Берпи" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Гиперэкстензия на полу" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Шаги на руках" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Обратный выпад с поворотом" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Отжимания с поворотом" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Бег в упоре лёжа" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Бой с тенью" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Двойные скручивания" } },
            { duration: 60000 },
            { duration: 30000, exercise: { name: "Прыжки ноги вместе - ноги врозь" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Приседания с выпрыгиванием" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Бег в упоре лёжа" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "С десяти до двух" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Берпи" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Отжимания волной" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Бой с тенью" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Выпад-реверанс" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Сёрферские выпрыгивания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Плавание" } },
        ];
        res.push(plan);

        plan = new WorkoutPlan();
        plan.id = "-JRHTHaKuITFIhnj02kQ";
        plan.name = "7 минут на фитнес - красная 19, 20";
        plan.actions = [
            { duration: 15000 },
            { duration: 30000, exercise: { name: "Плавание" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Приседания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Бег в упоре лёжа" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Бой с тенью" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Касания носков" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Отжимания вниз головой" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Прыжки конькобежца" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Сёрферские выпрыгивания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Планка" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Прыжки ноги вместе - ноги врозь" } },
            { duration: 60000 },
            { duration: 30000, exercise: { name: "Приседания из упора лёжа" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Берпи" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Отжимания волной" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Прыжки ноги вместе - ноги врозь" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Сёрферские выпрыгивания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Прыжки конькобежца" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Супермен со сменой сторон" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Круги на скорость" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Бой с тенью" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Отжимания" } },
        ];
        res.push(plan);

        return res;
    }

}

export default new RoboCoachDb();
