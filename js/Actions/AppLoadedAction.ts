import {ActionBase} from "./ActionBase";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class AppLoadedAction extends ActionBase {
    bodyTitle: string;
    bodySummary: string;

    constructor(bodyTitle: string, bodySummary: string) {
        super();
        this.bodyTitle = bodyTitle;
        this.bodySummary = bodySummary;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(
            "AppLoadedAction",
            LogLevel.Info,
            {
                "bodyTitle": this.bodyTitle
            });
    }
}
