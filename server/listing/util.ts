import type { HydratedDocument } from 'mongoose';
import moment from 'moment';
import type { Listing } from './model';

type MyListingResponse = {
    _id: string;
    username: string;
    dateCreated: string;
    quantity: number;
    name: string;
    expiration: string;
    rawExpiration: Date;
    unit: string;
};

type ListingResponse = {
    _id: string;
    username: string;
    dateCreated: string;
    quantity: number;
    name: string;
    expiration: string;
    rawExpiration: Date;
    price: string;
    email: string;
    community: string;
    unit: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY');

/**
 * Transform a raw Listing object from the database into an object
 * with all the information needed by the frontend for the currently logged in user
 * to see their own listings
 *
 * @param {HydratedDocument<Listing>} listing - A listing
 * @returns {MyListingResponse} - The listing object formatted for the frontend
 */
const constructMyListingResponse = (listing: HydratedDocument<Listing>): MyListingResponse => {
    const listingCopy: Listing = {
        ...listing.toObject({
            versionKey: false // Cosmetics; prevents returning of __v property
        })
    };
    const { username, homeCommunity, email } = listingCopy.userId;
    const { name, unit, expiration } = listingCopy.foodId;
    delete listingCopy.userId;
    return {
        ...listingCopy,
        _id: listingCopy._id.toString(),
        username,
        dateCreated: formatDate(listing.dateCreated),
        expiration: formatDate(expiration),
        rawExpiration: expiration,
        unit: unit,
        name: name,
    };
};

/**
 * Transform a raw Listing object from the database into an object
 * with all the information needed by the frontend for users who aren't
 * the author to see this listing
 * 
 * @param {HydratedDocument<Listing>} listing - A listing
 * @returns {ListingResponse} - The listing object formatted for the frontend
 */
const constructListingResponse = (listing: HydratedDocument<Listing>): ListingResponse => {
    const listingCopy: Listing = {
        ...listing.toObject({
            versionKey: false // Cosmetics; prevents returning of __v property
        })
    };
    const { username, homeCommunity, email } = listingCopy.userId;
    const { name, unit, expiration } = listingCopy.foodId;
    delete listingCopy.userId;
    return {
        ...listingCopy,
        _id: listingCopy._id.toString(),
        username,
        name: name,
        dateCreated: formatDate(listing.dateCreated),
        expiration: formatDate(expiration),
        rawExpiration: expiration,
        price: listingCopy.price,
        email,
        community: homeCommunity,
        unit
    };
};

export {
    constructMyListingResponse,
    constructListingResponse
};