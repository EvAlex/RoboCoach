
import React = require("react");

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./WorkoutPlansPage.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import * as WorkoutStore from "../../Stores/WorkoutStore";
import CreateWorkoutPlan from "../CreateWorkoutPlan/CreateWorkoutPlan";

interface IWorkoutPlansPageState {
    workoutStatus?: WorkoutStore.CurrentWorkoutStatus;
    createFormShown?: boolean;
}

export default class WorkoutPlansPage extends React.Component<{}, IWorkoutPlansPageState> {

    constructor() {
        super();
        this.state = {};
    }

    render(): React.ReactElement<{}> {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4" >
                        <button className="btn btn-success" onClick={() => this.OnCreatePlanButtonClicked()}>
                            Create Workout Plan
                        </button>
                    </div>
                    <div className="col-md-8" >
                        {
                            this.state.createFormShown ? <CreateWorkoutPlan /> : <div />
                    }
                    </div>
                </div>
            </div>
        );
    }

    OnCreatePlanButtonClicked(): void {
        this.setState({ createFormShown: true });
    }
}
