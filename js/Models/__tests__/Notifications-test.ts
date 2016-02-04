/// <reference path="../../../typings/jasmine/jasmine.d.ts" />

import Workout from "../Workout";
import ExerciseStartNotificationScenario from "../Notifications/ExerciseStartNotificationScenario";
import ExerciseEndNotificationScenario from "../Notifications/ExerciseEndNotificationScenario";
import PrepareToExerciseNotificationScenario from "../Notifications/PrepareToExerciseNotificationScenario";
import NotificationsBuilder from "../Notifications/NotificationsBuilder";
import NotificationsPlayer from "../Notifications/NotificationsPlayer";

describe("ExerciseStartNotificationScenario", () => {
    it("Should gererate notifications for every training start", () => {
        // Arrange
        var workout: Workout = getWorkout();
        var scenario: INotificationScenario = new ExerciseStartNotificationScenario();

        // Act
        var notifications = scenario.createNotifications(workout);

        // Assert
        expect(notifications.length).toEqual(3);

        expect(notifications[0].time).toEqual(15000);
        expect(notifications[1].time).toEqual(15000+30000+25000);
        expect(notifications[2].time).toEqual(15000+30000+25000+30000+35000);

        notifications.forEach((n, i) => {
            expect(n.isCompleted).toBeFalsy();
        });
    });
});

describe("ExerciseEndNotificationScenario", () => {
    it("Should gererate notifications for every training end", () => {
        // Arrange
        var workout: Workout = getWorkout();
        var scenario: INotificationScenario = new ExerciseEndNotificationScenario();

        // Act
        var notifications = scenario.createNotifications(workout);

        // Assert
        expect(notifications.length).toEqual(3);

        expect(notifications[0].time).toEqual(15000+30000);
        expect(notifications[1].time).toEqual(15000+30000+25000+30000);
        expect(notifications[2].time).toEqual(15000+30000+25000+30000+35000+30000);

        notifications.forEach((n, i) => {
            expect(n.isCompleted).toBeFalsy();
        });
    });
});

describe("PrepareToExerciseNotificationScenario", () => {
    it("Should gererate notifications before rest end", () => {
        // Arrange
        var workout: Workout = getWorkout();
        var scenario: INotificationScenario = new PrepareToExerciseNotificationScenario();

        // Act
        var notifications = scenario.createNotifications(workout);

        // Assert
        expect(notifications.length).toEqual(3);

        expect(notifications[0].time).toEqual(15000-5000);
        expect(notifications[1].time).toEqual(15000+30000+25000-5000);
        expect(notifications[2].time).toEqual(15000+30000+25000+30000+35000-5000);

        notifications.forEach((n, i) => {
            expect(n.isCompleted).toBeFalsy();
        });
    });
});

describe("NotificationsBuilder", () => {
    it("Should gererate all notifications for the workout", () => {
        // Arrange
        var workout: Workout = getWorkout();
        var builder: NotificationsBuilder = new NotificationsBuilder;
        var scenarios = [
            new PrepareToExerciseNotificationScenario(),
            new ExerciseEndNotificationScenario(),
            new ExerciseStartNotificationScenario()];

        // Act
        var notifications = builder.createNotifications(workout, scenarios);

        // Assert
        expect(notifications.length).toEqual(9);

        expect(notifications[0].time).toEqual(15000-5000); //prepare
        expect(notifications[1].time).toEqual(15000); //start
        expect(notifications[2].time).toEqual(15000+30000); //end
        expect(notifications[3].time).toEqual(15000+30000+25000-5000); //prepare
        expect(notifications[4].time).toEqual(15000+30000+25000); //start
        expect(notifications[5].time).toEqual(15000+30000+25000+30000); //end
        expect(notifications[6].time).toEqual(15000+30000+25000+30000+35000-5000); //prepare
        expect(notifications[7].time).toEqual(15000+30000+25000+30000+35000); //start
        expect(notifications[8].time).toEqual(15000+30000+25000+30000+35000+30000); //end

        notifications.forEach((n, i) => {
            expect(n.isCompleted).toBeFalsy();
        });
    });
});

describe("NotificationsPlayer", () => {
    it("Should mark as played notifications before provided time", () => {
        // Arrange
        var workout: Workout = getWorkout();
        var builder: NotificationsBuilder = new NotificationsBuilder;
        var scenarios = [
            new PrepareToExerciseNotificationScenario(),
            new ExerciseEndNotificationScenario(),
            new ExerciseStartNotificationScenario()];

        var notifications = builder.createNotifications(workout, scenarios);

        var player = new NotificationsPlayer(notifications);

        // Act
        player.markAsPlayed(15000+30000);

        // Assert
        expect(notifications.length).toEqual(9);

        expect(notifications[0].isCompleted).toBeTruthy(); // .toEqual(15000-5000); //prepare
        expect(notifications[1].isCompleted).toBeTruthy();// .toEqual(15000); //start
        expect(notifications[2].isCompleted).toBeTruthy();// .toEqual(15000+30000); //end

        expect(notifications[3].isCompleted).toBeFalsy(); // .toEqual(15000+30000+25000-5000); //prepare
        expect(notifications[4].isCompleted).toBeFalsy(); // .toEqual(15000+30000+25000); //start
        expect(notifications[5].isCompleted).toBeFalsy(); // .toEqual(15000+30000+25000+30000); //end
        expect(notifications[6].isCompleted).toBeFalsy(); // .toEqual(15000+30000+25000+30000+35000-5000); //prepare
        expect(notifications[7].isCompleted).toBeFalsy(); // .toEqual(15000+30000+25000+30000+35000); //start
        expect(notifications[8].isCompleted).toBeFalsy(); // .toEqual(15000+30000+25000+30000+35000+30000); //end
    });
});

function getWorkout(): Workout {
    return new Workout({
        id: "-JRHTHaIs-jNPLXOQivY",
        planName: "7 Минут на фитнес - Красный 5",
        planDescription: "Set of 30 sec exercises with 10 sec intervals",
        startTime: new Date(),
        actions: [
            { duration: 15000 },
            { duration: 30000, exercise: { name: "Shadowboxing" } },
            { duration: 25000 },
            { duration: 30000, exercise: { name: "Lunge" } },
            { duration: 35000 },
            { duration: 30000, exercise: { name: "Squat" } }
        ]
    });
}
