import RoboCoachFirebaseConverterError from "../../Errors/RoboCoachFirebaseConverterError";

export default class WorkoutPlanConverter implements IModelConverter<IWorkoutPlan, IFirebaseWorkoutPlan> {
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
            actions: model.actions.map(a => (
                a.exercise
                    ? { duration: a.duration, exercise: a.exercise }
                    : { duration: a.duration }
            ))
        };
    }
    fromFirebase(firebaseModel: IFirebaseWorkoutPlan, id: string): IWorkoutPlan {
        return {
            id: id,
            name: firebaseModel.name,
            description: firebaseModel.description,
            actions: firebaseModel.actions
        };
    }
}
