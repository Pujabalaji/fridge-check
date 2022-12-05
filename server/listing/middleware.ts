import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import FoodCollection from '../food/collection';
import ListingCollection from './collection';


const isListingExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.listingId);
    const listing = validFormat ? await ListingCollection.findOne(req.params.listingId) : '';
    if (!listing) {
        res.status(404).json({
            error: `Listing with listing ID ${req.params.listingId} does not exist.`
        });
        return;
    }
    next();
};

const isListingExistsFood = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.foodId);
    const listing = validFormat ? await ListingCollection.findOneByFoodId(req.params.foodId) : '';
    if (!listing) {
        res.status(404).json({
            error: `No listing for food with food ID ${req.params.foodId} exists.`
        });
        return;
    }
    next();
};

const isValidFoodQuantity = (req: Request, res: Response, next: NextFunction) => {
    const quantityRegex = /^(?=.*[1-9])\d*(?:\.\d{1,2})?$|^([1-9][0-9]*)\/[1-9][0-9]*|^[1-9][0-9]*$/;
    if (!quantityRegex.test(req.body.quantity) && eval(req.body.quantity) <= 0) {
        res.status(400).json({
            error: 'Quantity must be a number greater than 0.'
        });
        return;
    }
    next();
}

const isValidFoodName = async (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name as string;
    if (!name.trim()) {
        res.status(400).json({
            error: 'Food name must be at least one character long.'
        });
        return;
    }
    next();
};

const isFoodExists = async (req: Request, res: Response, next: NextFunction) => {
    const food = await FoodCollection.findOne(req.params.foodId);
    if (!food) {
        res.status(404).json({
            error: 'Food with this foodId does not exist.'
        });
        return;
    }
    next();
};

const isQuantityValid = async (req: Request, res: Response, next: NextFunction) => {
    const listing = await (await ListingCollection.findOne(req.params.listingId)).populate('foodId');
    if (!(listing.foodId.quantity >= Number(req.body.quantity))) {
        res.status(403).json({
            error: 'You cannot list a higher quantity of a food than you have in your stockpile.'
        });
        return;
    }
    next();
};

const isValidListingModifier = async (req: Request, res: Response, next: NextFunction) => {
    const listing = await ListingCollection.findOne(req.params.listingId);
    const userId = listing.userId._id;
    if (req.session.userId !== userId.toString()) {
        res.status(403).json({
            error: 'Cannot modify other users\' listings.'
        });
        return;
    }
    next();
};

export {
    isListingExists,
    isValidListingModifier,
    isValidFoodQuantity,
    isValidFoodName,
    isFoodExists,
    isListingExistsFood,
    isQuantityValid,
};