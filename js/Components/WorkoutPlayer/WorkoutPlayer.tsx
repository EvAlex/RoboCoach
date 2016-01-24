import React = require("react");

/* tslint:disable:no-any */
const styles: any = require("./WorkoutPlayer.module.less");
/* tslint:enable:no-any */

import Workout from "../../Models/Workout";

export interface IWorkoutPlayerProps {
    workout: Workout;
}

export default class WorkoutPlayer extends React.Component<IWorkoutPlayerProps, {}> {

    render(): React.ReactElement<{}> {
        return (
            <div className={styles.workoutPlayer}>
                {
                    this.props.workout.isInProgress
                        ? this.renderProgress()
                        : this.renderComplete()
                }
            </div>
        );
    }

    private renderProgress(): React.ReactElement<{}> {
        let action: IExcercisePlanAction | IRestPlanAction = this.props.workout.currentAction;
        return this.props.workout.isActionRest(action)
            ? this.renderRestProgress(action)
            : this.renderExcerciseProgress(action);
    }

    private renderRestProgress(action: IExcercisePlanAction | IRestPlanAction): React.ReactElement<{}> {
        let left: number = this.props.workout.getTimeLeftForAction(action),
            i: number = this.props.workout.actions.indexOf(action),
            next: IExcercisePlanAction | IRestPlanAction = this.props.workout.actions[i + 1];
        return (
            <div>
                <h1>Rest</h1>
                { next
                    ? <h3>Next excercise: {next["excercise"].name}</h3>
                    : <h3>Workout complete!</h3> }
                { this.renderTimeLeft(left) }
            </div>
        );
    }

    private renderExcerciseProgress(action: IExcercisePlanAction | IRestPlanAction): React.ReactElement<{}> {
        let left: number = this.props.workout.getTimeLeftForAction(action),
            excercise: IExcercise = action["excercise"];
        return (
            <div>
                <h1>{excercise.name}</h1>
                { this.renderTimeLeft(left) }
            </div>
        );
    }

    private renderTimeLeft(timeLeft: number): React.ReactElement<{}> {
        let min: number = Math.floor(timeLeft / 1000 / 60),
            sec: number = Math.floor(timeLeft / 1000 - min * 60),
            ms: number = timeLeft - min * 60 * 1000 - sec * 1000;
        return (
            <h1>{min}:{sec}.{ms}</h1>
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
