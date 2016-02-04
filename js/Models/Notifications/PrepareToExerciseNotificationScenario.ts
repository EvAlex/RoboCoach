/// <reference path="./INotificationScenario.d.ts" />
/// <reference path="./INotification.d.ts" />
/// <reference path="../IWorkoutPlanAction.d.ts" />
/// <reference path="../IExcercisePlanAction.d.ts"/>

import Workout from "../../Models/Workout";
import SoundAndTextNotification from "./SoundAndTextNotification";
import audioPlayer from "../../AudioPlayer/AudioPlayer";

export default class PrepareToExerciseNotificationScenario implements INotificationScenario {

    private timeToPrepare: number = 5000;
    private soundToSpeechDelay: number = 100;

    public createNotifications(workout: Workout): INotification[] {
        let notifications: INotification[] = [];

        for (let i: number = 0; i < workout.actions.length - 1; i++) {
            let current: IWorkoutPlanAction = workout.actions[i];
            let next: IWorkoutPlanAction = workout.actions[i + 1];

            if (workout.isActionRest(current)) {
                let minTime: number = Math.min(this.timeToPrepare, current.duration);

                notifications.push(new SoundAndTextNotification(
                    workout.getRelativeActionStartTime(current) + current.duration - minTime,
                    audioPlayer.getFiles().prepare, next["exercise"].name, this.soundToSpeechDelay));
            }
        }
        return notifications;
    }
}
