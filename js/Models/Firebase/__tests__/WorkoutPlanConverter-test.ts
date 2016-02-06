import WorkoutPlanConverter from "../WorkoutPlanConverter";

describe("WorkoutPlanConverter", () => {

    describe("toFirebase(model)", () => {
        var model: IWorkoutPlan,
            converter: WorkoutPlanConverter;

        beforeEach(() => {
            model = {
                id: "-1241dewf2u3JEkd2js",
                name: "Crossfit",
                description: "Really hard one",
                actions: [
                    { duration: 10000 },
                    { duration: 30000, exercise: { name: "push-ups" } },
                    { duration: 10000 },
                    { duration: 30000, exercise: { name: "pull-ups" } }
                ]
            };
            converter = new WorkoutPlanConverter();
        });

        it("Should set name", () => {
            // arrange

            // act
            var actual = converter.toFirebase(model);

            // assert
            expect(actual.name).toEqual(model.name);
        });

        it("Should set description", () => {
            // arrange

            // act
            var actual = converter.toFirebase(model);

            // assert
            expect(actual.description).toEqual(model.description);
        });

        it("Should set actions", () => {
            // arrange

            // act
            var actual = converter.toFirebase(model);

            // assert
            expect(actual.actions.length).toEqual(model.actions.length);
            for (var i = 0; i < actual.actions.length; i++) {
                expect(actual.actions[i].duration).toEqual(model.actions[i].duration);
                if (actual.actions[i].exercise || model.actions[i].exercise) {
                    expect(actual.actions[i].exercise.name).toEqual(model.actions[i].exercise.name);
                }
            }
        });
    });

    describe("fromFirebase(firebaseModel)", () => {
        var firebaseModel: IFirebaseWorkoutPlan,
            firebaseModelId: string = "-1241dewf2u3JEkd2js",
            converter: WorkoutPlanConverter;

        beforeEach(() => {
            firebaseModel = {
                name: "Crossfit",
                description: "Really hard one",
                actions: [
                    { duration: 10000 },
                    { duration: 30000, exercise: { name: "push-ups" } },
                    { duration: 10000 },
                    { duration: 30000, exercise: { name: "pull-ups" } }
                ]
            };
            converter = new WorkoutPlanConverter();
        });

        it("Should set id", () => {
            // arrange

            // act
            var actual = converter.fromFirebase(firebaseModel, firebaseModelId);

            // assert
            expect(actual.id).toEqual(firebaseModelId);
        });

        it("Should set name", () => {
            // arrange

            // act
            var actual = converter.fromFirebase(firebaseModel, firebaseModelId);

            // assert
            expect(actual.name).toEqual(firebaseModel.name);
        });

        it("Should set description", () => {
            // arrange

            // act
            var actual = converter.fromFirebase(firebaseModel, firebaseModelId);

            // assert
            expect(actual.description).toEqual(firebaseModel.description);
        });

        it("Should set actions", () => {
            // arrange

            // act
            var actual = converter.fromFirebase(firebaseModel, firebaseModelId);

            // assert
            expect(actual.actions.length).toEqual(firebaseModel.actions.length);
            for (var i = 0; i < actual.actions.length; i++) {
                expect(actual.actions[i].duration).toEqual(firebaseModel.actions[i].duration);
                if (actual.actions[i].exercise || firebaseModel.actions[i].exercise) {
                    expect(actual.actions[i].exercise.name).toEqual(firebaseModel.actions[i].exercise.name);
                }
            }
        });

    })
});
