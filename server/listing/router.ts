import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import ListingCollection from './collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as listingValidator from './middleware';
import * as util from './util';
import type { User } from '../user/model';

const router = express.Router();


/**
 * Get all listings for the current user
 *
 * @name GET /api/listings
 *
 * @return {MyListingResponse[]} - An array of listings created by the current user
 * @throws {403} - If the user is not logged in
 *
 */
router.get(
    '/',
    [
      userValidator.isUserLoggedIn
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? '';
        const myListings = await ListingCollection.findAllByUser(userId);
        const response = myListings.map(util.constructMyListingResponse);
        res.status(200).json(response);
    }
);

/**
 * Create a new listing.
 *
 * @name POST /api/listings
 *
 * @param {name} - The name of the food to be listed
 * @param {quantity} - The amount of the food to be listed
 * @param {expiration} - The expiration date of the food to be listed
 * @return {MyListingResponse} - The created listing
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
        listingValidator.isValidFoodQuantity
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const quantity = (req.body.quantity as number) ?? 0;
        const user: User = await UserCollection.findOneByUserId(userId);
        const listing = await ListingCollection.addOne(userId, req.body.name, quantity, req.body.expiration, req.body.price, user.email);
        res.status(201).json({
            message: 'Your listing was created successfully.',
            listing: util.constructMyListingResponse(listing)
        });
    }
);

/**
 * Delete a listing
 *
 * @name DELETE /api/listings/:listingId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the listing
 * @throws {404} - If the listingId is not valid
 */
router.delete(
    '/:listingId?',
    [
        userValidator.isUserLoggedIn,
        listingValidator.isListingExists,
        listingValidator.isValidListingModifier
    ],
    async (req: Request, res: Response) => {
        await ListingCollection.deleteOne(req.params.listingId);
        res.status(200).json({
            message: 'Your listing was deleted successfully.'
        });
    }
);

/**
 * Modify a listing
 *
 * @name PATCH /api/listings/:listingId
 *
 * @param {string} quantity - the new quantity of the food to be listed
 * @return {MyListingResponse} - the updated listing
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the listing
 * @throws {404} - If the listingId is not valid
 * @throws {400} - If the update listing's food quantity is less than 1
 */
router.patch(
    '/:listingId?',
    [
        userValidator.isUserLoggedIn,
        listingValidator.isListingExists,
        listingValidator.isValidListingModifier,
        listingValidator.isValidFoodQuantity,
    ],
    async (req: Request, res: Response) => {
        const listing = await ListingCollection.updateOne(req.params.listingId, {quantity: req.body.quantity, price: req.body.price});
        res.status(200).json({
            message: 'Your listing was updated successfully.',
            listing: util.constructMyListingResponse(listing)
        });
    }
);

export { router as listingRouter };