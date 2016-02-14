import React = require("react");
import {Link} from "react-router";

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./CreateWorkoutPlanForm.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import {WorkoutPlanForm} from "../WorkoutPlanForm/WorkoutPlanForm";

export default class CreateWorkoutPlanForm extends WorkoutPlanForm<{}> {
    renderFormTitle(): React.ReactElement<{}> {
        return (
            <h2>Create Plan</h2>
        );
    }
    renderCancelButton(): React.ReactElement<{}> {
        return (
            <Link to="/workout-plans" className="btn btn-default">Cancel</Link>
        );
    }
}
