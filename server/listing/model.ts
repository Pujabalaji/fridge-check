import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import { User } from '../user/model';
import { Food } from '../food/model';

export type Listing = {
  _id: Types.ObjectId;
  foodId: Food;
  userId: User;
  dateCreated: Date;
  quantity: number;
  price: string;
};

const ListingSchema = new Schema<Listing>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  foodId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Food'
  },
  dateCreated: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: String,
    required: true
  }

});

const ListingModel = model<Listing>('Listing', ListingSchema);
export default ListingModel;