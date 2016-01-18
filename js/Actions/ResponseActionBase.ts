
import {ActionBase} from "./ActionBase";

export abstract class ResponseActionBase extends ActionBase {
    private requestAction: ActionBase;

    constructor(requestAction: ActionBase) {
        super();
        this.requestAction = requestAction;
    }

    public getRequestTimestamp(): Date {
        return this.requestAction.getTimestamp();
    }
}
