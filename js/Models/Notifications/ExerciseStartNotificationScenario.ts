/// <reference path="./INotificationScenario.d.ts" />
/// <reference path="./INotification.d.ts" />
/// <reference path="../IWorkoutPlanAction.d.ts" />
/// <reference path="../IExcercisePlanAction.d.ts"/>


export default class ExerciseStartNotificationScenario implements INotificationScenario {

    public createNotifications(workout: IWorkout): INotification {
        for(var i in workout.actions) {
            action: IWorkoutPlanAction = workout.actions[i];

            if(action instanceof IExercisePlanAction) {

            }
        }
    }
}
