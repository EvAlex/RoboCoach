
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

    public isLoggedInWith(provider: AuthActions.AuthProvider): boolean {
        if (!this.currentUser) {
            return false;
        }
        switch (provider) {
            case AuthActions.AuthProvider.Facebook:
                return !!this.currentUser.authData.facebook;
            case AuthActions.AuthProvider.Google:
                return !!this.currentUser.authData.google;
            case AuthActions.AuthProvider.Github:
                return !!this.currentUser.authData.github;
            case AuthActions.AuthProvider.Twitter:
                return !!this.currentUser.authData.twitter;
            default:
                throw new Error(`Unexpected AuthProvider: ${AuthActions.AuthProvider[provider]}.`);
        }
    }

    private processActions(action: IAction): void {
        if (action instanceof AuthActions.ProcessUserLoggedInAction) {
            this.currentUser = {
                id: action.getAuthData().uid,
                authData: action.getAuthData()
            };
            this.emitChange();
        } else if (action instanceof AuthActions.ProcessUserLoggedOutAction) {
            this.currentUser = null;
            this.emitChange();
        }
    }
}

export default new UserStore();
