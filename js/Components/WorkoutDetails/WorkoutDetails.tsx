
import React = require("react");

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./WorkoutDetails.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import CommonActionCreators from "../../ActionCreators/CommonActionCreators";
import * as WorkoutStore from "../../Stores/WorkoutStore";
import dispatcher from "../../Dispatcher/Dispatcher";
import IAction from "../../Actions/IAction";
import ProcessRequestWorkoutFailedAction from "../../Actions/ProcessRequestWorkoutFailedAction";
import Workout from "../../Models/Workout";
import WorkoutPlayer from "../WorkoutPlayer/WorkoutPlayer";

interface IWorkoutDetailsProps extends ReactRouter.RouteComponentProps<{ workoutId: string }, {}> {
}

interface IWorkoutDetailsState {
    workout?: Workout;
    workoutRequestError?: IRoboCoachError;
}

export default class WorkoutPlanDetails extends React.Component<IWorkoutDetailsProps, IWorkoutDetailsState> {
    private store: WorkoutStore.WorkoutStore = WorkoutStore.default;
    private onStoreChangeListener: () => void = () => this.onStoreChange();
    private registrationId: string;

    constructor() {
        super();
        this.state = {
            workout: null,
            workoutRequestError: null
        };
    }

    componentDidMount(): void {
        this.store.addListener(this.onStoreChangeListener);
        this.registrationId = dispatcher.register(a => this.processAction(a));
        var workout: IWorkout = this.store.findWorkout(this.props.params.workoutId);
        if (workout !== null) {
            this.setState({
                workout: new Workout(workout),
                workoutRequestError: null
            });
        } else {
            CommonActionCreators.requestWorkout(this.props.params.workoutId);
        }
    }

    componentWillUnmount(): void {
        this.store.removeListener(this.onStoreChangeListener);
        dispatcher.unregister(this.registrationId);
    }

    render(): React.ReactElement<{}> {
        return this.state.workoutRequestError
            ? this.renderError()
            : this.state.workout
                ? this.state.workout.isInProgress
                    ? this.renderWorkoutPlayer()
                    : this.renderDetails()
                : this.renderWorkoutRequestInProgress();
    }

    private renderWorkoutRequestInProgress(): React.ReactElement<{}> {
        return (
            <div className="progress">
                <div className="progress-bar progress-bar-striped active"
                     role="progressbar"
                     aria-valuenow={100}
                     aria-valuemin={0}
                     aria-valuemax={100}
                     style={{width: "100%"}}>
                    <span className="sr-only">Loading your workout...</span>
                </div>
            </div>
        );
    }

    private renderWorkoutPlayer(): React.ReactElement<{}> {
        return (
            <WorkoutPlayer workout={this.state.workout} />
        );
    }

    private renderDetails(): React.ReactElement<{}> {
        return (
            <div>
                <h2>{this.state.workout.planName}</h2>

                <h4>{this.state.workout.planDescription}</h4>

                { this.state.workoutRequestError
                    ? <div className="alert alert-danger">{this.state.workoutRequestError.toString()}</div>
                    : <p>{this.state.workout.planName}</p> }

            </div>
        );
    }

    private renderError(): React.ReactElement<{}> {
        return (
            <div className="alert alert-danger">{this.state.workoutRequestError.toString()}</div>
        );
    }

    private onStoreChange(): void {
        var workout: IWorkout = this.store.findWorkout(this.props.params.workoutId);
        if (workout !== null) {
            this.setState({
                workout: new Workout(workout),
                workoutRequestError: null
            });
        }
    }

    private processAction(action: IAction): void {
        if (action instanceof ProcessRequestWorkoutFailedAction) {
            this.processReceiveWorkoutPlanFailAction(action);
        }
    }

    private processReceiveWorkoutPlanFailAction(action: ProcessRequestWorkoutFailedAction): void {
        if (this.props.params.workoutId === action.WorkoutId) {
            this.setState({
                workout: null,
                workoutRequestError: action.Error
            });
        }
    }
}
