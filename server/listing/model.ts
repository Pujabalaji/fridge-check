import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';
import { User } from '../user/model';
import type { Unit } from '../food/model';
import { standardUnits } from '../food/model';

export type Listing = {
  _id: Types.ObjectId;
  foodId: Types.ObjectId;
  userId: User;
  dateCreated: Date;
  unit: Unit;
  quantity: number;
  name: string;
  expiration: Date;
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
  unit: {
    type: String,
    enum: standardUnits,
    required: false
  },
  price: {
    type: String,
    required: true
  }

});

const ListingModel = model<Listing>('Listing', ListingSchema);
export default ListingModel;