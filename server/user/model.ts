import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

export const allergies = ["Peanut", "Tree Nut", "Seafood", "Shellfish", "Soy", "Dairy", "Egg", "Gluten"] as const;
export type Allergy = typeof allergies[number];
export const otherRestrictions = ["Vegetarian", "Vegan", "Pescetarian"] as const;
export type OtherRestriction = typeof otherRestrictions[number];
export const communities = ["Baker", "Burton Conner", "East Campus", "MacGregor", "Maseeh", "McCormick", "New House", "New Vassar", "Next House", "Random", "Simmons", "Off-campus Cambridge", "Off-campus Boston"] as const;
export type Community = typeof communities[number];

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  email: string;
  allergies: Array<Allergy>;
  otherDietaryRestrictions: Array<OtherRestriction>;
  homeCommunity: Community;
  thrownAway: number;
  numFood:number;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // the user's contact info
  email: {
    type: String,
    required: true
  },
  // the user's allergies as a comma-separated list
  allergies: {
    type: Array<String>,
  },
  // the user's other dietary restrictions as a comma-separated list
  otherDietaryRestrictions: {
    type: Array<String>,
  },
  homeCommunity: {
    type: String,
    enum: communities,
    required: true
  },
  thrownAway: {
    type: Number,
    default:0 
  },
  numFood: {
    type: Number,
    default:0 
  }

});

const UserModel = model<User>('User', UserSchema);
export default UserModel;
