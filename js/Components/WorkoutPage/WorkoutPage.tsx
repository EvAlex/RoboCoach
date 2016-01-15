
import React = require("react");

/* tslint:disable:no-any */
const styles: any = require("./WorkoutPage.module.less");
/* tslint:enable:no-any */

import CommonActionCreators from "../../ActionCreators/CommonActionCreators";
import * as WorkoutStore from "../../Stores/WorkoutStore";

interface IWorkoutPageState {
    workoutStatus: WorkoutStore.CurrentWorkoutStatus;
}

export default class WorkoutPage extends React.Component<{}, IWorkoutPageState> {
    private store: WorkoutStore.WorkoutStore = WorkoutStore.default;

    constructor() {
        super();
        this.state = {
            workoutStatus: this.store.getCurrentWorkoutStatus()
        };
        this.store.addListener(() => this.onStoreChange());
    }

    render(): React.ReactElement<{}> {
        var content: React.ReactElement<{}>;
        switch (this.state.workoutStatus) {
            case WorkoutStore.CurrentWorkoutStatus.Loading:
                content = <span>Workout is loading...</span>;
                break;
            case WorkoutStore.CurrentWorkoutStatus.LoadFailed:
                content = <span>Workout load failed.</span>;
                break;
            case WorkoutStore.CurrentWorkoutStatus.NotStarted:
                content =
                    <button className="btn btn-lg btn-success" onClick={() => this.onStartWorkoutClick()}>
                        <span className="glyphicon glyphicon-fire"></span> Start Workout
                    </button>;
                break;
            case WorkoutStore.CurrentWorkoutStatus.Started:
                content = <span>Workout is started.</span>;
                break;
            case WorkoutStore.CurrentWorkoutStatus.Finished:
                content = <span>Workout is finished.</span>;
                break;
            default:
                content =
                    <span>
                        I'm sorry, but something went wrong.
                        I've faced unexpected CurrentWorkoutStatus enum value if you are interested.
                    </span>;
                break;
        }
        return      <div className={styles.container}>
                        {content}
                    </div>;
    }

    onStartWorkoutClick(): void {
        CommonActionCreators.startWorkout(this.store.getCurrentWorkoutPlan());
    }

    onStoreChange(): void {
        this.setState({ workoutStatus: this.store.getCurrentWorkoutStatus() });
    }

}
