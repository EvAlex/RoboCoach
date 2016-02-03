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

        var actual: any = null;

        beforeAll(done => {
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

            // prepare data for asserts
            db.Dispatcher.register(a => {
                if (a instanceof ProcessWorkoutStartedAction) {
                    let action = <ProcessWorkoutStartedAction>a,
                        firebase = new Firebase(`${config.firebaseUrl}users/userid123/workouts/${action.Workout.id}`);
                    firebase.once("value", snapshot => {
                        actual = snapshot.val();
                        done();
                    });
                } else if (a instanceof ProcessWorkoutStartFailedAction) {
                    expect(true).toBeFalsy((<ProcessWorkoutStartFailedAction>a).toLogEntry().toString());
                    done();
                }
            });
        }, specTimeout);

        it('Should create Workout on Firebase at /users/{userId}/workouts/{workoutId}', () => {
            expect(actual).not.toBeNull();
        });

        describe('Created Workout', () => {
            it("Should have planName equal to the name of the WorkoutPlan it is created from.", () => {
                expect(actual.planName).toEqual("10-min crossfit");
            });
            it("Should have planDescription equal to the name of the WorkoutPlan it is created from.", () => {
                expect(actual.planDescription).toEqual("Really hard one");
            });
            it("Should have the same count of actions as WorkoutPlan it is created from does.", () => {
                expect(actual.actions.length).toEqual(4);
            });
            it("Should have the same actions as WorkoutPlan it is created from does.", () => {
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
            });
            xit("Should be started, i.e. startTime should be set.", () => {
                expect(actual.startTime).toBeDefined();
            });
        });


    });

});
