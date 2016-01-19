import React = require("react");

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./CreateWorkoutPlan.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import WorkoutPlan from "../../Models/WorkoutPlan";

interface ICreateWorkoutPlansState {
    plan: WorkoutPlan;
}

export default class CreateWorkoutPlan extends React.Component<{}, ICreateWorkoutPlansState> {

    constructor() {
        super();
        this.state = {
            plan: new WorkoutPlan()
        };
    }

    render(): React.ReactElement<{}> {
        return (
            <div>
                <h2>Create Plan...</h2>
                <form className="form-horizontal">

                    <div className="form-group">
                        <label htmlFor="inputEmail3" className="col-sm-2 control-label">Name</label>
                        <div className="col-sm-10">
                            <input type="text"
                                   className="form-control"
                                   id="inputEmail3"
                                   placeholder="Input name"
                                   value={this.state.plan.name}
                                       onChange={e => this.onNameChanged(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputPassword3" className="col-sm-2 control-label">Description</label>
                        <div className="col-sm-10">
                            <input type="password" className="form-control" id="inputPassword3" placeholder="Password" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" /> Remember me
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn-default">Create</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    onNameChanged(e: any): void {
        this.state.plan.name = e.target.value;
        this.setState(this.state);
    }
}
