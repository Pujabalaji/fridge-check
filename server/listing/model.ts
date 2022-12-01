import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import type { User } from '../user/model';

export type Listing = {
  _id: Types.ObjectId;
  userId: User;
  dateCreated: Date;
  quantity: number;
  name: string;
  expiration: Date;
  price: string;
  email: string;
};

const ListingSchema = new Schema<Listing>({
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
  },
  price: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }

});

const ListingModel = model<Listing>('Listing', ListingSchema);
export default ListingModel;