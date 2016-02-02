/// <reference path="./INotificationScenario.d.ts" />
/// <reference path="./INotification.d.ts" />
/// <reference path="../IWorkoutPlanAction.d.ts" />
/// <reference path="../IExcercisePlanAction.d.ts"/>

import Workout from "../../Models/Workout";
import SoundNotification from "./SoundNotification";
import audioPlayer from "../../AudioPlayer/AudioPlayer";

export default class PrepareToExerciseNotificationScenario implements INotificationScenario {

    private timeToPrepare: number = 5000;

    public createNotifications(workout: Workout): INotification[] {
        let notifications: INotification[] = [];

        for (var action of workout.actions) { 

            if (workout.isActionRest(action)) {
                let minTime: number = Math.min(this.timeToPrepare, action.duration);

                notifications.push(new SoundNotification(
                    workout.getRelativeActionStartTime(action) + action.duration - minTime,
                    audioPlayer.getFiles().prepare));
            }
        }

        return notifications;
    }
}
