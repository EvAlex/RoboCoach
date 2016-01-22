
import React = require("react");
import {Link} from "react-router";

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./WorkoutPlansPage.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import CommonActionCreators from "../../ActionCreators/CommonActionCreators";
import * as WorkoutStore from "../../Stores/WorkoutStore";
import * as WorkoutPlansStore from "../../Stores/WorkoutPlansStore";
import WorkoutPlan from "../../Models/WorkoutPlan";

interface IWorkoutPlansPageProps {
    children: React.ReactElement<{}>[];
}

interface IWorkoutPlansPageState {
    plans?: WorkoutPlan[];
    workoutStatus?: WorkoutStore.CurrentWorkoutStatus;
}

export default class WorkoutPlansPage extends React.Component<IWorkoutPlansPageProps, IWorkoutPlansPageState> {
    private workoutPlansStore: WorkoutPlansStore.WorkoutPlansStore = WorkoutPlansStore.default;
    private workoutPlansStoreChangedListener: () => void = () => this.onWorkoutPlansStoreChanged();
    private workoutStore: WorkoutStore.WorkoutStore = WorkoutStore.default;
    private workoutStoreChangedListener: () => void = () => this.onWorkoutStoreChanged();

    constructor() {
        super();
        this.state = {
            plans: []
        };
    }

    componentDidMount(): void {
        this.workoutPlansStore.addListener(this.workoutPlansStoreChangedListener);
        this.workoutStore.addListener(this.workoutStoreChangedListener);
        CommonActionCreators.requestWorkoutPlans();
    }

    componentWillUnmount(): void {
        this.workoutPlansStore.removeListener(this.workoutPlansStoreChangedListener);
        this.workoutStore.removeListener(this.workoutStoreChangedListener);
    }

    render(): React.ReactElement<{}> {
        console.log(this.state.plans.length);
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4" >
                        <Link to="workout-plans/create" className="btn btn-success" activeClassName="disabled">
                            Create Workout Plan
                        </Link>

                        <div className="list-group">
                            {this.state.plans.map(p => (
                                    <Link to={"/workout-plans/" + p.id}
                                          className="list-group-item"
                                          activeClassName="active"
                                          key={p.id}>
                                        { p.name }
                                    </Link>
                                ))}
                        </div>
                    </div>
                    <div className="col-md-8" >
                        { this.props.children }
                    </div>
                </div>
            </div>
        );
    }

    private onWorkoutPlansStoreChanged(): void {
        this.setState({
            plans: this.workoutPlansStore.getWorkoutPlans() || []
        });
    }

    private onWorkoutStoreChanged(): void {
        this.setState({
            workoutStatus: this.workoutStore.getCurrentWorkoutStatus()
        });
    }
}
