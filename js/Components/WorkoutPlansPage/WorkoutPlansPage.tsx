
import React = require("react");
import {Link} from "react-router";

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./WorkoutPlansPage.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import * as WorkoutStore from "../../Stores/WorkoutStore";

interface IWorkoutPlansPageProps {
    children: React.ReactElement<{}>[];
}

interface IWorkoutPlansPageState {
    workoutStatus?: WorkoutStore.CurrentWorkoutStatus;
}

export default class WorkoutPlansPage extends React.Component<IWorkoutPlansPageProps, IWorkoutPlansPageState> {

    constructor() {
        super();
        this.state = {};
    }

    render(): React.ReactElement<{}> {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4" >
                        <Link to="workout-plans/create" className="btn btn-success" activeClassName="disabled">
                            Create Workout Plan
                        </Link>
                    </div>
                    <div className="col-md-8" >
                        { this.props.children }
                    </div>
                </div>
            </div>
        );
    }
}
