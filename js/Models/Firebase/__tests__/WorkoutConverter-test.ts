import WorkoutConverter from "../WorkoutConverter";

describe("WorkoutConverter", () => {

    describe("toFirebase(model)", () => {
        var model: IWorkout,
            converter: WorkoutConverter;

        beforeEach(() => {
            model = {
                id: "-1241dewf2u3JEkd2js",
                planName: "Crossfit",
                planDescription: "Really hard one",
                startTime: new Date(),
                actions: [
                    { duration: 10000 },
                    { duration: 30000, exercise: { name: "push-ups" } },
                    { duration: 10000 },
                    { duration: 30000, exercise: { name: "pull-ups" } }
                ]
            };
            converter = new WorkoutConverter();
        });

        describe("planName", () => {
            it("Should be set correctly", () => {
                // arrange
                model.planName = "Crossfit";

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(actual.planName).toEqual("Crossfit");
            });

            it("Should throw if planName is missing in model", () => {
                // arrange
                delete model.planName;

                // act

                // assert
                expect(() => converter.toFirebase(model)).toThrow();
            });

            it("Should throw if planName is null in model", () => {
                // arrange
                model.planName = null;

                // act

                // assert
                expect(() => converter.toFirebase(model)).toThrow();
            });

            it("Should throw if planName is undefined in model", () => {
                // arrange
                model.planName = undefined;

                // act

                // assert
                expect(() => converter.toFirebase(model)).toThrow();
            });

            it("Should throw if planName is empty in model", () => {
                // arrange
                model.planName = "";

                // act

                // assert
                expect(() => converter.toFirebase(model)).toThrow();
            });
        });

        describe("planDescription", () => {
            it("Should be set correctly", () => {
                // arrange
                model.planDescription = "Really hard one";

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(actual.planDescription).toEqual("Really hard one");
            });
            it("Should be null if it's empty string in model", () => {
                // arrange
                model.planDescription = "";

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(actual.planDescription).toBeNull();
            });
            it("Should be null if it's null in model", () => {
                // arrange
                model.planDescription = null;

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(actual.planDescription).toBeNull();
            });
            it("Should be null if it's undefined in model", () => {
                // arrange
                model.planDescription = undefined;

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(actual.planDescription).toBeNull();
            });
            it("Should be null if it's missing in model", () => {
                // arrange
                delete model.planDescription;

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(actual.planDescription).toBeNull();
            });
        });

        describe("startTime", () => {
            it("Should equal model's startTime.getTime() value.", () => {
                // arrange
                model.startTime = new Date();

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(actual.startTime).toEqual(model.startTime.getTime());
            });
            it("Should throw if startTime is missing in model", () => {
                // arrange
                delete model.startTime;

                // act

                // assert
                expect(() => converter.toFirebase(model)).toThrow();
            });
            it("Should throw if startTime is null in model", () => {
                // arrange
                model.startTime = null;

                // act

                // assert
                expect(() => converter.toFirebase(model)).toThrow();
            });
            it("Should throw if startTime is undefined in model", () => {
                // arrange
                model.startTime = undefined;

                // act

                // assert
                expect(() => converter.toFirebase(model)).toThrow();
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
            it("Should be empty array if actions field is missing in model", () => {
                // arrange
                delete model.actions;

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(Array.isArray(actual.actions)).toBeTruthy();
                expect(actual.actions.length).toEqual(0);
            });
            it("Should be empty array if actions field is null in model", () => {
                // arrange
                model.actions = null;

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(Array.isArray(actual.actions)).toBeTruthy();
                expect(actual.actions.length).toEqual(0);
            });
            it("Should be empty array if actions field is undefined in model", () => {
                // arrange
                delete model.actions;

                // act
                var actual = converter.toFirebase(model);

                // assert
                expect(Array.isArray(actual.actions)).toBeTruthy();
                expect(actual.actions.length).toEqual(0);
            });
        });
    });

    describe("fromFirebase(firebaseModel)", () => {
        var firebaseModel: IFirebaseWorkout,
            firebaseModelId: string = "-1241dewf2u3JEkd2js",
            converter: WorkoutConverter;

        beforeEach(() => {
            firebaseModel = {
                planName: "Crossfit",
                planDescription: "Really hard one",
                startTime: new Date().getTime(),
                actions: [
                    { duration: 10000 },
                    { duration: 30000, exercise: { name: "push-ups" } },
                    { duration: 10000 },
                    { duration: 30000, exercise: { name: "pull-ups" } }
                ]
            };
            converter = new WorkoutConverter();
        });

        it("Should set id", () => {
            // arrange

            // act
            var actual = converter.fromFirebase(firebaseModel, firebaseModelId);

            // assert
            expect(actual.id).toEqual(firebaseModelId);
        });

        it("Should set planName", () => {
            // arrange

            // act
            var actual = converter.fromFirebase(firebaseModel, firebaseModelId);

            // assert
            expect(actual.planName).toEqual(firebaseModel.planName);
        });

        it("Should set planDescription", () => {
            // arrange

            // act
            var actual = converter.fromFirebase(firebaseModel, firebaseModelId);

            // assert
            expect(actual.planDescription).toEqual(firebaseModel.planDescription);
        });

        it("Should set startTime", () => {
            // arrange

            // act
            var actual = converter.fromFirebase(firebaseModel, firebaseModelId);

            // assert
            expect(actual.startTime.getTime()).toEqual(firebaseModel.startTime);
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
