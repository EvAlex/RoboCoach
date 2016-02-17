import RoboCoachFirebaseConverterError from "../../Errors/RoboCoachFirebaseConverterError";
import WorkoutActionConverter from "./WorkoutActionConverter";

export default class WorkoutPlanConverter implements IModelConverter<IWorkoutPlan, IFirebaseWorkoutPlan> {
    private actionConverter: WorkoutActionConverter = new WorkoutActionConverter();

    toFirebase(model: IWorkoutPlan): IFirebaseWorkoutPlan {
        if (!model.name) {
            throw new RoboCoachFirebaseConverterError("WorkoutPlanConverter", "name", "Value is missing");
        }
        if (!model.description) {
            model.description = null;
        }
        if (!model.actions) {
            model.actions = [];
        }
        return {
            name: model.name,
            description: model.description || null,
            actions: model.actions.map(a => this.actionConverter.toFirebase(a))
        };
    }
    fromFirebase(firebaseModel: IFirebaseWorkoutPlan, id: string): IWorkoutPlan {
        return {
            id: id,
            name: firebaseModel.name,
            description: firebaseModel.description,
            actions: firebaseModel.actions.map((a, i) => this.actionConverter.fromFirebase(a, i.toString()))
        };
    }
}
