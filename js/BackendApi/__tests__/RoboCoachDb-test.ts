import db from "../RoboCoachDb";
const config: IRoboCoachConfig = require("RoboCoachConfig");
import * as Firebase from "firebase";
import dispatcher from "../../Dispatcher/Dispatcher";
import StartWorkoutAction from "../../Actions/StartWorkoutAction";
import ProcessWorkoutStartedAction from "../../Actions/ProcessWorkoutStartedAction";
import ProcessWorkoutStartFailedAction from "../../Actions/ProcessWorkoutStartFailedAction";

const specTimeout: number = 8000;

describe('RoboCoachDb', () => {

    describe('When StartWorkoutAction is dispatched', () => {

        beforeAll(done => {

        }, specTimeout);

        it('Should create Workout on Firebase at /users/{userId}/workouts/{workoutId}', done => {
            // arrange
            var plan: IWorkoutPlan = {
                id: "aaabbbccc123",
                name: "10-min crossfit",
                description: "Really hard one",
                actions: [
                    { duration: 10000 },
                    { duration: 30000, exercise: { name: "push-ups" } },
                    { duration: 30000 },
                    { duration: 30000, exercise: { name: "pull-ups" } },
                ]
            };
            var user: IUser = { id: "userid123", authData: null };

            // act
            db.Dispatcher.dispatch(new StartWorkoutAction(plan, user));

            // assert
            db.Dispatcher.register(a => {
                if (a instanceof ProcessWorkoutStartedAction) {
                    let action: ProcessWorkoutStartedAction = <ProcessWorkoutStartedAction>a,
                        firebase: Firebase = new Firebase(`${config.firebaseUrl}users/userid123/workouts/${action.Workout.id}`);
                    firebase.once("value", snapshot => {
                        expect(snapshot.exists).toBeTruthy();
                        let actual: any = snapshot.val();
                        expect(actual.planName).toEqual("10-min crossfit");
                        expect(actual.planDescription).toEqual("Really hard one");
                        expect(actual.actions.length).toEqual(4);
                        expect(actual.actions[0].duration).toEqual(10000);
                        expect(actual.actions[0].exercise).toBeUndefined();
                        expect(actual.actions[1].duration).toEqual(30000);
                        expect(actual.actions[1].exercise).toBeDefined();
                        expect(actual.actions[1].exercise.name).toEqual("push-ups");
                        expect(actual.actions[2].duration).toEqual(30000);
                        expect(actual.actions[2].exercise).toBeUndefined();
                        expect(actual.actions[3].duration).toEqual(30000);
                        expect(actual.actions[3].exercise).toBeDefined();
                        expect(actual.actions[3].exercise.name).toEqual("pull-ups");
                        //expect(actual.startTime).toBeDefined();
                        done();
                    });
                } else if (a instanceof ProcessWorkoutStartFailedAction) {
                    expect(true).toBeFalsy((<ProcessWorkoutStartFailedAction>a).toLogEntry().toString());
                    done();
                }
            });
        }, specTimeout);

    });

});
