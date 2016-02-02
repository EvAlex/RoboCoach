/// <reference path="./INotificationScenario.d.ts" />
/// <reference path="./INotification.d.ts" />
/// <reference path="../IWorkoutPlanAction.d.ts" />
/// <reference path="../IExcercisePlanAction.d.ts"/>

import Workout from "../../Models/Workout";
import SoundNotification from "./SoundNotification";
import audioPlayer from "../../AudioPlayer/AudioPlayer";

export default class ExerciseStartNotificationScenario implements INotificationScenario {

    public createNotifications(workout: Workout): INotification[] {
        let notifications: INotification[] = [];

        for (var action of workout.actions) { 

            if (!workout.isActionRest(action)) {
                notifications.push(new SoundNotification(
                    workout.getRelativeActionStartTime(action),
                    audioPlayer.getFiles().start));
            }
        }

        return notifications;
    }
}
