import dispatcher from "../Dispatcher/Dispatcher";

import AppLoadedAction from "../Actions/AppLoadedAction";
import SayHelloAction from "../Actions/SayHelloAction";
import StartWorkoutAction from "../Actions/StartWorkoutAction";
import RequestWorkoutPlanAction from "../Actions/RequestWorkoutPlanAction";
import ReceiveWorkoutPlanAction from "../Actions/ReceiveWorkoutPlanAction";
import ReceiveWorkoutPlanFailAction from "../Actions/ReceiveWorkoutPlanFailAction";
import RequestWorkoutPlansAction from "../Actions/RequestWorkoutPlansAction";
import ReceiveWorkoutPlansAction from "../Actions/ReceiveWorkoutPlansAction";
import ReceiveWorkoutPlansFailAction from "../Actions/ReceiveWorkoutPlansFailAction";

import WorkoutPlan from "../Models/WorkoutPlan";

class CommonActionCreators {
    loadApp(): void {
        const bodyTitle: string = "The standard Lorem Ipsum passage, used since the 1500s";
        const bodySummary: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" +
            "incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco" +
            "laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate" +
            "velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt" +
            "in culpa qui officia deserunt mollit anim id est laborum.";

        dispatcher.dispatch(new AppLoadedAction(bodyTitle, bodySummary));
    }

    sayHello(): void {
         dispatcher.dispatch(new SayHelloAction());
    }

    startWorkout(workoutPlan: WorkoutPlan): void {
        dispatcher.dispatch(new StartWorkoutAction(workoutPlan));
    }

    requestWorkoutPlan(planId: string): void {
        dispatcher.dispatch(new RequestWorkoutPlanAction(planId));
    }

    receiveWorkoutPlan(plan: WorkoutPlan, requestAction: RequestWorkoutPlanAction): void {
        dispatcher.dispatch(new ReceiveWorkoutPlanAction(plan, requestAction));
    }

    receiveWorkoutPlanFail(planId: string, error: IRoboCoachError, requestAction: RequestWorkoutPlanAction): void {
        dispatcher.dispatch(new ReceiveWorkoutPlanFailAction(planId, error, requestAction));
    }

    requestWorkoutPlans(): void {
        dispatcher.dispatch(new RequestWorkoutPlansAction());
    }

    receiveWorkoutPlans(plans: WorkoutPlan[], requestAction: RequestWorkoutPlansAction): void {
        dispatcher.dispatch(new ReceiveWorkoutPlansAction(plans, requestAction));
    }

    receiveWorkoutPlansFail(error: IRoboCoachError, requestAction: RequestWorkoutPlansAction): void {
        dispatcher.dispatch(new ReceiveWorkoutPlansFailAction(error, requestAction));
    }
}

export default new CommonActionCreators();
