/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

import Workout from "../Workout";

describe("Workout", () => {
    it("Should wrap IWorkout transparently", () => {
        // Arrange
        var wrapped: IWorkout = getWorkout();

        // Act
        var workout = new Workout(wrapped);

        // Assert
        expect(workout.id).toEqual(wrapped.id);
        expect(workout.planName).toEqual(wrapped.planName);
        expect(workout.planDescription).toEqual(wrapped.planDescription);
        expect(workout.startTime.getTime()).toEqual(wrapped.startTime.getTime());
        expect(workout.actions.length).toEqual(wrapped.actions.length);
        workout.actions.forEach((a, i) => {
            expect(a.duration).toEqual(wrapped.actions[i].duration);
            if ("exercise" in a) {
                expect(a["exercise"]).toEqual(wrapped.actions[i]["exercise"]);
            }
        });
    });

    describe("duration", () => {
        it("Should return sum of all Workout's actions durations, in milliseconds.", () => {
            // Arrange
            var workout: Workout = new Workout(getWorkout());

            // Act
            var actual: number = workout.duration;

            // Assert
            expect(actual).toEqual(400000);
        });
    });

    describe("getAction(time)", () => {
        it("Should return action that should be in progress at specified time.", () => {
            // Arrange
            var wrapped: IWorkout = getWorkout(),
                workout = new Workout(wrapped),
                now: Date = new Date(),
                in35sec: Date = new Date(),
                in50sec: Date = new Date(),
                in215sec: Date = new Date();
            now.setTime(now.getTime() + 100);
            in35sec.setTime(now.getTime() + 35000);
            in50sec.setTime(now.getTime() + 50000);
            in215sec.setTime(now.getTime() + 215000);


            // Act

            var action1: IExercisePlanAction = <IExercisePlanAction>workout.getAction(now),
                action2: IRestPlanAction = <IExercisePlanAction>workout.getAction(in35sec),
                action3: IExercisePlanAction = <IExercisePlanAction>workout.getAction(in50sec),
                action4: IExercisePlanAction = <IExercisePlanAction>workout.getAction(in215sec);

            // Assert
            expect("exercise" in action1).toBeTruthy();
            expect(action1.exercise.name).toEqual("Shadowboxing");
            expect("exercise" in action2).toBeFalsy();
            expect("exercise" in action3).toBeTruthy();
            expect(action3.exercise.name).toEqual("Lunge");
            expect("exercise" in action4).toBeTruthy();
            expect(action4.exercise.name).toEqual("Sprint in place");
        });

        it("Should return null if specified time is either before Workout starts or after it completes.", () => {
            // Arrange
            var wrapped: IWorkout = getWorkout(),
                workout = new Workout(wrapped),
                before: Date = new Date(),
                after: Date = new Date();
            before.setTime(before.getTime() - 100);
            after.setTime(after.getTime() + 400100);

            // Act
            var action1: IWorkoutPlanAction = workout.getAction(before),
                action2: IWorkoutPlanAction = workout.getAction(after);

            // Assert
            expect(action1).toBeNull();
            expect(action2).toBeNull();
        });
    });

    describe("isActionRest(action)", () => {
        it("Should return true if given action represents resting time, otherwise false.", () => {
            // Arrange
            var workout: Workout = new Workout(getWorkout());

            // Act
            var actual1: boolean = workout.isActionRest(workout.actions[0]),
                actual2: boolean = workout.isActionRest(workout.actions[1]),
                actual3: boolean = workout.isActionRest(workout.actions[2]);

            // Assert
            expect(actual1).toBeFalsy();
            expect(actual2).toBeTruthy();
            expect(actual3).toBeFalsy();
        });
    });

    describe("getActionStartTime(action)", () => {
        it("Should correct Date instace, that is action start time.", () => {
            // Arrange
            var workout: Workout = new Workout(getWorkout());

            // Act
            var actual1: Date = workout.getActionStartTime(workout.actions[0]),
                actual2: Date = workout.getActionStartTime(workout.actions[1]),
                actual3: Date = workout.getActionStartTime(workout.actions[2]);

            // Assert
            expect(actual1.getTime()).toEqual(workout.startTime.getTime());
            expect(actual2.getTime()).toEqual(workout.startTime.getTime() + 30000);
            expect(actual3.getTime()).toEqual(workout.startTime.getTime() + 40000);
        });

        it("Should throw Error if specified action does not belong to current workout.", () => {
            // Arrange
            var workout: Workout = new Workout(getWorkout());

            // Act

            // Assert
            expect(() => workout.getActionStartTime({ duration: 3000 })).toThrow();
        });
    });
});

function getWorkout(): IWorkout {
    return {
        id: "-JRHTHaIs-jNPLXOQivY",
        planName: "7 Минут на фитнес - Красный 5",
        planDescription: "Set of 30 sec exercises with 10 sec intervals",
        startTime: new Date(),
        actions: [
            { duration: 30000, exercise: { name: "Shadowboxing" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Lunge" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Squat" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Bicycle crunch" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Pushups" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Sprint in place" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Burpee" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Circle running" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Jumping" } },
            { duration: 10000 },
            { duration: 30000, exercise: { name: "Hyperextension on floor" } },
            { duration: 10000 },
        ]
    };
}
