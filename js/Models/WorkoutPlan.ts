
export default class WorkoutPlan {

    public id: string;

    private actions: IWorkoutPlanAction[];

    public toJson(): string {
        var model = {
        };
        return JSON.stringify(model);
    }
}
