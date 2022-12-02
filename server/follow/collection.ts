import type { HydratedDocument, Types } from 'mongoose';
import type { Follow } from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';

/**
* This file contains a class with functionality to interact with users stored
* in MongoDB, including adding, finding, updating, and deleting. Feel free to add
* additional operations in this file.
*
* Note: HydratedDocument<Community> is the output of the CommunityModel() constructor,
* and contains all the information in Community. https://mongoosejs.com/docs/typescript.html
*/
class FollowCollection {
  /**
   *  Add a follow from a user to a community
   *
   * @param {string} follower - The user who chooses to follow another user
   * @param {string} communityName - The user who is followed / monitored by follower
   * @return {Promise<HydratedDocument<Follow>>} - The newly created follow relationship
   */
  static async addOne(follower: Types.ObjectId | string, communityName: string): Promise<HydratedDocument<Follow>> {
    const follow = new FollowModel({ follower, communityName });
    await follow.save(); // Saves user to MongoDB
    return follow.populate(['follower']);
  }

  /**
   * Find a follow relationship by followId
   *
   * @param {string} followId - The id of the Follow relationship to find
   * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The follow with the given followId, if any
   */
  static async findOneByFollowId(followId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({ _id: followId }).populate(['follower']);
  }

  /**
  * Find a follow given a userId and a communityName
  *
  * @param {string} userId - The userId of user who performed the action
  * @param {string} communityName - The name of the community
  * @return {Promise<HydratedDocument<Follow>> | Promise<null>} - The follow with the given to and from,
  * if any exist
  */
  static async findOne(userId: Types.ObjectId | string, communityName: string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({ follower: userId, communityName: communityName });
  }

  /**
   * Get all the follows of a given user by userId.
   *
   * @param {string} userId - The userId of the user
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the following
   */
  static async findAllFollowsByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({ follower: userId }).populate(['follower']);
  }

  /**
   * Get all the follows with the given username.
   *
   * @param {string} username - The username of the follower
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the following
   */
  static async findAllFollowsByUsername(username: string): Promise<Array<HydratedDocument<Follow>>> {
    const follower = await UserCollection.findOneByUsername(username); // get the user id of follower
    return FollowModel.find({ follower: follower._id }).populate(['follower']);
  }

  /**
   * Get all the users who follow a community.
   *
   * @param {string} username - The username of the followee
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the following
   */
  static async findAllFollowsByCommunity(communityName: string): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({ communityName: communityName }).populate(['follower']);
  }

  /**
   * Delete a follow from the collection
   *
   * @param {string} userId - The userId of user requesting delete
   * @param {string} communityName - The name of the community to unfollow
   * @return {Promise<Boolean>} - true if the follow has been deleted, false otherwise
   */
  static async deleteOne(userId: string, communityName: string): Promise<boolean> {
    const user = await UserCollection.findOneByUserId(userId);
    console.log("user id" + user._id);
    console.log("communityName" + communityName);
    const followSuccess = await FollowModel.deleteOne({ follower: user._id, communityName: communityName });
    return followSuccess !== null;
  }

  /**
   * Delete all the follows associated with a given user
   *
   * @param {string} userId - The id of user removing from follows
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await FollowModel.deleteMany({ follower: userId });
  }
}

export default FollowCollection;