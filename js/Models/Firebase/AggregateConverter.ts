
import WorkoutConverter from "./WorkoutConverter";

export default class AggregateConverter {
    private workoutConverter: WorkoutConverter;

    constructor() {
        this.workoutConverter = new WorkoutConverter();
    }

    public get Workout(): WorkoutConverter {
        return this.workoutConverter;
    }
}
