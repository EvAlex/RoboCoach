
interface IWorkout {
    id: string;
    planName: string;
    planDescription: string;
    actions: (IExcercisePlanAction | IRestPlanAction)[];
    startTime: Date;
}
