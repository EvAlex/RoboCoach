import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";
import {ResponseActionBase} from "./ResponseActionBase";
import CreateWorkoutPlanAction from "./CreateWorkoutPlanAction";

export default class CreateWorkoutPlanFailAction extends ResponseActionBase {
    private error: IRoboCoachError;

    constructor(error: IRoboCoachError, request: CreateWorkoutPlanAction) {
        super(request);
        this.error = error;
    }

    public get Error(): IRoboCoachError {
        return this.error;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(`CreateWorkoutPlanFailAction`, LogLevel.Error, { error: this.error.toString() });
    }
}
