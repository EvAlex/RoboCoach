import React = require("react");

/* tslint:disable:no-any */
const styles: any = require("./WorkoutPlayer.module.less");
/* tslint:enable:no-any */

import * as Utils from "../../Utils";
import Workout from "../../Models/Workout";
import audioPlayer from "../../AudioPlayer/AudioPlayer";
import speechSynthesiser from "../../AudioPlayer/SpeechSynthesiser";

export interface IWorkoutPlayerProps {
    workout: Workout;
}

interface IActionNotifications {
    action: IWorkoutPlanAction;
    preparePlayed: boolean;
    startPlayed: boolean;
    finishPlayed: boolean;
}

export default class WorkoutPlayer extends React.Component<IWorkoutPlayerProps, {}> {
    private shouldTimerWork: boolean = false;
    private fps: number = 60;
    private timeToPrepare: number = 5000;
    private lastRenderTime: number = new Date().getTime();
    private notifications: IActionNotifications[];

    componentWillMount(): void {
        this.notifications = this.props.workout.actions.map(a => ({
            action: a,
            preparePlayed: false,
            startPlayed: false,
            finishPlayed: false,
        }));
    }

    componentDidMount(): void {
        this.shouldTimerWork = true;
        window.requestAnimationFrame(t => this.onAminationFrame(t));
    }

    componentWillUnmount(): void {
        this.shouldTimerWork = false;
    }

    componentDidUpdate(): void {
        this.lastRenderTime = new Date().getTime();
    }

    onAminationFrame(time: number): void {
        if (this.shouldTimerWork) {
            if (new Date().getTime() - this.lastRenderTime > 1000 / this.fps) {
                this.forceUpdate();
            }
            this.shouldTimerWork = this.shouldTimerWork && this.props.workout.isInProgress;
            window.requestAnimationFrame(t => this.onAminationFrame(t));
        }
    }

    render(): React.ReactElement<{}> {
        return (
            <div className={styles["workout-player"]}>
                {
                    this.props.workout.isInProgress
                        ? this.renderProgress()
                        : this.renderComplete()
                }
            </div>
        );
    }

    private renderProgress(): React.ReactElement<{}> {
        let action: IExercisePlanAction | IRestPlanAction = this.props.workout.getAction(new Date());
        return this.props.workout.isActionRest(action)
            ? this.renderRestProgress(action)
            : this.renderExerciseProgress(action);
    }

    private renderRestProgress(action: IExercisePlanAction | IRestPlanAction): React.ReactElement<{}> {
        let left: number = this.props.workout.getTimeLeftForAction(action),
            i: number = this.props.workout.actions.indexOf(action),
            prev: IExercisePlanAction | IRestPlanAction = this.props.workout.actions[i - 1],
            next: IExercisePlanAction | IRestPlanAction = this.props.workout.actions[i + 1];
        if (this.shouldNotifyFinish(action)) {
            this.notifyFinish(prev);
        } else if (this.shouldNotifyPrepare(action)) {
            this.notifyPrepare(action);
        } else if (this.shouldNotifyStart(action)) {
            this.notifyStart(action);
        }
        return (
            <div className={styles["rest-progress"]}>
                { this.renderTimeLeft(left) }
                { next
                    ? <h1 className={styles["action-name"]}>{next["exercise"].name}</h1>
                    : <h1>Workout complete!</h1> }
            </div>
        );
    }

    private renderExerciseProgress(action: IExercisePlanAction | IRestPlanAction): React.ReactElement<{}> {
        let left: number = this.props.workout.getTimeLeftForAction(action),
            exercise: IExercise = action["exercise"];
        if (this.shouldNotifyStart(action)) {
            this.notifyStart(action);
        } else if (this.shouldNotifyFinish(action)) {
            this.notifyFinish(action);
        }
        return (
            <div className={styles["exercise-progress"]}>
                { this.renderTimeLeft(left) }
                <h1 className={styles["action-name"]}>{exercise.name}</h1>
            </div>
        );
    }

