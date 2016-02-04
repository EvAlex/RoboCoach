/// <reference path="./IWorkout.d.ts" />

export default class Workout implements IWorkout {
    private workout: IWorkout;

    constructor(workout: IWorkout) {
        this.workout = workout;
    }

    public get id(): string {
        return this.workout.id;
    }

    public get planName(): string {
        return this.workout.planName;
    }

    public get planDescription(): string {
        return this.workout.planDescription;
    }

    public get actions(): (IExercisePlanAction | IRestPlanAction)[] {
        return this.workout.actions;
    }

    public get startTime(): Date {
        return this.workout.startTime;
    }

    public get isInProgress(): boolean {
        return new Date().getTime() - (this.startTime.getTime() + this.duration) < 0;
    }

    public get duration(): number {
        return this.actions.reduce((p, c) => p + c.duration, 0);
    }

    public getAction(time: Date = new Date()): IExercisePlanAction | IRestPlanAction {
        var curWorkoutTime: number = this.workout.startTime.getTime(),
            curTime: number = time.getTime(),
            res: IExercisePlanAction | IRestPlanAction = null;
        if (curWorkoutTime < curTime) {
            for (let i: number = 0; i < this.workout.actions.length && !res; i++) {
                if ((curWorkoutTime += this.workout.actions[i].duration) > curTime) {
                    res = this.workout.actions[i];
                }
            }
        }
        return res;
    }

    public isActionRest(action: IExercisePlanAction | IRestPlanAction): boolean {
        return !("exercise" in action);
    }

    public getActionStartTime(action: IWorkoutPlanAction): Date {
        if (this.workout.actions.indexOf(action) === -1) {
            throw new Error("Specified action does not belong to current Workout");
        }

        let res: Date = new Date();
        res.setTime(this.workout.startTime.getTime() + this.getRelativeActionStartTime(action));
        return res;
    }

    public getRelativeActionStartTime(action: IWorkoutPlanAction): number {
        if (this.workout.actions.indexOf(action) === -1) {
            throw new Error("Specified action does not belong to current Workout");
        }
        let startTime: number = 0,
            i: number = 0;
        while (this.workout.actions[i] !== action) {
            startTime += this.workout.actions[i].duration;
            i++;
        }

        return startTime;
    }

    public getTimeLeftForAction(action: IWorkoutPlanAction): number {
        return action.duration - (new Date().getTime() - this.getActionStartTime(action).getTime());
    }
}
