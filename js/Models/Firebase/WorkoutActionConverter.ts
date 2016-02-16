
export default class WorkoutActionConverter implements IModelConverter<IWorkoutPlanAction, IFirebaseWorkoutAction> {
    toFirebase(model: IWorkoutPlanAction): IFirebaseWorkoutAction {
        var res: IFirebaseWorkoutAction = {
            duration: model.duration
        };
        if (model.exercise) {
            res.exercise = {
                name: model.exercise.name || null
            };
            if (model.exercise.description) {
                res.exercise.description = model.exercise.description;
            }
            if (model.exercise.mediaUrl) {
                res.exercise.mediaUrl = model.exercise.mediaUrl;
            }
        }
        return res;
    }
    fromFirebase(firebaseModel: IFirebaseWorkoutAction, id: string): IWorkoutPlanAction {
        return firebaseModel;
    }
}