    private renderTimeLeft(timeLeft: number): React.ReactElement<{}> {
        let min: number = Math.floor(timeLeft / 1000 / 60),
            sec: number = Math.floor(timeLeft / 1000 - min * 60),
            ms: number = timeLeft - min * 60 * 1000 - sec * 1000;
        return (
            <h1 className={styles["time-left"]}>
                <span className={styles.min}>{Utils.padNumber(min, 2) }</span>
                :
                <span className={styles.sec}>{Utils.padNumber(sec, 2) }</span>
                .
                <span className={styles.ms}>{Utils.padNumber(ms, 3) }</span>
            </h1>
        );
    }

    private renderComplete(): React.ReactElement<{}> {
        return (
            <div>
                Workout complete!
            </div>
        );
    }

    private shouldNotifyPrepare(action: IWorkoutPlanAction): boolean {
        var played: boolean = this.notifications.filter(n => n.action === action)[0].preparePlayed;
        return !played &&
            this.props.workout.getTimeLeftForAction(action) < this.timeToPrepare + 1000 / this.fps;
    }

    private shouldNotifyStart(currentAction: IWorkoutPlanAction): boolean {
        var next: IWorkoutPlanAction = this.props.workout.actions[this.props.workout.actions.indexOf(currentAction) + 1],
            isRest: boolean = this.props.workout.isActionRest(currentAction),
            played: boolean = isRest
                ? next && this.notifications.filter(n => n.action === next)[0].startPlayed
                : this.notifications.filter(n => n.action === currentAction)[0].startPlayed,
            timeToPlay: boolean = isRest
                ? next && this.props.workout.getTimeLeftForAction(currentAction) < 1000 / this.fps
                : true;
        return !played && timeToPlay;
    }

    private shouldNotifyFinish(currentAction: IWorkoutPlanAction): boolean {
        var prev: IWorkoutPlanAction = this.props.workout.actions[this.props.workout.actions.indexOf(currentAction) - 1],
            isRest: boolean = this.props.workout.isActionRest(currentAction),
            played: boolean = isRest
                ? prev && this.notifications.filter(n => n.action === prev)[0].finishPlayed
                : this.notifications.filter(n => n.action === currentAction)[0].finishPlayed,
            timeToPlay: boolean = isRest
                ? !!prev
                : this.props.workout.getTimeLeftForAction(currentAction) < 1000 / this.fps;
        return !played && timeToPlay;
    }

    private notifyPrepare(currentAction: IWorkoutPlanAction): void {
        var next: IWorkoutPlanAction = this.props.workout.actions[this.props.workout.actions.indexOf(currentAction) + 1];
        audioPlayer.play(audioPlayer.getFiles().prepare)
            .then(() => {
                speechSynthesiser.say(
                    this.props.workout.isActionRest(currentAction)
                        ? next["exercise"].name
                        : currentAction["exercise"].name);
            });
        /*window.setTimeout(
            () => {
                speechSynthesiser.say(
                    this.props.workout.isActionRest(currentAction)
                        ? next["exercise"].name
                        : currentAction["exercise"].name);
            },
            1500);*/
        this.notifications.filter(n => n.action === currentAction)[0].preparePlayed = true;
    }

    private notifyStart(currentAction: IWorkoutPlanAction): void {
        audioPlayer.play(audioPlayer.getFiles().start);
        var isRest: boolean = this.props.workout.isActionRest(currentAction);
        if (isRest) {
            var next: IWorkoutPlanAction = this.props.workout.actions[this.props.workout.actions.indexOf(currentAction) + 1];
            this.notifications.filter(n => n.action === next)[0].startPlayed = true;
        } else {
            this.notifications.filter(n => n.action === currentAction)[0].startPlayed = true;
        }
    }

    private notifyFinish(currentAction: IWorkoutPlanAction): void {
        audioPlayer.play(audioPlayer.getFiles().finish);
        var isRest: boolean = this.props.workout.isActionRest(currentAction);
        if (isRest) {
            var prev: IWorkoutPlanAction = this.props.workout.actions[this.props.workout.actions.indexOf(currentAction) - 1];
            this.notifications.filter(n => n.action === prev)[0].finishPlayed = true;
        } else {
            this.notifications.filter(n => n.action === currentAction)[0].finishPlayed = true;
        }
    }

}