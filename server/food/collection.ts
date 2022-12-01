import type { HydratedDocument, Types } from 'mongoose';
import type { Food, Unit } from './model';
import FoodModel from './model';
import UserCollection from '../user/collection';

class FoodCollection {
  /**
   * Add a food to the collection
   *
   * @param {string} userId - The id of the author of the food
   * @param {number} quantity - The quantity of the food
   * @param {string} expiration - The expiration date of the food
   * @param {string} name - The name of the food
   * @return {Promise<HydratedDocument<Food>>} - The newly created food
   */
  static async addOne(userId: Types.ObjectId | string, name: string, quantity: Number, expiration: string, unit: Unit, prepared: Boolean): Promise<HydratedDocument<Food>> {
    const date = new Date();
    const [month, day, year] = expiration.split('/');
    const expirationDate = new Date(+year, +month - 1, +day);
    const food = new FoodModel({
      userId,
      dateCreated: date,
      quantity,
      name,
      expiration: expirationDate,
      unit,
      prepared
    });
    await food.save();
    return food.populate('userId');
  }

  /**
   * Find a food by foodId
   *
   * @param {string} foodId - The id of the food to find
   * @return {Promise<HydratedDocument<Food>> | Promise<null> } - The food with the given foodId, if any
   */
  static async findOne(foodId: Types.ObjectId | string): Promise<HydratedDocument<Food>> {
    return FoodModel.findOne({ _id: foodId }).populate('userId');
  }

  /**
   * Get all the foods in the database
   *
   * @return {Promise<HydratedDocument<Food>[]>} - An array of all of the foods
   */
  static async findAll(): Promise<Array<HydratedDocument<Food>>> {
    return FoodModel.find({}, { "sort": [['expiration', 'asc']] }).populate('userId');
  }

  /**
   * Get all the foods in by given author
   *
   * @param {string} userId - The userId of the author of the foods
   * @return {Promise<HydratedDocument<Food>[]>} - An array of all of the foods
   */
  static async findAllByUser(userId: string): Promise<Array<HydratedDocument<Food>>> {
    return FoodModel.find({ userId: userId }).sort({ expiration: 1 }).populate('userId');
  }

  /**
   * Get all foods that contain the given substrings by the given user
   * 
   * @param {string} userId - The userId of the author of the foods
   * @param {string[]} names - The substrings that must be matched
   * @return {Promise<HydratedDocument<Food>[]>} - An array of all of the foods satisfying the conditions
   */
  static async findAllBySubstring(userId: string, names: string[]): Promise<Array<HydratedDocument<Food>>> {
    const strFind = names.reduce((prev, curr) => `${prev}|${curr}`);
    return FoodModel.find({ userId: userId, name: { $regex: strFind, $options: 'i' } }).sort({ expiration: 1 }).populate('userId');
  }

  /**
   * Update a food with the new quantity
   *
   * @param {string} foodId - The id of the food to be updated
   * @param {number} quantity - The new quantity of the food
   * @return {Promise<HydratedDocument<Food>>} - The newly updated food
   */
  static async updateOne(foodId: Types.ObjectId | string, quantity: number): Promise<HydratedDocument<Food>> {
    const food = await FoodModel.findOne({ _id: foodId });
    food.quantity = quantity;
    await food.save();
    return food.populate('userId');
  }

  /**
   * Delete a food with given foodId.
   *
   * @param {string} foodId - The foodId of food to delete
   * @return {Promise<Boolean>} - true if the food has been deleted, false otherwise
   */
  static async deleteOne(foodId: Types.ObjectId | string): Promise<boolean> {
    const food = await FoodModel.deleteOne({ _id: foodId });
    return food !== null;
  }

  /**
   * Delete all the foods by the given author
   *
   * @param {string} userId - The id of author of foods
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await FoodModel.deleteMany({ userId });
  }
}

export default FoodCollection;