import {ActionBase} from "./ActionBase";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export class ProcessUserLoggedInAction extends ActionBase {
    private authData: FirebaseAuthData;

    constructor(authData: FirebaseAuthData) {
        super();
        this.authData = authData;
    }

    public getAuthData(): FirebaseAuthData {
        return this.authData;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(
            "ProcessUserLoggedInAction",
            LogLevel.Info,
            { userId: this.authData.uid, provider: this.authData.provider });
    }
}

export class ProcessUserLoggedOutAction extends ActionBase {
    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(
            "ProcessUserLoggedOutAction",
            LogLevel.Info);
    }
}
