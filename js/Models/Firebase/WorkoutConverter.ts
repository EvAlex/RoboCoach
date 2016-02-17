import RoboCoachFirebaseConverterError from "../../Errors/RoboCoachFirebaseConverterError";
import WorkoutActionConverter from "./WorkoutActionConverter";

export default class WorkoutConverter implements IModelConverter<IWorkout, IFirebaseWorkout> {
    private actionConverter: WorkoutActionConverter = new WorkoutActionConverter();

    toFirebase(model: IWorkout): IFirebaseWorkout {
        if (!model.planName) {
            throw new RoboCoachFirebaseConverterError("WorkoutConverter", "planName", "Value is missing");
        }
        if (!model.planDescription) {
            model.planDescription = null;
        }
        if (!model.startTime) {
            throw new RoboCoachFirebaseConverterError("WorkoutConverter", "startTime", "Value is missing");
        }
        if (!model.actions) {
            model.actions = [];
        }
        return {
            planName: model.planName,
            planDescription: model.planDescription || null,
            actions: model.actions.map(a => this.actionConverter.toFirebase(a)),
            startTime: model.startTime.getTime()
        };
    }

    fromFirebase(firebaseModel: IFirebaseWorkout, id: string): IWorkout {
        return {
            id: id,
            planName: firebaseModel.planName,
            planDescription: firebaseModel.planDescription,
            startTime: new Date(firebaseModel.startTime),
            actions: firebaseModel.actions.map((a, i) => this.actionConverter.fromFirebase(a, i.toString()))
        };
    }
}
