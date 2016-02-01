import {ActionBase} from "./ActionBase";
import {ResponseActionBase} from "./ResponseActionBase";
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

export class LogOutAction extends ActionBase {
    private user: IUser;

    constructor(user: IUser) {
        super();
        this.user = user;
    }

    public getUser(): IUser {
        return this.user;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(
            "LogOutAction",
            LogLevel.Info,
            { userId: this.user.id });
    }
}

export class LogInAction extends ActionBase {
    private provider: AuthProvider;

    constructor(provider: AuthProvider) {
        super();
        this.provider = provider;
    }

    public getProvider(): AuthProvider {
        return this.provider;
    }

    public toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(
            "LogInAction",
            LogLevel.Info,
            { provider: AuthProvider[this.provider] });
    }
}

export class ProcessLogInFailedAction extends ResponseActionBase {
    private error: IRoboCoachError;

    constructor(requestAction: LogInAction, error: IRoboCoachError) {
        super(requestAction);
        this.error = error;
    }

    public getError(): IRoboCoachError {
        return this.error;
    }

    public toLogEntry(): ActionLogEntry {
        return new ActionLogEntry("ProcessLogInFailedAction", LogLevel.Error);
    }
}

export enum AuthProvider {
    Facebook,
    Google,
    Github,
    Twitter
}
