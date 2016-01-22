import {ActionBase} from "./ActionBase";
import {ActionLogEntry, LogLevel} from "../Log/ActionLogEntry";

export default class RequestWorkoutPlansAction extends ActionBase {
    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry(`RequestWorkoutPlansAction`, LogLevel.Info);
    }
}
