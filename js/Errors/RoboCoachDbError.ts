
import RoboCoachError from "./RoboCoachError";

export default class RoboCoachDbError extends RoboCoachError {

    constructor(error: string|Error|Object) {
        super(RoboCoachError.parseError(error).message, "RoboCoachDbError", RoboCoachError.parseError(error).stack)
    }

}
