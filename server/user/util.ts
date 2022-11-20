import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {User, Allergy, OtherRestriction, Community} from './model';

// Update this if you add a property to the User type!
type UserResponse = {
  _id: string;
  username: string;
  contactInfo: string;
  allergies: Array<Allergy>;
  otherDietaryRestrictions: Array<OtherRestriction>;
  homeCommunity: Community;
};

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
const constructUserResponse = (user: HydratedDocument<User>): UserResponse => {
  const userCopy: User = {
    ...user.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  delete userCopy.password;
  return {
    ...userCopy,
    _id: userCopy._id.toString(),
    contactInfo: userCopy.contactInfo,
    allergies: userCopy.allergies,
    otherDietaryRestrictions: userCopy.otherDietaryRestrictions,
    homeCommunity: userCopy.homeCommunity,
  };
};

export {
  constructUserResponse
};
