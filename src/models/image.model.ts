import { Document, model as MongooseModel, Schema} from 'mongoose';

export interface IImage extends Document {
    _id: string,
    link: string
}

export const imageSchema = new Schema({
    link: {
        type: String
    }
}, {
    versionKey: false,
    timestamps: true
});

export const imageModel = MongooseModel<IImage>('Image', imageSchema);

export const cleanCollection = () => imageModel.remove({}).exec();

export default imageModel;