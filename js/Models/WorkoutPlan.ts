
export default class WorkoutPlan implements IWorkoutPlan {

    public id: string;

    public name: string;

    public description: string;

    public actions: (IExercisePlanAction | IRestPlanAction)[];

    /*
    public toJson(): string {
        var model: any = {
            actions: this.actions
        };
        return JSON.stringify(model);
    }
    */
}
