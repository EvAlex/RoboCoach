
export default class WorkoutConverter implements IModelConverter<IWorkout, IFirebaseWorkout> {
    toFirebase(model: IWorkout): IFirebaseWorkout {
        return {
            planName: model.planName,
            planDescription: model.planDescription || null,
            actions: model.actions.map(a => {
                return a.exercise
                    ? {
                        duration: a.duration,
                        exercise: a.exercise
                      }
                    : { duration: a.duration }
            }),
            startTime: new Date().getTime()
        }
    }

    fromFirebase(firebaseModel: IFirebaseWorkout, id: string): IWorkout {
        return {
            id: id,
            planName: firebaseModel.planName,
            planDescription: firebaseModel.planDescription,
            startTime: new Date(firebaseModel.startTime),
            actions: firebaseModel.actions
        }
    }
}
