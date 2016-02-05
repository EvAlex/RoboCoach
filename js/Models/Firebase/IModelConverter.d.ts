
interface IModelConverter<TModel, TFirebaseModel> {
    toFirebase(model: TModel): TFirebaseModel;
    fromFirebase(firebaseModel: TFirebaseModel, id: string): TModel;
}
