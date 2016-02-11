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

        describe("name", () => {
            it("Should be set correctly", () => {
                // arrange
                model.name = "Crossfit";

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(actual.name).toEqual("Crossfit");
            });
            it("Should throw if name field is missing in model", () => {
                // arrange
                delete model.name;

                // act

                // assert
                expect(() => converter.toFirebase(model)).toThrow();
            });
            it("Should throw if name field is null in model", () => {
                // arrange
                model.name = null;

                // act

                // assert
                expect(() => converter.toFirebase(model)).toThrow();
            });
            it("Should throw if name field is undefined in model", () => {
                // arrange
                model.name = undefined;

                // act

                // assert
                expect(() => converter.toFirebase(model)).toThrow();
            });
            it("Should throw if name field is empty string in model", () => {
                // arrange
                model.name = "";

                // act

                // assert
                expect(() => converter.toFirebase(model)).toThrow();
            });
        });

        describe("description", () => {
            it("Should be set correctly", () => {
                // arrange
                model.description = "Really hard one";

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(actual.description).toEqual("Really hard one");
            });
            it("Should be null if description field is missing in model", () => {
                // arrange
                delete model.description;

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(actual.description).toBeNull();
            });
            it("Should be null if description field is undefined in model", () => {
                // arrange
                model.description = undefined;

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(actual.description).toBeNull();
            });
            it("Should be null if description field is empty string in model", () => {
                // arrange
                model.description = "";

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(actual.description).toBeNull();
            });
        });

        describe("actions", () => {
            it("Should be set correctly", () => {
                // arrange
                model.actions = [
                    { duration: 10000 },
                    { duration: 30000, exercise: { name: "push-ups" } },
                    { duration: 10000 },
                    { duration: 30000, exercise: { name: "pull-ups" } }
                ];

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
            it("Should be an empty array if actions field is missing in model", () => {
                // arrange
                delete model.actions;

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(Array.isArray(actual.actions)).toBeTruthy();
                expect(actual.actions.length).toEqual(0);
            });
            it("Should be an empty array if actions field is null in model", () => {
                // arrange
                model.actions = null;

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(Array.isArray(actual.actions)).toBeTruthy();
                expect(actual.actions.length).toEqual(0);
            });
            it("Should be an empty array if actions field is undefined in model", () => {
                // arrange
                model.actions = undefined;

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(Array.isArray(actual.actions)).toBeTruthy();
                expect(actual.actions.length).toEqual(0);
            });
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
