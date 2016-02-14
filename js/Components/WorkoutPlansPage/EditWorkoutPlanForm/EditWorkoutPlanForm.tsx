import React = require("react");
import {Link} from "react-router";

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./EditWorkoutPlanForm.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import {WorkoutPlanForm} from "../WorkoutPlanForm/WorkoutPlanForm";

interface IEditWorkoutPlanFormProps extends ReactRouter.RouteComponentProps<{ planId: string }, {}> {
}

export default class EditWorkoutPlanForm extends WorkoutPlanForm<IEditWorkoutPlanFormProps> {
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
}
