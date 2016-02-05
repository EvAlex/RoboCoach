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

        it("Should set planName", () => {
            // arrange

            // act
            var actual = converter.toFirebase(model);

            // assert
            expect(actual.planName).toEqual(model.planName);
        });

        it("Should set planDescription", () => {
            // arrange

            // act
            var actual = converter.toFirebase(model);

            // assert
            expect(actual.planDescription).toEqual(model.planDescription);
        });

        it("Should set startTime", () => {
            // arrange

            // act
            var actual = converter.toFirebase(model);

            // assert
            expect(actual.startTime).toEqual(model.startTime.getTime());
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
        var firebaseModel: IFirebaseWorkout,
            firebaseModelId: "-1241dewf2u3JEkd2js",
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
