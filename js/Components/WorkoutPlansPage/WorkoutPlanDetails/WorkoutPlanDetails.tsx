
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

interface IWorkoutDetailsProps {
    params: {
        planId: string
    };
}

interface IWorkoutDetailsState {
    plan?: WorkoutPlan;
    planRequestError?: IRoboCoachError;
}

export default class WorkoutPlanDetails extends React.Component<IWorkoutDetailsProps, IWorkoutDetailsState> {
    private store: WorkoutPlansStore.WorkoutPlansStore = WorkoutPlansStore.default;
    private onStoreChangeListener: () => void = () => this.onStoreChange();
    private registrationId: string;

    constructor() {
        super();
        this.state = {
            plan: new WorkoutPlan(),
            planRequestError: null
        };
    }

    componentDidMount(): void {
        this.store.addListener(this.onStoreChangeListener);
        this.registrationId = dispatcher.register(a => this.processAction(a));
        var plan: WorkoutPlan = this.store.findWorkoutPlan(this.props.params.planId);
        if (plan !== null) {
            this.setState({
                plan: plan,
                planRequestError: null
            });
        } else {
            CommonActionCreators.requestWorkoutPlan(this.props.params.planId);
        }
    }

    componentWillUnmount(): void {
        this.store.removeListener(this.onStoreChangeListener);
        dispatcher.unregister(this.registrationId);
    }

    render(): React.ReactElement<{}> {
        return (
            <div>
                <h2>Workout Plan {this.props.params.planId}</h2>

                { this.state.planRequestError
                    ? <div className="alert alert-danger">{this.state.planRequestError.toString()}</div>
                    : <p>{this.state.plan.name}</p> }

            </div>
        );
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
}
