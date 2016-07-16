
import * as Firebase from "firebase";
import * as uuid from "node-uuid";
const config: IRoboCoachConfig = require("RoboCoachConfig");
import IAction from "./../Actions/IAction";
import dispatcher from "../Dispatcher/Dispatcher";
import WorkoutPlan from "../Models/WorkoutPlan";
import AggregateConverter from "../Models/Firebase/AggregateConverter";

import CommonActionCreators from "../ActionCreators/CommonActionCreators";
import RequestWorkoutPlansAction from "../Actions/RequestWorkoutPlansAction";
import RequestWorkoutPlanAction from "../Actions/RequestWorkoutPlanAction";
import CreateWorkoutPlanAction  from "../Actions/CreateWorkoutPlanAction";
import * as WorkoutPlanActions from "../Actions/WorkoutPlanActions.ts";
import StartWorkoutAction from "../Actions/StartWorkoutAction";
import RequestWorkoutAction from "../Actions/RequestWorkoutAction";
import * as AuthActions from "../Actions/AuthActions";

import RoboCoachDbError from "../Errors/RoboCoachDbError";

export class RoboCoachDb {
    private firebaseApp: Firebase.FirebaseApplication;
    private converter: AggregateConverter;
    private testWorkoutPlans: WorkoutPlan[];

    constructor() {
        this.firebaseApp = Firebase.initializeApp(config.firebase);

        this.converter = new AggregateConverter();
        dispatcher.register((action: IAction) => this.processAction(action));

        this.handleAuth();

        this.testWorkoutPlans = this.createTestWorkoutPlans();
    }

    public get Dispatcher(): Flux.Dispatcher<IAction> {
        return dispatcher;
    }

    private handleAuth(): void {
        var auth = this.firebaseApp.auth();
        auth.onAuthStateChanged(user => {
            if (dispatcher.isDispatching) {
                window.setTimeout(() => this.onAuthChanged(user));
            } else {
                this.onAuthChanged(user);
            }
        });
    }

    private onAuthChanged(user: Firebase.User): void {
        if (user) {
            dispatcher.dispatch(new AuthActions.ProcessUserLoggedInAction(user));
        } else {
            dispatcher.dispatch(new AuthActions.ProcessUserLoggedOutAction());
        }
    }

    private processAction(action: IAction): void {
        if (action instanceof RequestWorkoutPlansAction) {
            this.processRequestWorkoutPlansAction(action);
        } else if (action instanceof RequestWorkoutPlanAction) {
            this.processRequestWorkoutPlanAction(action);
        } else if (action instanceof CreateWorkoutPlanAction) {
            this.processCreateWorkoutPlanAction(action);
        } else if (action instanceof WorkoutPlanActions.EditWorkoutPlanAction) {
            this.processEditWorkoutPlanAction(action);
        } else if (action instanceof StartWorkoutAction) {
            this.processStartWorkoutAction(action);
        } else if (action instanceof RequestWorkoutAction) {
            this.processRequestWorkoutAction(action);
        } else if (action instanceof AuthActions.LogInAction) {
            this.processLogInAction(action);
        } else if (action instanceof AuthActions.LogOutAction) {
            this.firebaseApp.auth()
                .signOut()
                .then(
                () => dispatcher.dispatch(new AuthActions.ProcessUserLoggedOutAction()),
                e => dispatcher.dispatch(new AuthActions.ProcessUserLogoutFailedAction(action, e)));
        }
    }

    private processRequestWorkoutPlansAction(action: RequestWorkoutPlansAction): void {
        this.firebaseApp.database().ref().child("workoutPlans").once(
            "value",
            dataSnapshot => {
                let response: IWorkoutPlan[] = [],
                    obj: any = dataSnapshot.val();
                if (obj) {
                    for (let f in obj) {
                        if (obj.hasOwnProperty(f)) {
                            response.push(this.converter.WorkoutPlan.fromFirebase(obj[f], f));
                        }
                    }
                }
                CommonActionCreators.receiveWorkoutPlans(response, action);
            });
        // console.warn("WARNING! Mock Workout Plans in RoboCoachDb.");
        // window.setTimeout(() => CommonActionCreators.receiveWorkoutPlans(this.testWorkoutPlans.slice(), action));
    }

