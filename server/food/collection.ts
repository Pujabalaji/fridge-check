import type { HydratedDocument, Types } from 'mongoose';
import type { Food } from './model';
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
    static async addOne(userId: Types.ObjectId | string, name: string, quantity: Number, expiration: string): Promise<HydratedDocument<Food>> {
        const date = new Date();
        const [month, day, year] = expiration.split('/');
        const expirationDate = new Date(+year, +month - 1, +day);
        const user = await UserCollection.findOneByUserId(userId);
        const food = new FoodModel({
            userId: user,
            dateCreated: date,
            quantity,
            name,
            expiration: expirationDate
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
        const user = await UserCollection.findOneByUserId(userId);
        return FoodModel.find({ userId: user._id }).sort({ expiration: 1 }).populate('userId');
    }

    /**
     * Update a food with the new quantity
     *
     * @param {string} foodId - The id of the food to be updated
     * @param {number} quantity - The new quantity of the food
     * @return {Promise<HydratedDocument<Food>>} - The newly updated food
     */
    static async updateOne(freetId: Types.ObjectId | string, quantity: number): Promise<HydratedDocument<Food>> {
        const food = await FoodModel.findOne({ _id: freetId });
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