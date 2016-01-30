
import BaseStore from "./BaseStore";
import IAction from "./../Actions/IAction";
import dispatcher from "../Dispatcher/Dispatcher";
import * as AuthActions from "../Actions/AuthActions";

export class UserStore extends BaseStore {
    private currentUser: IUser = null;

    constructor() {
        super();
        dispatcher.register((action: IAction) => this.processActions(action));
    }

    public getCurrentUser(): IUser {
        return this.currentUser;
    }

    private processActions(action: IAction): void {
        if (action instanceof AuthActions.ProcessUserLoggedInAction) {
            debugger;
            this.currentUser = { id: action.getAuthData().uid };
            this.emitChange();
        } else if (action instanceof AuthActions.ProcessUserLoggedOutAction) {
            this.currentUser = null;
            this.emitChange();
        }
    }
}

export default new UserStore();
