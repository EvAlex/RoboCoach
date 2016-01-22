
interface IWorkout {
    id: string;
    actions: (IExcercisePlanAction | IRestPlanAction)[];
    startTime: Date;
}
