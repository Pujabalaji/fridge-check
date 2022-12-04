import type { HydratedDocument, Types } from 'mongoose';
import UserCollection from '../user/collection';
import UserModel from '../user/model';
import type { Listing } from './model';
import ListingModel from './model';
// import { communities } from '../user/model'; 

class ListingCollection {
  /**
   * Add a listing to the collection
   *
   * @param {string} userId - The id of the author of the listing
   * @param {number} quantity - The quantity of the food to be listed
   * @param {string} expiration - The expiration date of the food to be listed
   * @param {string} name - The name of the food to be listed
   * @return {Promise<HydratedDocument<Food>>} - The newly created listing
   */
  static async addOne(userId: Types.ObjectId | string, foodId: Types.ObjectId | string, quantity: Number, price: string): Promise<HydratedDocument<Listing>> {
    const listing = new ListingModel({
      userId,
      foodId,
      dateCreated: new Date(),
      quantity,
      price
    });
    await listing.save();
    return (await listing.populate('userId')).populate('foodId');
  }

  /**
   * Find a listing by listingId
   *
   * @param {string} listingId - The id of the listing to find
   * @return {Promise<HydratedDocument<Listing>> | Promise<null> } - The listing with the given listingId, if any
   */
  static async findOne(listingId: Types.ObjectId | string): Promise<HydratedDocument<Listing>> {
    return (await ListingModel.findOne({ _id: listingId }).populate('userId')).populate('foodId');
  }

  /**
   * Find a listing by foodId
   *
   * @param {string} listingId - The id of the food of which to find the listing
   * @return {Promise<HydratedDocument<Listing>> | Promise<null> } - The listing with the given foodId, if any
   */
  static async findOneByFoodId(foodId: Types.ObjectId | string): Promise<HydratedDocument<Listing>> {
    return (await ListingModel.findOne({ foodId }).populate('userId')).populate('foodId');
  }

  /**
   * Delete a listing by foodId
   *
   * @param {string} foodId - The id of the food of which to delete the listing
   * @return {Promise<Boolean> } - True if the listing has been deleted, false otherwise
   */
  static async deleteOneByFoodId(foodId: Types.ObjectId | string): Promise<Boolean> {
    const listing = await ListingModel.deleteOne({ foodId: foodId });
    return listing !== null;
  }

  /**
   * Get all the listings in the database
   *
   * @return {Promise<HydratedDocument<Listing>[]>} - An array of all of the listings in the database
   */
  static async findAll(): Promise<Array<HydratedDocument<Listing>>> {
    return await (ListingModel.find({}).populate('userId')).populate('foodId');
  }

  /**
   * Get all the listings in the database by given author
   *
   * @param {string} userId - The userId of the author of the listings
   * @return {Promise<HydratedDocument<Listing>[]>} - An array of all of the listings by the given user
   */
  static async findAllByUser(userId: string): Promise<Array<HydratedDocument<Listing>>> {
    return ListingModel.find({ userId }).sort({ expiration: 1 }).populate('userId').populate('foodId');
  }

  /**
   * Get all the listings in the given communities
   *
   * @param {Array<string>} communities - The communities to search
   * @return {Promise<HydratedDocument<Listing>[]>} - An array of listings posted by users whose home communities are in communities
   */
       static async findAllListingsByCommunity(communities: Array<string>): Promise<Array<HydratedDocument<Listing>>> {
        const users = await UserModel.find({ "homeCommunity": {"$in": communities }});
        return ListingModel.find({ "userId": {"$in": users.map(user => user._id)}}).populate('userId').populate('foodId');
      }

  /**
   * Update a listing with the new quantity and/or price
   *
   * @param {string} listingId - The id of the listing to be updated
   * @param {number} listingDetails - The new details of the listing
   * @return {Promise<HydratedDocument<Listing>>} - The newly updated listing
   */
  static async updateOne(listingId: Types.ObjectId | string, listingDetails: { quantity?: number; price?: string }): Promise<HydratedDocument<Listing>> {
    const listing = await ListingModel.findOne({ _id: listingId });
    if (listingDetails.quantity) {
      listing.quantity = listingDetails.quantity;
    }
    if (listingDetails.price !== undefined) {
      listing.price = listingDetails.price;
    }
    await listing.save();
    return (await listing.populate('userId')).populate('foodId');
  }

  /**
   * Delete a listing with given listingId.
   *
   * @param {string} listingId - The listingId of listing to delete
   * @return {Promise<Boolean>} - true if the listing has been deleted, false otherwise
   */
  static async deleteOne(listingId: Types.ObjectId | string): Promise<boolean> {
    const listing = await ListingModel.deleteOne({ _id: listingId });
    return listing !== null;
  }

  /**
   * Delete all the listings by the given author
   *
   * @param {string} userId - The id of author of foods
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await ListingModel.deleteMany({ userId });
  }
}

export default ListingCollection;