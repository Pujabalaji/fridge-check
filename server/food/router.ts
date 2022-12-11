import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import FoodCollection from './collection';
import * as userValidator from '../user/middleware';
import * as foodValidator from './middleware';
import * as util from './util';
import ListingCollection from '../listing/collection';

const router = express.Router();


/**
 * Get all food for the current user
 *
 * @name GET /api/foods
 *
 * @return {FoodResponse[]} - An array of foods created by user
 * @throws {403} - If the user is not logged in
 *
 */
router.get(
    '/',
    [
        userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = (req.session.userId as string) ?? '';
        if (req.query.foodName !== undefined) {
            next();
            return
        }
        const stockpile = await FoodCollection.findAllByUser(userId);
        const response = stockpile.map(util.constructFoodResponse);
        res.status(200).json(response);
    },
    [
        foodValidator.isValidFoodQuery
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const food = (req.query.foodName as string) ?? '';
        const stockpile = await FoodCollection.findAllByName(userId, food);
        const response = stockpile.map(util.constructFoodResponse);
        res.status(200).json(response);
    }
);

/**
 * Create a new food.
 *
 * @name POST /api/foods
 *
 * @param {name} - The name of the food
 * @param {quantity} - The amount of the food
 * @param {expiration} - The expiration date of the food
 * @return {FoodResponse} - The created food
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the food name is empty or a stream of empty spaces
 * @throws {400} - If the food quantity is less than 1 or invalid
 * @throws {400} - If the expiration date is not the proper MM/DD/YYYY format
 * @throws {413} - If the expiration date is prior to today's date
 */
router.post(
    '/',
    [
        userValidator.isUserLoggedIn,
        foodValidator.isValidFoodName,
        foodValidator.isValidFoodExpiration,
        foodValidator.isValidFoodQuantity,
        foodValidator.isValidFoodUnit
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const quantity = eval(req.body.quantity);
        const food = await FoodCollection.addOne(userId, req.body.name, quantity, req.body.expiration, req.body.unit, req.body.prepared);
        res.status(201).json({
            message: 'Your food was created successfully.',
            food: util.constructFoodResponse(food)
        });
    }
);

/**
 * Delete a food
 *
 * @name DELETE /api/foods/:foodId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the food
 * @throws {404} - If the foodId is not valid
 */
router.delete(
    '/:foodId?',
    [
        userValidator.isUserLoggedIn,
        foodValidator.isFoodExists,
        foodValidator.isValidFoodModifier
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; 
        await Promise.all([FoodCollection.deleteOne(req.params.foodId, userId, req.body.thrownAway), ListingCollection.deleteOneByFoodId(req.params.foodId)]);
        res.status(200).json({
            message: 'Your food was deleted successfully.'
        });
    }
);

/**
 * Modify a food
 *
 * @name PATCH /api/foods/:foodId
 *
 * @param {string} quantity - the new quantity of the food
 * @return {FoodResponse} - the updated food
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the food
 * @throws {404} - If the foodId is not valid
 * @throws {400} - If the food quantity is less than 1
 */
router.patch(
    '/:foodId?',
    [
        userValidator.isUserLoggedIn,
        foodValidator.isFoodExists,
        foodValidator.isValidFoodModifier,
        foodValidator.isValidFoodQuantity
    ],
    async (req: Request, res: Response) => {
        const food = await FoodCollection.updateOne(req.params.foodId, req.body.quantity);
        res.status(200).json({
            message: 'Your food was updated successfully.',
            food: util.constructFoodResponse(food)
        });
    }
);

export { router as foodRouter };