
import WorkoutConverter from "./WorkoutConverter";
import WorkoutPlanConverter from "./WorkoutPlanConverter";

export default class AggregateConverter {
    private workoutConverter: WorkoutConverter;
    private workoutPlanConverter: WorkoutPlanConverter;

    constructor() {
        this.workoutConverter = new WorkoutConverter();
        this.workoutPlanConverter = new WorkoutPlanConverter();
    }

    public get Workout(): WorkoutConverter {
        return this.workoutConverter;
    }

    public get WorkoutPlan(): WorkoutPlanConverter {
        return this.workoutPlanConverter;
    }
}
