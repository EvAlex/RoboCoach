import React = require("react");
import {Link} from "react-router";

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./CreateWorkoutPlanForm.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import {WorkoutPlanForm} from "../WorkoutPlanForm/WorkoutPlanForm";
import CommonActionCreators from "../../../ActionCreators/CommonActionCreators";

export default class CreateWorkoutPlanForm extends WorkoutPlanForm<{}, { plan: IWorkoutPlan }> {
    constructor() {
        super();
        this.state = {
            plan: {
                id: null,
                name: "",
                description: "",
                actions: [
                    { duration: 15000 }
                ] }
        };
    }

    renderFormTitle(): React.ReactElement<{}> {
        return (
            <h2>Create Plan</h2>
        );
    }

    renderSubmitButton(): React.ReactElement<{}> {
            return (
                <button type="submit" className="btn btn-success">Create</button>
            );
    }

    renderCancelButton(): React.ReactElement<{}> {
        return (
            <Link to="/workout-plans" className="btn btn-default">Cancel</Link>
        );
    }

    handleFormSubmit(): void {
        CommonActionCreators.createWorkoutPlan(this.state.plan);
    }
}
