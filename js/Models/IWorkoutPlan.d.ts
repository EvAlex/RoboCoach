
interface IWorkoutPlan {
    id: string;
    name: string;
    description: string;
    actions: (IExercisePlanAction | IRestPlanAction)[];
}
