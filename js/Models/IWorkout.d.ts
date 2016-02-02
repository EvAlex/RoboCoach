
interface IWorkout {
    id: string;
    planName: string;
    planDescription: string;
    actions: (IExercisePlanAction | IRestPlanAction)[];
    startTime: Date;
}
