import RoboCoachFirebaseConverterError from "../../Errors/RoboCoachFirebaseConverterError";

export default class WorkoutConverter implements IModelConverter<IWorkout, IFirebaseWorkout> {
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
            actions: model.actions.map(a => {
                return a.exercise
                    ? {
                        duration: a.duration,
                        exercise: a.exercise
                      }
                    : { duration: a.duration };
            }),
            startTime: model.startTime.getTime()
        };
    }

    fromFirebase(firebaseModel: IFirebaseWorkout, id: string): IWorkout {
        return {
            id: id,
            planName: firebaseModel.planName,
            planDescription: firebaseModel.planDescription,
            startTime: new Date(firebaseModel.startTime),
            actions: firebaseModel.actions
        };
    }
}
