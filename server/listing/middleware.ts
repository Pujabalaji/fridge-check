import type { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import ListingCollection from './collection';


const isListingExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.listingId);
    const food = validFormat ? await ListingCollection.findOne(req.params.listingId) : '';
    if (!food) {
        res.status(404).json({
            error: `Listing with listing ID ${req.params.listingId} does not exist.`
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

const isValidFoodExpiration = (req: Request, res: Response, next: NextFunction) => {
    const expiration = req.body.expiration as string;
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(expiration)) {
        res.status(400).json({
            error: 'Expiration Date must be in the format MM/DD/YYYY.'
        });
        return;
    }
    const curDate = new Date();
    const date = new Date(expiration);
    if (date <= curDate) {
        res.status(413).json({
            error: 'Provided date is not valid.'
        });
        return;
    }
    next();
};

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
    isValidFoodExpiration,
    isValidFoodQuantity,
    isValidFoodName
};