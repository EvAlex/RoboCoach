import React = require("react");

/* tslint:disable:no-any */
const styles: any = require("./WorkoutPlayer.module.less");
/* tslint:enable:no-any */

import * as Utils from "../../Utils";
import Workout from "../../Models/Workout";
import audioPlayer from "../../AudioPlayer/AudioPlayer";

export interface IWorkoutPlayerProps {
    workout: Workout;
}

export default class WorkoutPlayer extends React.Component<IWorkoutPlayerProps, {}> {
    private shouldTimerWork: boolean = false;
    private fps: number = 60;
    private lastRenderTime: number = new Date().getTime();

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
        let action: IExcercisePlanAction | IRestPlanAction = this.props.workout.getAction(new Date());
        return this.props.workout.isActionRest(action)
            ? this.renderRestProgress(action)
            : this.renderExcerciseProgress(action);
    }

    private renderRestProgress(action: IExcercisePlanAction | IRestPlanAction): React.ReactElement<{}> {
        let left: number = this.props.workout.getTimeLeftForAction(action),
            i: number = this.props.workout.actions.indexOf(action),
            next: IExcercisePlanAction | IRestPlanAction = this.props.workout.actions[i + 1];
        return (
            <div className={styles["rest-progress"]}>
                { this.renderTimeLeft(left) }
                { next
                    ? <h1 className={styles["action-name"]}>{next["excercise"].name}</h1>
                    : <h1>Workout complete!</h1> }
            </div>
        );
    }

    private renderExcerciseProgress(action: IExcercisePlanAction | IRestPlanAction): React.ReactElement<{}> {
        let left: number = this.props.workout.getTimeLeftForAction(action),
            excercise: IExcercise = action["excercise"];
        return (
            <div className={styles["excercise-progress"]}>
                { this.renderTimeLeft(left) }
                <h1 className={styles["action-name"]}>{excercise.name}</h1>
            </div>
        );
    }

    private renderTimeLeft(timeLeft: number): React.ReactElement<{}> {
        let min: number = Math.floor(timeLeft / 1000 / 60),
            sec: number = Math.floor(timeLeft / 1000 - min * 60),
            ms: number = timeLeft - min * 60 * 1000 - sec * 1000;
        return (
            <h1 className={styles["time-left"]}>
                <span className={styles.min}>{Utils.padNumber(min, 2)}</span>
                :
                <span className={styles.sec}>{Utils.padNumber(sec, 2)}</span>
                .
                <span className={styles.ms}>{Utils.padNumber(ms, 3)}</span>
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

}
