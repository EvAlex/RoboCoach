import React = require("react");

/* tslint:disable:no-any */
const styles: any = require("./WorkoutPlayer.module.less");
/* tslint:enable:no-any */

import * as Utils from "../../Utils";
import Workout from "../../Models/Workout";
import NotificationsBuilder from "../../Models/Notifications/NotificationsBuilder";
import PrepareToExerciseNotificationScenario from "../../Models/Notifications/PrepareToExerciseNotificationScenario";
import ExerciseEndNotificationScenario from "../../Models/Notifications/ExerciseEndNotificationScenario";
import ExerciseStartNotificationScenario from "../../Models/Notifications/ExerciseStartNotificationScenario";
import NotificationsPlayer from "../../Models/Notifications/NotificationsPlayer";
import sleepPreventer from "../../SleepPreventer/SleepPreventer";

export interface IWorkoutPlayerProps {
    workout: Workout;
}

export default class WorkoutPlayer extends React.Component<IWorkoutPlayerProps, {}> {
    private shouldTimerWork: boolean = false;
    private fps: number = 60;
    private lastRenderTime: number = new Date().getTime();
    private notifications: INotification[];
    private notificationsPlayer: NotificationsPlayer;

    componentWillMount(): void {

        var builder: NotificationsBuilder = new NotificationsBuilder;
        var scenarios: INotificationScenario[] = [
            new PrepareToExerciseNotificationScenario(),
            new ExerciseEndNotificationScenario(),
            new ExerciseStartNotificationScenario()];

        this.notifications = builder.createNotifications(this.props.workout, scenarios);
        this.notificationsPlayer = new NotificationsPlayer(this.notifications);
    }

    componentDidMount(): void {
        this.shouldTimerWork = true;
        window.requestAnimationFrame(t => this.onAminationFrame(t));
        sleepPreventer.prevent();
    }

    componentWillUnmount(): void {
        sleepPreventer.allow();
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

            if (!this.shouldTimerWork) {
                this.forceUpdate();
            }

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
        let action: IExercisePlanAction | IRestPlanAction = this.props.workout.getAction(new Date()),
            elapsedMiliseconds: number = new Date().getTime() - this.props.workout.startTime.getTime();

        this.notificationsPlayer.play(elapsedMiliseconds);
        return this.props.workout.isActionRest(action)
            ? this.renderRestProgress(action)
            : this.renderExerciseProgress(action);
    }

    private renderRestProgress(action: IExercisePlanAction | IRestPlanAction): React.ReactElement<{}> {
        let left: number = this.props.workout.getTimeLeftForAction(action),
            i: number = this.props.workout.actions.indexOf(action),
            next: IExercisePlanAction | IRestPlanAction = this.props.workout.actions[i + 1];

        return (
            <div className={styles["rest-progress"]}>
                { this.renderTimeLeft(left) }
                { next
                    ? <h1 className={styles["action-name"]}>{next["exercise"].name}</h1>
                    : "" }
            </div>
        );
    }

    private renderExerciseProgress(action: IExercisePlanAction | IRestPlanAction): React.ReactElement<{}> {
        let left: number = this.props.workout.getTimeLeftForAction(action),
            exercise: IExercise = action["exercise"];

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
        let elapsedMiliseconds: number = new Date().getTime() - this.props.workout.startTime.getTime();
        this.notificationsPlayer.play(elapsedMiliseconds);

        return (
            <h1 className={styles["action-name"]}>Workout complete!</h1>
        );
    }
}
