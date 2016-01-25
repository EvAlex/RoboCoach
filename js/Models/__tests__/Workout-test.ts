/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

import Workout from "../Workout";

describe("Workout", () => {
    it("Should wrap IWorkout transparently", () => {
        // Arrange
        var wrapped: IWorkout = {
            id: "-JRHTHaIs-jNPLXOQivY",
            planName: "7 Минут на фитнес - Красный 5",
            planDescription: "Set of 30 sec excercises with 10 sec intervals",
            startTime: new Date(),
            actions: [
                { duration: 30000, excercise: { name: "Бой с тенью" } },
                { duration: 10000 },
                { duration: 30000, excercise: { name: "Выпады" } },
                { duration: 10000 },
                { duration: 30000, excercise: { name: "Приседания в упоре лёжа" } },
                { duration: 10000 },
                { duration: 30000, excercise: { name: "Велосипед" } },
                { duration: 10000 },
                { duration: 30000, excercise: { name: "Отжимания" } },
                { duration: 10000 },
                { duration: 30000, excercise: { name: "Спринт на месте" } },
                { duration: 10000 },
                { duration: 30000, excercise: { name: "Берпи" } },
                { duration: 10000 },
                { duration: 30000, excercise: { name: "Бег по кругу" } },
                { duration: 10000 },
                { duration: 30000, excercise: { name: "Планка с отжиманиями" } },
                { duration: 10000 },
                { duration: 30000, excercise: { name: "Супермен со сменой сторон" } },
                { duration: 10000 },
            ]
        };

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
            if ("excercise" in a) {
                expect(a["excercise"]).toEqual(wrapped.actions[i]["excercise"]);
            }
        });
    });
});
