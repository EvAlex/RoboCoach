
export default class WorkoutPlan {

    public id: string;

    public name: string;

    public description: string;

    private actions: IWorkoutPlanAction[];

    public toJson(): string {
        var model: any = {
            actions: this.actions
        };
        return JSON.stringify(model);
    }
}
