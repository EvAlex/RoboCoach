
interface IWorkoutPlan {
    id: string;
    name: string;
    description: string;
    actions: (IExcercisePlanAction | IRestPlanAction)[];
}
