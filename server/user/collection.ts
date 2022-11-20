import type {HydratedDocument, Types} from 'mongoose';
import type {User, Community, Allergy, OtherRestriction} from './model';
import UserModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @param {string} contactInfo - the user's contact information
   * @param {Array<Allergy>} allergies - the user's allergies
   * @param {Array<OtherRestriction>} otherDietaryRestrictions - the user's other dietary restrictions
   * @param {Community} homeCommunity - the user's home community
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(username: string, password: string, contactInfo: string, allergies: Array<Allergy>, otherDietaryRestrictions: Array<OtherRestriction>, homeCommunity: Community): Promise<HydratedDocument<User>> {
    const user = new UserModel({username, password, contactInfo, allergies, otherDietaryRestrictions, homeCommunity});
    await user.save(); // Saves user to MongoDB
    return user;
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({_id: userId});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({username: new RegExp(`^${username.trim()}$`, 'i')});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: {password?: string; username?: string, contactInfo?: string, allergies?: Array<Allergy>, otherDietaryRestrictions?: Array<OtherRestriction>, homeCommunity?: Community}): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (userDetails.password) {
      user.password = userDetails.password;
    }

    if (userDetails.username) {
      user.username = userDetails.username;
    }

    if (userDetails.contactInfo) {
      user.contactInfo = userDetails.contactInfo;
    }

    if (userDetails.allergies) {
      user.allergies = userDetails.allergies;
    }

    if (userDetails.otherDietaryRestrictions) {
      user.otherDietaryRestrictions = userDetails.otherDietaryRestrictions;
    }

    if (userDetails.homeCommunity) {
      user.homeCommunity = userDetails.homeCommunity;
    }

    await user.save();
    return user;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.deleteOne({_id: userId});
    return user !== null;
  }
}

export default UserCollection;
