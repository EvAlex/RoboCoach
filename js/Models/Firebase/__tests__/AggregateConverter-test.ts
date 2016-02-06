
import AggregateConverter from "../AggregateConverter";
import WorkoutConverter from "../WorkoutConverter";
import WorkoutPlanConverter from "../WorkoutPlanConverter";

describe("AggregateConverter", () => {
    describe("Workout", () => {
        it("Should return an instance of WorkoutConverter", () => {
            // arrange
            var aggregateConverter: AggregateConverter = new AggregateConverter();

            // act
            var actual: WorkoutConverter = aggregateConverter.Workout;

            // assert
            expect(actual instanceof WorkoutConverter).toBeTruthy();
        })
    });
    describe("WorkoutPlan", () => {
        it("Should return an instance of WorkoutPlanConverter", () => {
            // arrange
            var aggregateConverter: AggregateConverter = new AggregateConverter();

            // act
            var actual: WorkoutPlanConverter = aggregateConverter.WorkoutPlan;

            // assert
            expect(actual instanceof WorkoutPlanConverter).toBeTruthy();
        })
    });
})
