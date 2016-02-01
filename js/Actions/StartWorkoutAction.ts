import {ActionBase} from "./ActionBase";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class StartWorkoutAction extends ActionBase {
    private workoutPlan: IWorkoutPlan;
    private user: IUser;

    constructor(workoutPlan: IWorkoutPlan, user: IUser) {
        super();
        this.workoutPlan = workoutPlan;
        this.user = user;
    }

    public get WorkoutPlan(): IWorkoutPlan {
        return this.workoutPlan;
    }

    public get User(): IUser {
        return this.user;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(
            "StartWorkoutAction",
            LogLevel.Info,
            { planId: this.workoutPlan.id, userId: this.user ? this.user.id : "null" });
    }
}
