import RoboCoachError from "./RoboCoachError";

export default class RoboCoachFirebaseConverterError extends RoboCoachError {
    constructor(converterName: string, fieldName: string, error: string) {
        super(
            `Firebase model converter failed to process field ${fieldName}. ${error}. Converter: ${converterName}.`,
            "RoboCoachFirebaseConverterError");
    }
}
