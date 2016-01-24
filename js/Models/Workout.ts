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

    public get actions(): (IExcercisePlanAction | IRestPlanAction)[] {
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

    public get currentAction(): IExcercisePlanAction | IRestPlanAction {
        var curWorkoutTime: number = this.workout.startTime.getTime(),
            curTime: number = new Date().getTime(),
            res: IExcercisePlanAction | IRestPlanAction = null;
        if (curWorkoutTime < new Date().getTime()) {
            for (let i: number = 0; i < this.workout.actions.length && !res; i++) {
                if ((curWorkoutTime += this.workout.actions[i].duration) > curTime) {
                    res = this.workout.actions[i];
                }
            }
        }
        return res;
    }

    public isActionRest(action: IExcercisePlanAction | IRestPlanAction): boolean {
        return !("excercise" in action);
    }

    public getActionStartTime(action: IWorkoutPlanAction): Date {
        let startTime: number = this.workout.startTime.getTime(),
            i: number = 0;
        while (this.workout.actions[i] !== action) {
            startTime += this.workout.actions[i].duration;
        }
        let res: Date = new Date();
        res.setTime(startTime);
        return res;
    }

    public getTimeLeftForAction(action: IWorkoutPlanAction): number {
        return action.duration - (new Date().getTime() - this.getActionStartTime(action).getTime());
    }
}
