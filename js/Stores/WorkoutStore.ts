import IAction from "./../Actions/IAction";
import dispatcher from "../Dispatcher/Dispatcher";
import AppLoadedAction from "../Actions/AppLoadedAction";
import WorkoutStatus from "../Models/WorkoutStatus";
import WorkoutPlan from "../Models/WorkoutPlan";
import BaseStore from "./BaseStore";

export enum CurrentWorkoutStatus {
    Loading,
    LoadFailed,
    NotStarted,
    Started,
    Finished
}

export enum LoadStatus {
    Loading,
    Loaded,
    LoadFailed
}

interface ICurrentWorkout {
    status: WorkoutStatus;
    plan: WorkoutPlan;
}

export class WorkoutStore extends BaseStore {
    private currentWorkout: ICurrentWorkout = { status: null, plan: null };
    private currentWorkoutLoadStatus: LoadStatus = LoadStatus.Loading;

    constructor() {
        super();
        dispatcher.register((action: IAction) => this.processActions(action));
    }

    public getCurrentWorkoutStatus(): CurrentWorkoutStatus {
        var res: CurrentWorkoutStatus;
        if (this.currentWorkoutLoadStatus === LoadStatus.Loading) {
            res = CurrentWorkoutStatus.Loading;
        } else if (this.currentWorkoutLoadStatus === LoadStatus.LoadFailed) {
            res = CurrentWorkoutStatus.LoadFailed;
        } else if (this.currentWorkoutLoadStatus === LoadStatus.Loaded) {
            if (this.currentWorkout.status.isRunning()) {
                res = CurrentWorkoutStatus.Started;
            } else if (this.currentWorkout.status.isFinished()) {
                res = CurrentWorkoutStatus.Finished;
            } else {
                res = CurrentWorkoutStatus.NotStarted;
            }
        }
        return res;
    }

    public getCurrentWorkoutPlan(): WorkoutPlan {
        return this.currentWorkout.plan;
    }

    private processActions(action: IAction): void {
        if (action instanceof AppLoadedAction) {
            this.emitChange();
            this.initWorkoutStatus();
        }
    }

    private initWorkoutStatus(): void {
        this.getLastWorkout()
            .then(
                (s: ICurrentWorkout) => {
                    this.currentWorkout = s;
                    this.currentWorkoutLoadStatus = LoadStatus.Loaded;
                    this.emitChange();
                },
                (e: Error|String) => {
                    this.currentWorkoutLoadStatus = LoadStatus.LoadFailed;
                    this.emitChange();
                });
    }

    private getLastWorkout(): Promise<ICurrentWorkout> {
        var statusFromLocalStorage: string = localStorage.getItem("RoboCoach.Workouts.Current.Status"),
            statusJson: { startTime?: Date, endTime?: Date } = statusFromLocalStorage ? JSON.parse(statusFromLocalStorage) : {},
            status: WorkoutStatus = new WorkoutStatus(statusJson.startTime, statusJson.endTime),
            planFromLocalStorage: string = localStorage.getItem("RoboCoach.Workouts.Current.Plan"),
            planJson: {} = planFromLocalStorage ? JSON.parse(planFromLocalStorage) : {},
            plan: WorkoutPlan = planJson;
        return Promise.resolve({
            status: status,
            plan: plan
        });
    }
}

export default new WorkoutStore();
