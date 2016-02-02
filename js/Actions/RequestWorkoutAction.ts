import {ActionBase} from "./ActionBase";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class RequestWorkoutAction extends ActionBase {

    constructor(workoutId: string, user: IUser) {
        super();
        this.workoutId = workoutId;
        this.user = user;
    }

    public get WorkoutId(): string {
        return this.workoutId;
    }
    private workoutId: string;

    public get User(): IUser {
        return this.user;
    }
    private user: IUser;

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(
            "RequestWorkoutAction",
            LogLevel.Info,
            { workoutId: this.workoutId, userId: this.user ? this.user.id : "null" });
    }
}
