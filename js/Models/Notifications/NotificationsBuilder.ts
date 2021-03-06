/// <reference path="./INotificationScenario.d.ts" />
/// <reference path="./INotification.d.ts" />
/// <reference path="../IWorkoutPlanAction.d.ts" />
/// <reference path="../IExcercisePlanAction.d.ts"/>

import Workout from "../../Models/Workout";

export default class NotificationsBuilder {

    public createNotifications(workout: Workout, scenarios: INotificationScenario[]): INotification[] {
        let notifications: INotification[] = [];
 
        for (var scenario of scenarios) {
            let scenarioNotifications: INotification[] = scenario.createNotifications(workout);
            notifications = notifications.concat(scenarioNotifications);
        }

        notifications.sort((a, b) => a.time - b.time);

        return notifications;
    }
}
