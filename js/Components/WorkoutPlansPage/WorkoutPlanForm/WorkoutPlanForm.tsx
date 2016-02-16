import React = require("react");
import Dispatcher from "../../../Dispatcher/Dispatcher";

/* tslint:disable:no-unused-variable */
import * as bs from "react-bootstrap";
/* tslint:disable:no-any */
const styles: any = require("./WorkoutPlanForm.module.less");
/* tslint:enable:no-any */
/* tslint:enable:no-unused-variable */

import IAction from "../../../Actions/IAction";

interface IWorkoutPlanActionContext {
    action: IWorkoutPlanAction;
    actionsDropdownExpanded: boolean;
    descriptionDisplayed: boolean;
}

export interface IWorkoutPlanFormProps extends ReactRouter.RouteComponentProps<{}, {}> {
}

export interface IWorkoutPlanFormState {
    plan: IWorkoutPlan;
    draggedActionIndex?: number;
    dropTargetActionIndex?: number;
    actionsContexts?: IWorkoutPlanActionContext[];
}

export abstract class WorkoutPlanForm<TProps extends IWorkoutPlanFormProps, TState extends IWorkoutPlanFormState>
    extends React.Component<TProps, TState> {
    private pendingFocus: boolean = false;

    constructor() {
        super();
    }

    render(): React.ReactElement<{}> {
        return (
            <div>
                {this.renderFormTitle() }
                <form className="form-horizontal"
                    onSubmit={e => this.onFormSubmit(e) }
                    onKeyDown={e => this.onKeyDown(e) }>

                    <div className="form-group">
                        <label htmlFor="inputEmail3" className="col-sm-2 control-label">Name</label>
                        <div className="col-sm-9">
                            <input type="text"
                                className="form-control"
                                id="inputName"
                                placeholder="Plan name"
                                value={this.state.plan.name}
                                onChange={e => this.onNameChanged(e) } />
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
                    <div className={ `${styles.planActionsList} ${!!this.state.draggedActionIndex ? styles.dragging : ""}`}
                        onDragOver={e => this.onDragOverActionsList(e) }
                        onDrop={e => this.onDropActionToActionsList(e) }>
                        {this.state.plan.actions.map((a, index) => (
                            <div key={ index }
                                ref={`actionListItem${index}`}
                                className={
                                    `${styles.planAction}
                                  ${index === this.state.draggedActionIndex ? styles.dragged : ""}
                                  ${index === this.state.dropTargetActionIndex ? styles.dropTarget : ""}`
                                }
                                draggable={true}
                                onDragStart={e => this.onActionDragStart(e, index) }
                                onDragEnd={e => this.onActionDragEnd(e) }>
                                <div className="form-group">
                                    <div className="col-sm-1">
                                        <div className={styles.actionDragZone}>
                                            <span className="glyphicon glyphicon-resize-vertical"></span>
                                        </div>
                                    </div>
                                    <label htmlFor="inputActionName" className="col-sm-1 control-label">
                                        { index + 1 }.
                                    </label>
                                    <div className="col-sm-3">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <span className="glyphicon glyphicon-time"></span>
                                            </span>
                                            <input type="text"
                                                value={ (a.duration / 1000).toString() }
                                                className="form-control"
                                                id="inputActionDuration"
                                                placeholder="40"
                                                onChange={ (e: any) => this.onActionDurationChanged(e, a) } />
                                            <span className="input-group-addon">sec</span>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        { "exercise" in a
                                            ? this.renderActionNameInput(a, index)
                                            : <span className={styles.restText}>Rest</span>}

                                    </div>
                                    <div className="col-sm-1">
                                        <button type="button"
                                            className={styles.removeAction}
                                            onClick={() => this.onRemoveActionClick(a) }>
                                            &times;
                                        </button>
                                    </div>
                                </div>
                                { a.exercise && "description" in a.exercise ? this.renderExerciseDescription(a, index) : <text></text> }
                            </div>
                        )) }
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-3">
                            <button className="btn btn-default" onClick={e => this.onAddActionClicked(e) }>+</button>
                            <i className="text-muted"> Ctrl + Enter</i>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <div className="btn-group">
                                {this.renderSubmitButton() }
                                {this.renderCancelButton() }
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    renderExerciseDescription(action: IWorkoutPlanAction, index: number): React.ReactElement<{}> {
        return (
            <div className={`form-group ${styles.actionDescriptionWrap}`}>
                <label htmlFor={`action-desc${index}`}
                    className="col-sm-2 col-sm-offset-3 control-label">
                    Description
                </label>
                <div className="col-sm-6">
                    <textarea className="form-control"
                        id={`action-desc${index}`}
                        placeholder="description" />
                </div>
            </div>
        );
    }

    renderFormTitle(): React.ReactElement<{}> {
        return (
            <div></div>
        );
    }

    renderActionNameInput(action: IWorkoutPlanAction, index: number): React.ReactElement<{}> {
        return (
            <div className="input-group">
                <input type="text"
                    className="form-control"
                    value={ action.exercise.name }
                    onChange={ (e: any) => this.onActionNameChanged(e, action) }
                    ref={`actionName[${index}]`}
                    placeholder="Action Name"/>
                <div className="input-group-btn">
                    <bs.DropdownButton title="" id={`action-tools-dropdown${index}`}>
                        <bs.MenuItem key="1"
                            onClick={() => {
                                action.exercise.description = action.exercise.description || "";
                                this.forceUpdate();
                            } }>
                            <bs.Glyphicon glyph="edit"/> Add Description
                        </bs.MenuItem>
                        <bs.MenuItem key="2">
                            <bs.Glyphicon glyph="film"/> Add Media
                        </bs.MenuItem>
                    </bs.DropdownButton>
                </div>
            </div>

        );
    }

    abstract renderSubmitButton(): React.ReactElement<{}>

    abstract renderCancelButton(): React.ReactElement<{}>

    onKeyDown(e: React.KeyboardEvent): void {
        var code: number = e.which || e.keyCode;
        if (code === 13 && e.ctrlKey) {
            // Ctrl + Enter
            this.onAddActionClicked(e);
        }
    }

    onActionNameChanged(e: any, action: IWorkoutPlanAction): void {
        action.exercise.name = e.target.value;
        this.forceUpdate();
    }

    onAddActionClicked(e: any): void {
        e.preventDefault();
        var previous: IWorkoutPlanAction = this.state.plan.actions[this.state.plan.actions.length - 1];

        if ("exercise" in previous) {
            this.state.plan.actions.push({ duration: 10000 });
        } else {
            this.state.plan.actions.push({ duration: 30000, exercise: { name: "" } });
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

    componentWillMount(): void {
        this.setPlanActionsContexts();
    }

    componentDidMount(): void {
        Dispatcher.register(a => this.processActions(a));
        this.processPendingFocus();
    }

    componentWillUpdate(): void {
        this.setPlanActionsContexts();
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
        this.handleFormSubmit();
    }

    abstract handleFormSubmit(): void;

    abstract processActions(action: IAction): void;

    private setPlanActionsContexts(): void {
        if (this.state.plan && this.state.plan.actions) {
            if (!this.state.actionsContexts) {
                this.state.actionsContexts = [];
            }
            this.state.plan.actions.forEach(
                a => {
                    if (!this.state.actionsContexts.filter(c => c.action === a)) {
                        this.state.actionsContexts.push({
                            action: a,
                            descriptionDisplayed: false,
                            actionsDropdownExpanded: false
                        });
                    }
                }
            );
        }

    }
    /*
        private isActionsDropdownExpanded(action: IWorkoutPlanAction): boolean {
            return this.state.actionsContexts.filter(c => c.action === action)[0].actionsDropdownExpanded;
        }
    */
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

    private onActionDragStart(e: React.DragEvent, actionIndex: number): void {
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData("text/plain", actionIndex.toString());
        this.state.draggedActionIndex = actionIndex;
        this.forceUpdate();
    }

    private onActionDragEnd(e: React.DragEvent): void {
        this.state.draggedActionIndex = null;
        this.state.dropTargetActionIndex = null;
        this.forceUpdate();
    }

    private onDragOverActionsList(e: React.DragEvent): void {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        let targetIndex: number = this.getDropTargetActionIndex(e);
        if (this.state.dropTargetActionIndex !== targetIndex) {
            this.state.dropTargetActionIndex = targetIndex;
            this.forceUpdate();
        }
    }

    private onDropActionToActionsList(e: React.DragEvent): void {
        e.preventDefault();
        var actionIndex: number = Number(e.dataTransfer.getData("text/plain")),
            action: IWorkoutPlanAction = this.state.plan.actions[actionIndex],
            index: number = this.getDropTargetActionIndex(e);
        this.state.plan.actions.splice(actionIndex, 1);
        this.state.plan.actions.splice(index, 0, action);
        this.forceUpdate();
    }

    private getDropTargetActionIndex(e: React.DragEvent): number {
        var nativeEvent: any = e.nativeEvent,
            mouseEvent: MouseEvent = nativeEvent,
            y: number = mouseEvent.clientY,
            itemsBounds: ClientRect[] = this.getActionListItemsBounds(),
            index: number;
        for (let i: number = 0; i < itemsBounds.length; i++) {
            if (i === 0 && y < itemsBounds[i].top + itemsBounds[i].height / 2) {
                index = i;
            } else if (i === itemsBounds.length - 1 && y > itemsBounds[i].top + itemsBounds[i].height / 2) {
                index = i;
            } else if (y > itemsBounds[i].top + itemsBounds[i].height / 2 &&
                y < itemsBounds[i + 1].top + itemsBounds[i + 1].height / 2) {
                index = i + 1;
            }
        }
        return index;
    }

    private getActionListItemsBounds(): ClientRect[] {
        return this.state.plan.actions.map((a, i) => {
            let ref: any = this.refs[`actionListItem${i}`],
                element: Element = ref;
            return element.getBoundingClientRect();
        });
    }
}
