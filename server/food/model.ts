import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { User } from '../user/model';

export type Food = {
  _id: Types.ObjectId;
  userId: User;
  dateCreated: Date;
  quantity: number;
  name: string;
  expiration: Date;
};

const FoodSchema = new Schema<Food>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  dateCreated: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  expiration: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const FoodModel = model<Food>('Food', FoodSchema);
export default FoodModel;