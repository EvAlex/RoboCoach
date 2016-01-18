import {ActionBase} from "./ActionBase";
import ActionLogEntry from "../Log/ActionLogEntry";

export default class SayHelloAction extends ActionBase {
      toLogEntry(): ActionLogEntry {
            return new ActionLogEntry("SayHelloAction");
      }
}
