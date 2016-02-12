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
    private pendingFocus: boolean = false;

    constructor() {
        super();
        this.state = {
            plan: new WorkoutPlan()
        };
        this.state.plan.actions.push({ duration: 30000, exercise: { name: "" } });
    }

    render(): React.ReactElement<{}> {
        return (
            <div>
                <h2>Create Plan...</h2>
                <form className="form-horizontal"
                      onSubmit={e => this.onFormSubmit(e)}
                      onKeyDown={e => this.onKeyDown(e)}>

                    <div className="form-group">
                        <label htmlFor="inputEmail3" className="col-sm-2 control-label">Name</label>
                        <div className="col-sm-9">
                            <input type="text"
                                   className="form-control"
                                   id="inputName"
                                   placeholder="Plan name"
                                   value={this.state.plan.name}
                                       onChange={e => this.onNameChanged(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputDesc" className="col-sm-2 control-label">Description</label>
                        <div className="col-sm-9">
                            <input type="text"
                                   className="form-control"
                                   id="inputDesc"
                                   placeholder="Plan description" />
                        </div>
                    </div>
                    {this.state.plan.actions.map((a, index) => (
                    <div key={ index } className={styles.planAction}>
                        <div className="form-group">
                            <label htmlFor="inputActionName" className="col-sm-2 control-label">
                                { index + 1 }.
                            </label>
                            <div className="col-sm-3">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <span className="glyphicon glyphicon-time"></span>
                                    </span>
                                    <input type="text"
                                           value={ (a.duration / 1000 ).toString() }
                                           className="form-control"
                                           id="inputActionDuration"
                                           placeholder="40"
                                           onChange={ (e: any) => this.onActionDurationChanged(e, a) } />
                                    <span className="input-group-addon">sec</span>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                { "exercise" in a
                                    ? (
                                        <input type="text"
                                               value={ a.exercise.name }
                                               onChange={ (e: any) => {
                                                            a["exercise"].name = e.target.value;
                                                            this.setState(this.state);
                                                        }}
                                               className="form-control"
                                               ref={`actionName[${index}]`}
                                               placeholder="Action Name" />
                                    )
                                    : <span className={styles.restText}>Rest</span>}

                            </div>
                            <div className="col-sm-1">
                                <button type="button"
                                        className={styles.removeAction}
                                        onClick={() => this.onRemoveActionClick(a)}>
                                    &times;
                                </button>
                            </div>
                        </div>
                    </div>
                    ))}
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-3">
                            <button className="btn btn-default" onClick={e => this.onAddActionClicked(e)}>+</button>
                            <i className="text-muted"> Ctrl + Enter</i>
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

    onKeyDown(e: React.KeyboardEvent): void {
        var code: number = e.which || e.keyCode;
        if (code === 13 && e.ctrlKey) {
            // Ctrl + Enter
            this.onAddActionClicked(e);
        }
    }

    onAddActionClicked(e: any): void {
        e.preventDefault();
        var previous: IWorkoutPlanAction = this.state.plan.actions[this.state.plan.actions.length - 1];

        if ("exercise" in previous) {
            this.state.plan.actions.push( { duration: 10000 });
        } else {
            this.state.plan.actions.push( { duration: 30000, exercise: { name: "" } });
            this.pendingFocus = true;
        }

        this.forceUpdate();
    }

    onRemoveActionClick(action: IWorkoutPlanAction): void {
        if (this.state.plan.actions.length > 1) {
            this.state.plan.actions.splice(this.state.plan.actions.indexOf(action), 1);
            this.forceUpdate();
        }
    }

    onActionDurationChanged(e: any, action: IWorkoutPlanAction): void {
        action.duration = Number(e.target.value) * 1000;
        this.forceUpdate();
    }

    componentDidMount(): void {
        Dispatcher.register(a => this.processActions(a));
        this.processPendingFocus();
    }

    componentDidUpdate(): void {
        this.processPendingFocus();
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

    private processPendingFocus(): void {
        if (this.pendingFocus) {
            if (this.state.plan.actions.length > 0) {
                var actions: IWorkoutPlanAction[] = this.state.plan.actions,
                    lastAction: IWorkoutPlanAction = actions[actions.length - 1],
                    lastExerciseIndex: number = lastAction.exercise
                        ? actions.length - 1
                        : actions.length - 2,
                    input: any = this.refs[`actionName[${lastExerciseIndex}]`];
                if (input) {
                    input.focus();
                }
            }

            this.pendingFocus = false;
        }
    }
}
