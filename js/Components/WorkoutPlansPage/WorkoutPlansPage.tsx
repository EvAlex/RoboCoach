
import React = require("react");

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./WorkoutPlansPage.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import * as WorkoutStore from "../../Stores/WorkoutStore";

interface IWorkoutPlansPageState {
    workoutStatus: WorkoutStore.CurrentWorkoutStatus;
}

export default class WorkoutPlansPage extends React.Component<{}, IWorkoutPlansPageState> {

    render(): React.ReactElement<{}> {
        return  <div>
                    Workout Plans Here
                </div>;
    }
}