    private processRequestWorkoutPlanAction(action: RequestWorkoutPlanAction): void {
        /*
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
        */
        this.firebaseApp.database().ref().child(`workoutPlans/${action.PlanId}`)
            .once("value")
            .then(
            (s: firebase.DataSnapshot) => {
                if (s.exists()) {
                    CommonActionCreators.receiveWorkoutPlan(this.converter.WorkoutPlan.fromFirebase(s.val(), action.PlanId), action);
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
            }
            );
    }

    private processCreateWorkoutPlanAction(action: CreateWorkoutPlanAction): void {
        var pushRef = this.firebaseApp.database().ref().child("workoutPlans").push(),
            model: IFirebaseWorkoutPlan = this.converter.WorkoutPlan.toFirebase(action.Plan);
        action.Plan.id = pushRef.key;
        pushRef.set(model, error => {
            if (error) {
                CommonActionCreators.createWorkoutPlanFailed(
                    new RoboCoachDbError(error),
                    action);
            } else {
                CommonActionCreators.createWorkoutPlanSucceeded(action.Plan, action);
            }
        });
        /*
        action.Plan.id = this.testWorkoutPlans[this.testWorkoutPlans.length - 1].id;
        action.Plan.id = action.Plan.id + "1";
        this.testWorkoutPlans.push(action.Plan);
        window.setTimeout(() => CommonActionCreators.createWorkoutPlanSucceeded(action.Plan, action));
        */
    }

    private processEditWorkoutPlanAction(action: WorkoutPlanActions.EditWorkoutPlanAction): void {
        var ref = this.firebaseApp.database().ref().child(`workoutPlans/${action.Plan.id}`),
            model: IFirebaseWorkoutPlan = this.converter.WorkoutPlan.toFirebase(action.Plan);
        ref.set(model, error => {
            if (error) {
                dispatcher.dispatch(
                    new WorkoutPlanActions.ProcessEditWorkoutPlanFailAction(
                        new RoboCoachDbError(error),
                        action));
            } else {
                dispatcher.dispatch(
                    new WorkoutPlanActions.ProcessEditWorkoutPlanSuccessAction(action.Plan, action));
            }
        });
    }

    private processStartWorkoutAction(action: StartWorkoutAction): void {
        var workout: IWorkout = {
            id: null,
            planName: action.WorkoutPlan.name,
            planDescription: action.WorkoutPlan.description,
            actions: action.WorkoutPlan.actions,
            startTime: new Date()
        };
        if (action.User) {
            var pushRef = this.firebaseApp.database().ref().child(`users/${action.User.id}/workouts`).push(),
                model: IFirebaseWorkout = this.converter.Workout.toFirebase(workout);
            workout.id = pushRef.key;
            pushRef.set(model, error => {
                if (error) {
                    CommonActionCreators.processWorkoutStartFailed(
                        new RoboCoachDbError(error),
                        action);
                } else {
                    CommonActionCreators.processWorkoutStarted(workout, action);
                }
            });
        } else {
            workout.id = uuid.v4();
            window.setTimeout(() => CommonActionCreators.processWorkoutStarted(workout, action));
        }
    }

    private processRequestWorkoutAction(action: RequestWorkoutAction): void {
        this.firebaseApp.database().ref()
            .child(`users/${action.User.id}/workouts/${action.WorkoutId}`)
            .once("value")
            .then(
            dataSnapshot => {
                if (dataSnapshot.exists()) {
                    CommonActionCreators.receiveWorkout(dataSnapshot.val(), action);
                } else {
                    CommonActionCreators.processRequestWorkoutFailed(
                        new RoboCoachDbError(`Workout with id = ${action.WorkoutId} not found.`),
                        action);
                }
            },
            error => {
                CommonActionCreators.processRequestWorkoutFailed(
                    new RoboCoachDbError(error),
                    action);
            }
            );
    }

    private processLogInAction(action: AuthActions.LogInAction): void {
        var auth = this.firebaseApp.auth(),
            provider: Firebase.AuthProvider = action.getProvider() === AuthActions.AuthProvider.Facebook
                ? new firebase.auth.FacebookAuthProvider()
                : action.getProvider() === AuthActions.AuthProvider.Google
                    ? new firebase.auth.GoogleAuthProvider()
                    : action.getProvider() === AuthActions.AuthProvider.Github
                        ? new firebase.auth.GithubAuthProider()
                        : action.getProvider() === AuthActions.AuthProvider.Twitter
                            ? new firebase.auth.TwitterAuthProvider()
                            : null;
        if (!provider) {
            throw new RoboCoachDbError(`Unknown AuthProvider: ${action.getProvider()}.`);
        }

        // Prefer pop-ups, so we don't navigate away from the page
        auth.signInWithPopup(provider).then(
            user => {
                if (user) {
                    // User authenticated with Firebase
                    // No need to dispatch - Firebase will emit event for us.
                }
            },
            error => {
                if (error.code === "auth/operation-not-supported-in-this-environment") {
                    /* Fall-back to browser redirects, and pick up the session
                       automatically when we come back to the origin page */
                    auth.signInWithRedirect(provider).catch(error => {
                        dispatcher.dispatch(
                            new AuthActions.ProcessLogInFailedAction(
                                action,
                                new RoboCoachDbError(error)));
                    });
                } else {
                    dispatcher.dispatch(
                        new AuthActions.ProcessLogInFailedAction(
                            action,
                            new RoboCoachDbError(error)));
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

        plan = new WorkoutPlan();
        plan.id = "-JRHTHaKuITFIhnj02FG";
        plan.name = "7 минут на фитнес - красная 24, 25";
        plan.actions = [
            { duration: 15000 },
            { duration: 30000, exercise: { name: "Паучьи отжимания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Приседания с выпрыгиванием" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Шаги на руках" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Прыжки ноги вместе - ноги врозь" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Велосипед" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Обратные отжимания с поворотом" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Выпад-реверанс" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Бег в упоре лёжа" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Диагональные скручивания с подъёмом ног" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Бой с тенью" } },
            { duration: 60000 },
            { duration: 30000, exercise: { name: "Шаги на руках" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Спринт на месте" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Гиперэкстензия на полу" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Выпады с наклонами" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Круги на скорость" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Приседания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Велосипед" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Сёрферские выпрыгивания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Прыжки ноги вместе - ноги врозь" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Обратные отжамания с поворотом" } },
            { duration: 10000 },
        ];
        res.push(plan);

        plan = new WorkoutPlan();
        plan.id = "-JRHTHaKuITFIhnj02HE";
        plan.name = "7 минут на фитнес - красная 12, 16";
        plan.actions = [
            { duration: 15000 },
            { duration: 30000, exercise: { name: "Приседания с выпрыгиванием" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Планка" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Круги на скорость" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Планка с отжиманием" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Бег в упоре лёжа" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Выпад-реверанс" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Плавание" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Сёрферские выпрыгивания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Прыжки ноги вместе - ноги врозь" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Касания носков" } },
            { duration: 60000 },
            { duration: 30000, exercise: { name: "Бег в упоре лёжа" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Выпады в прыжке" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Планка" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Прыжки ноги вместе - ноги врозь" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Отжимания волной" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Двойные скручивания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Приседания из упора лёжа" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Боковые выпады" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Отжимания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Бой с тенью" } },
            { duration: 10000 },
        ];
        res.push(plan);

        plan = new WorkoutPlan();
        plan.id = "-JRHTHaKuITFIhnjWeRG";
        plan.name = "7 минут на фитнес - красная 9";
        plan.actions = [
            { duration: 15000 },
            { duration: 30000, exercise: { name: "Планка с отжиманием" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Диагональные выпады" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Круги на скорость" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Выпады с наклонами" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Скручивания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Отжимания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Выпады в прыжке" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Берми" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Ножницы" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Приседания" } },
            { duration: 60000 },
            { duration: 30000, exercise: { name: "Планка с отжиманием" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Диагональные выпады" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Круги на скорость" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Выпады с наклонами" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Скручивания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Отжимания" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Выпады в прыжке" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Берми" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Ножницы" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Приседания" } },
            { duration: 10000 },
        ];
        res.push(plan);

        return res;
    }

}

export default new RoboCoachDb();
