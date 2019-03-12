import {Document, model as MongooseModel, Schema} from 'mongoose';

export interface IImage extends Document {
    _id: string,
    name: string;
    link: string
}

export const imageSchema = new Schema({
    link: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export const imageModel = MongooseModel<IImage>('Image', imageSchema);

export const cleanCollection = () => imageModel.remove({}).exec();

export default imageModel;