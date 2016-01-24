import React = require("react");
import {Link} from "react-router";
import Dispatcher from "../../Dispatcher/Dispatcher";

/* tslint:disable:no-any */
/* tslint:disable:no-unused-variable */
const styles: any = require("./CreateWorkoutPlan.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import WorkoutPlan from "../../Models/WorkoutPlan";
import CommonActionCreators from "../../ActionCreators/CommonActionCreators";
import IAction from "../../Actions/IAction";
import CreateWorkoutPlanSuccessAction from "../../Actions/CreateWorkoutPlanSuccessAction";
import CreateWorkoutPlanFailAction from "../../Actions/CreateWorkoutPlanFailAction";

interface ICreateWorkoutPlansProps extends ReactRouter.RouteComponentProps<{}, {}> {
}

interface ICreateWorkoutPlansState {
    plan: WorkoutPlan;
}

export default class CreateWorkoutPlan extends React.Component<ICreateWorkoutPlansProps, ICreateWorkoutPlansState> {

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
                <form className="form-horizontal" onSubmit={e => this.onFormSubmit(e)}>

                    <div className="form-group">
                        <label htmlFor="inputEmail3" className="col-sm-2 control-label">Name</label>
                        <div className="col-sm-10">
                            <input type="text"
                                   className="form-control"
                                   id="inputName"
                                   placeholder="Input name"
                                   value={this.state.plan.name}
                                       onChange={e => this.onNameChanged(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputDesc" className="col-sm-2 control-label">Description</label>
                        <div className="col-sm-10">
                            <input type="text"
                                   className="form-control"
                                   id="inputDesc"
                                   placeholder="Description" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputActionName" className="col-sm-2 control-label">
                            Action #{this.state.plan.actions.length + 1}
                        </label>
                        <div className="col-sm-4">
                            <input type="text"
                                   className="form-control"
                                   id="inputActionName"
                                   placeholder="Action Name" />
                        </div>
                        <div className="col-sm-2">
                            <input type="text"
                                   className="form-control"
                                   id="inputActionDuration"
                                   placeholder="40" />
                        </div>
                        <label className="control-label" htmlFor="inputActionDuration">sec</label>
                        <button className="btn btn-default" onClick={e => this.onAddActionClicked(e)}>+</button>
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
                            <button type="submit" className="btn btn-success">Create</button>
                            <Link to="/workout-plans" className="btn btn-default">Cancel</Link>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    onAddActionClicked(e: any): void {
        e.preventDefault();
        alert("123");
    }

    componentDidMount(): void {
        Dispatcher.register(a => this.processActions(a));
    }

    onNameChanged(e: any): void {
        this.state.plan.name = e.target.value;
        this.setState(this.state);
    }

    onFormSubmit(e: any): void {
        e.preventDefault();
        CommonActionCreators.createWorkoutPlan(this.state.plan);
    }

    processSuccessSubmitted(action: CreateWorkoutPlanSuccessAction): void {
        this.props.history.pushState(null, `/workout-plans/${action.WorkoutPlan.id}`);
    }

    processFailedSubmit(action: CreateWorkoutPlanFailAction): void {
        alert(action.Error.toString());
    }

    private processActions(action: IAction): void {
        if (action instanceof CreateWorkoutPlanSuccessAction) {
            this.processSuccessSubmitted(action);
        } else if (action instanceof CreateWorkoutPlanFailAction) {
            this.processFailedSubmit(action);
        }
    }
}
