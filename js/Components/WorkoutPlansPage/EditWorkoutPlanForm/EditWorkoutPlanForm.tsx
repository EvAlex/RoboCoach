import React = require("react");
import {Link} from "react-router";

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./EditWorkoutPlanForm.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import {WorkoutPlanForm, IWorkoutPlanFormState} from "../WorkoutPlanForm/WorkoutPlanForm";
import {AsyncDataComponent} from "../../AsyncDataComponent/AsyncDataComponent";
import WorkoutPlansStore from "../../../Stores/WorkoutPlansStore";
import CommonActionCreators from "../../../ActionCreators/CommonActionCreators";
import IAction from "../../../Actions/IAction";
import ReceiveWorkoutPlanFailAction from "../../../Actions/ReceiveWorkoutPlanFailAction";
import dispatcher from "../../../Dispatcher/Dispatcher";

interface IEditWorkoutPlanFormProps extends ReactRouter.RouteComponentProps<{ planId: string }, {}> {
}

interface IEditWorkoutPlanFormState extends IWorkoutPlanFormState {
    planRequestError?: IRoboCoachError;
}

export default class EditWorkoutPlanForm extends WorkoutPlanForm<IEditWorkoutPlanFormProps, IEditWorkoutPlanFormState> {
    private registrationId: string;

    private onStoreChanged: () => void = () => {
        var plan: IWorkoutPlan = WorkoutPlansStore.findWorkoutPlan(this.props.params.planId);
        if (plan !== null) {
            this.setState({
                plan: plan,
                planRequestError: null
            });
        }
    };

    constructor() {
        super();
        this.state = { plan: null };
    }

    render(): React.ReactElement<{}> {
        return this.state.plan
            ? super.render()
            : this.state.planRequestError
                ? this.renderPlanRequestError()
                : this.renderRequestProgress();
    }

    renderPlanRequestError(): React.ReactElement<{}> {
        return (
            <div className="alert alert-danger" role="alert">
                 <strong>Not found!</strong> Workout Plan with specified id does not exist.
            </div>
        );
    }

    renderRequestProgress(): React.ReactElement<{}> {
        return (
            <div className="progress">
                <div className="progress-bar progress-bar-striped active"
                     role="progressbar"
                     aria-valuenow={100}
                     aria-valuemin={0}
                     aria-valuemax={100}
                     style={{width: "100%"}}>
                    <span className="sr-only">100% Complete</span>
                </div>
            </div>

        );
    }

    componentDidMount(): void {
        WorkoutPlansStore.addListener(this.onStoreChanged);
        this.registrationId = dispatcher.register(a => this.processAction(a));
        this.setOrRequestPlan(this.props.params.planId);
    }

    componentWillReceiveProps(nextProps: IEditWorkoutPlanFormProps): void {
        this.setOrRequestPlan(nextProps.params.planId);
    }

    componentWillUnmount(): void {
        WorkoutPlansStore.removeListener(this.onStoreChanged);
        dispatcher.unregister(this.registrationId);
    }

    renderFormTitle(): React.ReactElement<{}> {
        return (
            <h2>Edit Plan</h2>
        );
    }

    renderCancelButton(): React.ReactElement<{}> {
        return (
            <Link to={`/workout-plans/${this.props.params.planId}`} className="btn btn-default">Cancel</Link>
        );
    }

    private setOrRequestPlan(planId: string): void {
        var plan: IWorkoutPlan = WorkoutPlansStore.findWorkoutPlan(planId);
        if (plan !== null) {
            this.setState({
                plan: plan,
                planRequestError: null,
            });
        } else {
            CommonActionCreators.requestWorkoutPlan(this.props.params.planId);
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

class EditWorkoutPlanFormWrapper extends AsyncDataComponent<EditWorkoutPlanForm, IWorkoutPlan> {
    constructor() {
        super(new EditWorkoutPlanForm());
    }

    findAvailableData(): IWorkoutPlan {
        return WorkoutPlansStore.findWorkoutPlan("");
    }

    onDataMayBeAvailable(): void {
        // nothing
    }

    requestData(): void {
        // nothing
    }
}
