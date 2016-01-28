
import React = require("react");

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./WorkoutPlanDetails.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import CommonActionCreators from "../../../ActionCreators/CommonActionCreators";
import * as WorkoutPlansStore from "../../../Stores/WorkoutPlansStore";
import WorkoutPlan from "../../../Models/WorkoutPlan";
import dispatcher from "../../../Dispatcher/Dispatcher";
import IAction from "../../../Actions/IAction";
import ReceiveWorkoutPlanFailAction from "../../../Actions/ReceiveWorkoutPlanFailAction";
import ProcessWorkoutStartedAction from "../../../Actions/ProcessWorkoutStartedAction";
import ProcessWorkoutStartFailedAction from "../../../Actions/ProcessWorkoutStartFailedAction";

interface IWorkoutDetailsProps extends ReactRouter.RouteComponentProps<{ planId: string }, {}> {
}

interface IWorkoutDetailsState {
    plan?: WorkoutPlan;
    planRequestError?: IRoboCoachError;
    workoutStartError?: IRoboCoachError;
}

export default class WorkoutPlanDetails extends React.Component<IWorkoutDetailsProps, IWorkoutDetailsState> {
    private store: WorkoutPlansStore.WorkoutPlansStore = WorkoutPlansStore.default;
    private onStoreChangeListener: () => void = () => this.onStoreChange();
    private registrationId: string;

    constructor() {
        super();
        this.state = {
            plan: new WorkoutPlan(),
            planRequestError: null,
            workoutStartError: null
        };
    }

    componentDidMount(): void {
        this.store.addListener(this.onStoreChangeListener);
        this.registrationId = dispatcher.register(a => this.processAction(a));
        this.setOrRequestPlan(this.props.params.planId);
    }

    componentWillReceiveProps(nextProps: IWorkoutDetailsProps): void {
        this.setOrRequestPlan(nextProps.params.planId);
    }

    componentWillUnmount(): void {
        this.store.removeListener(this.onStoreChangeListener);
        dispatcher.unregister(this.registrationId);
    }

    render(): React.ReactElement<{}> {
        return this.state.planRequestError
            ? this.renderError()
            : this.renderDetails();
    }

    private renderError(): React.ReactElement<{}> {
        return (
            <div className="alert alert-danger">{this.state.planRequestError.toString()}</div>
        );
    }

    private renderDetails(): React.ReactElement<{}> {
        return (
            <div>
                <h2>
                    {this.state.plan.name}
                    <button className="btn btn-success pull-right" onClick={() => this.onStartWorkoutClicked()}>
                        <span className="glyphicon glyphicon-fire"></span>
                        <span> Start Workout</span>
                    </button>
                </h2>

                { this.state.planRequestError
                    ? <div className="alert alert-danger">{this.state.planRequestError.toString()}</div>
                    : <p>{this.state.plan.name}</p> }

            </div>
        );
    }

    private onStartWorkoutClicked(): void {
        CommonActionCreators.startWorkout(this.state.plan);
    }

    private setOrRequestPlan(planId: string): void {
        var plan: WorkoutPlan = this.store.findWorkoutPlan(planId);
        if (plan !== null) {
            this.setState({
                plan: plan,
                planRequestError: null,
                workoutStartError: null
            });
        } else {
            CommonActionCreators.requestWorkoutPlan(this.props.params.planId);
        }
    }

    private onStoreChange(): void {
        var plan: WorkoutPlan = this.store.findWorkoutPlan(this.props.params.planId);
        if (plan !== null) {
            this.setState({
                plan: plan,
                planRequestError: null
            });
        }
    }

    private processAction(action: IAction): void {
        if (action instanceof ReceiveWorkoutPlanFailAction) {
            this.processReceiveWorkoutPlanFailAction(action);
        } else if (action instanceof ProcessWorkoutStartedAction) {
            this.processWorkoutStartedAction(action);
        } else if (action instanceof ProcessWorkoutStartFailedAction) {
            this.processWorkoutStartFailedAction(action);
        }
    }

    private processReceiveWorkoutPlanFailAction(action: ReceiveWorkoutPlanFailAction): void {
        if (this.props.params.planId === action.PlanId) {
            this.setState({
                plan: null,
                planRequestError: action.Error
            });
        }
    }

    private processWorkoutStartedAction(action: ProcessWorkoutStartedAction): void {
        if (this.state.workoutStartError) {
            this.setState({
                workoutStartError: null
            });
        }
        this.props.history.pushState(null, `/workout/${action.Workout.id}`);
    }

    private processWorkoutStartFailedAction(action: ProcessWorkoutStartFailedAction): void {
        this.setState({
            workoutStartError: action.Error
        });
    }
}
