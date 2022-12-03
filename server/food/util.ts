import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { Food, Unit } from './model';

export type FoodResponse = {
    _id: string;
    username: string;
    dateCreated: string;
    quantity: number;
    name: string;
    expiration: string;
    rawExpiration: Date;
    unit: Unit;
    prepared: Boolean;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY');

/**
 * Transform a raw Food object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Food>} food - A food
 * @returns {FoodResponse} - The food object formatted for the frontend
 */
const constructFoodResponse = (food: HydratedDocument<Food>): FoodResponse => {
    const foodCopy: Food = {
        ...food.toObject({
            versionKey: false // Cosmetics; prevents returning of __v property
        })
    };
    const { username } = foodCopy.userId;
    delete foodCopy.userId;
    return {
        ...foodCopy,
        _id: foodCopy._id.toString(),
        username,
        dateCreated: formatDate(food.dateCreated),
        expiration: formatDate(food.expiration),
        rawExpiration: foodCopy.expiration,
    };
};

export {
    constructFoodResponse
};