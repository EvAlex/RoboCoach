
import React = require("react");
import {Link} from "react-router";

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./WorkoutPlanDetails.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import Duration from "../../Duration/Duration";

import CommonActionCreators from "../../../ActionCreators/CommonActionCreators";
import * as WorkoutPlansStore from "../../../Stores/WorkoutPlansStore";
import UserStore from "../../../Stores/UserStore";
import WorkoutPlan from "../../../Models/WorkoutPlan";
import dispatcher from "../../../Dispatcher/Dispatcher";
import IAction from "../../../Actions/IAction";
import ReceiveWorkoutPlanFailAction from "../../../Actions/ReceiveWorkoutPlanFailAction";
import ProcessWorkoutStartedAction from "../../../Actions/ProcessWorkoutStartedAction";
import ProcessWorkoutStartFailedAction from "../../../Actions/ProcessWorkoutStartFailedAction";

interface IWorkoutDetailsProps extends ReactRouter.RouteComponentProps<{ planId: string }, {}> {
}

interface IWorkoutDetailsState {
    plan?: IWorkoutPlan;
    planRequestError?: IRoboCoachError;
    workoutStartError?: IRoboCoachError;
}

export default class WorkoutPlanDetails extends React.Component<IWorkoutDetailsProps, IWorkoutDetailsState> {
    private store: WorkoutPlansStore.WorkoutPlansStore = WorkoutPlansStore.default;
    private storeListenerId: string;
    private registrationId: string;

    private minActionHeight: number = 50;

    constructor() {
        super();
        this.state = {
            plan: new WorkoutPlan(),
            planRequestError: null,
            workoutStartError: null
        };
    }

    componentDidMount(): void {
        this.storeListenerId = this.store.addListener(() => this.onStoreChange());
        this.registrationId = dispatcher.register(a => this.processAction(a));
        this.setOrRequestPlan(this.props.params.planId);
    }

    componentWillReceiveProps(nextProps: IWorkoutDetailsProps): void {
        this.setOrRequestPlan(nextProps.params.planId);
    }

    componentWillUnmount(): void {
        this.store.removeListenerById(this.storeListenerId);
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

                    <div className="btn-group pull-right">
                        <Link to={`/workout-plans/${this.props.params.planId}/edit`}
                              className="btn btn-default">
                            <span className="glyphicon glyphicon-edit"></span>
                            <span> Edit</span>
                        </Link>
                        <button className="btn btn-success" onClick={() => this.onStartWorkoutClicked()}>
                            <span className="glyphicon glyphicon-fire"></span>
                            <span> Start Workout</span>
                        </button>
                    </div>
                </h2>

                <p>{this.state.plan.description}</p>

                {this.renderPlanActions(this.state.plan)}

            </div>
        );
    }

    private renderPlanActions(plan: IWorkoutPlan): React.ReactElement<{}> {
        if (!plan.actions || !plan.actions.length) {
            return <div></div>;
        }
        let planDuration: number = plan.actions.reduce((p, c) => p + c.duration, 0),
            minActionDuration: number = plan.actions.slice().sort((a, b) => a.duration - b.duration)[0].duration;
        return (
            <div>
                {
                    plan.actions.map((a: any, i: number) => {
                        return "exercise" in a
                            ? this.renderExerciseAction(a, i, planDuration, minActionDuration)
                            : this.renderRestAction(a, i, planDuration, minActionDuration);
                    })
                }
            </div>
        );
    }

    private renderRestAction(
        action: IRestPlanAction,
        index: number,
        planDuration: number,
        minActionDuration: number): React.ReactElement<{}> {
        let height: number = this.minActionHeight / minActionDuration * action.duration,
            style: { [key: string]: string} = {
                height: height + "px"
            };
        return (
            <div className={styles.planActionRest}
                 key={index}
                 style={style}>
                <div className={styles.planActionDurationWrap}>
                    <span className="glyphicon glyphicon-time"></span>
                    <Duration ms={action.duration}/>
                </div>
                <div className={styles.planActionDetailsWrap}>
                    <span className={styles.planActionName}></span>
                </div>
            </div>
        );
    }

    private renderExerciseAction(
        action: IExercisePlanAction,
        index: number,
        planDuration: number,
        minActionDuration: number): React.ReactElement<{}> {
        let height: number = this.minActionHeight / minActionDuration * action.duration,
            style: { [key: string]: string} = {
                height: height + "px"
            };
        return (
            <div className={styles.planActionExercise}
                 key={index}
                 style={style}>
                <div className={styles.planActionDurationWrap}>
                    <span className="glyphicon glyphicon-time"></span>
                    <Duration ms={action.duration}/>
                </div>
                <div className={styles.planActionDetailsWrap}>
                    <span className={styles.planActionName}>{action.exercise.name}</span>
                </div>
            </div>
        );
    }

    private onStartWorkoutClicked(): void {
        CommonActionCreators.startWorkout(this.state.plan, UserStore.getCurrentUser());
    }

    private setOrRequestPlan(planId: string): void {
        var plan: IWorkoutPlan = this.store.findWorkoutPlan(planId);
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
        var plan: IWorkoutPlan = this.store.findWorkoutPlan(this.props.params.planId);
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
