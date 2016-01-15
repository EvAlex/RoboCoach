import IAction from "./IAction";
import ActionLogEntry from "../Log/ActionLogEntry";
import WorkoutPlan from "../Models/WorkoutPlan";

export default class StartWorkoutAction implements IAction {
    private workoutPlan: WorkoutPlan;

    constructor(workoutPlan: WorkoutPlan) {
        this.workoutPlan = workoutPlan;
    }

    toLogEntry(): ActionLogEntry {
        return new ActionLogEntry("StartWorkoutAction");
    }
}
