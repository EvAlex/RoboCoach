
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

interface IWorkoutPlansPageProps {
    children: React.ReactElement<{}>[];
}

interface IWorkoutPlansPageState {
    plans?: IWorkoutPlan[];
    workoutStatus?: WorkoutStore.CurrentWorkoutStatus;
}

export default class WorkoutPlansPage extends React.Component<IWorkoutPlansPageProps, IWorkoutPlansPageState> {
    private workoutPlansStore: WorkoutPlansStore.WorkoutPlansStore = WorkoutPlansStore.default;
    private workoutPlansStoreListenerId: string;
    private workoutStore: WorkoutStore.WorkoutStore = WorkoutStore.default;
    private workoutStoreListenerId: string;

    constructor() {
        super();
        this.state = {
            plans: []
        };
    }

    componentDidMount(): void {
        this.workoutPlansStoreListenerId = this.workoutPlansStore.addListener(() => this.onWorkoutPlansStoreChanged());
        this.workoutStoreListenerId = this.workoutStore.addListener(() => this.onWorkoutStoreChanged());
        CommonActionCreators.requestWorkoutPlans();
    }

    componentWillUnmount(): void {
        this.workoutPlansStore.removeListenerById(this.workoutPlansStoreListenerId);
        this.workoutStore.removeListenerById(this.workoutStoreListenerId);
    }

    render(): React.ReactElement<{}> {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4" >
                        <Link to="workout-plans/create" className="btn btn-success" activeClassName="disabled">
                            Create Workout Plan
                        </Link>

                        <div className="list-group">
                            {this.state.plans.map(p => (
                                    <Link to={`/workout-plans/${p.id}`}
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
