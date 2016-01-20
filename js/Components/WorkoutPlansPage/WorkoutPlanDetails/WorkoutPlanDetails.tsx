
import React = require("react");

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./WorkoutPlanDetails.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import CommonActionCreators from "../../../ActionCreators/CommonActionCreators";
import * as WorkoutPlansStore from "../../../Stores/WorkoutPlansStore";
import WorkoutPlan from "../../../Models/WorkoutPlan";

interface IWorkoutDetailsProps {
    params: {
        planId: string
    };
}

interface IWorkoutDetailsState {
    plan: WorkoutPlan;
}

export default class WorkoutPlanDetails extends React.Component<IWorkoutDetailsProps, IWorkoutDetailsState> {
    private store: WorkoutPlansStore.WorkoutPlansStore = WorkoutPlansStore.default;
    private onStoreChangeListener: () => void = () => this.onStoreChange();

    constructor() {
        super();
        this.state = {
            plan: new WorkoutPlan()
        };
    }

    componentDidMount(): void {
        this.store.addListener(this.onStoreChangeListener);
        var plan: WorkoutPlan = this.store.findWorkoutPlan(this.props.params.planId);
        if (plan !== null) {
            this.setState({
                plan: plan
            });
        } else {
            CommonActionCreators.requestWorkoutPlan(this.props.params.planId);
        }
    }

    componentWillUnmount(): void {
        this.store.removeListener(this.onStoreChangeListener);
    }

    render(): React.ReactElement<{}> {
        return (
            <div>
                <h2>Workout Plan {this.props.params.planId}</h2>
                <p>{this.state.plan.description}</p>
            </div>
        );
    }

    private onStoreChange(): void {
        var plan: WorkoutPlan = this.store.findWorkoutPlan(this.props.params.planId);
        if (plan !== null) {
            this.setState({
                plan: plan
            });
        }
    }
}
