
export default class WorkoutPlanConverter implements IModelConverter<IWorkoutPlan, IFirebaseWorkoutPlan> {
    toFirebase(model: IWorkoutPlan): IFirebaseWorkoutPlan {
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
