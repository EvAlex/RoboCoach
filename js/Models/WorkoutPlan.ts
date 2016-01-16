
export default class WorkoutPlan {

    private actions: IWorkoutPlanAction[];

    public toJson(): string {
        var model = {
        };
        return JSON.stringify(model);
    }
}
