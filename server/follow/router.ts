
import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import FollowCollection from './collection';
import ListingCollection from '../listing/collection';
import * as userValidator from '../user/middleware';
import * as foodValidator from '../food/middleware';
import { constructFollowResponse } from './util';
import * as followValidator from '../follow/middleware';
import { constructListingResponse } from '..//listing/util';

const router = express.Router();

/**
 * Get all the communities that the current user follows
 *
 * @name GET /api/follows/session
 *
 * @return {FollowResponse[]} - A list of all the current user's follows
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/session',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const follows = await FollowCollection.findAllFollowsByUserId(curUserId);
    const response = follows.map(constructFollowResponse);
    res.status(200).json(response);
  }
);

/**
 * Get all listings in communities that the current user follows
 *
 * @name GET /api/follows/listings
 *
 * @return {FreetResponse[]} - A list of all the freets of the current user's followings
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/listings',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.foodName) {
      next();
      return;
    }
    const curUserId = (req.session.userId as string) ?? '';
    const follows = await FollowCollection.findAllFollowsByUserId(curUserId);
    const communityNames = await follows.map(follow => follow.communityName);
    const listings = await ListingCollection.findAllListingsByCommunity(communityNames);
    const response = listings.map(constructListingResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserLoggedIn,
    foodValidator.isValidFoodQuery
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const curUserId = (req.session.userId as string) ?? '';
    const follows = await FollowCollection.findAllFollowsByUserId(curUserId);
    const communityNames = await follows.map(follow => follow.communityName);
    const listings = await ListingCollection.findAllListingsByCommunity(communityNames);
    const food = req.query.foodName as string;
    let re = new RegExp(`${food}`, 'i');
    const matchingListings = await listings.filter(listing => re.test(listing.foodId.name));
    const response = matchingListings.map(constructListingResponse);
    res.status(200).json(response);
  }
);

/**
 * Follow a community
 *
 * @name PUT /api/follows/:communityName
 *
 * @param {string} username - The username of the user to follow
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the user is trying to follow community with invalid name
 * @throws {409} - If the user tries to follow a community they already follow
 */
router.put(
  '/:communityName?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isRepeatFollow,
    followValidator.isValidCommunityName
  ],
  async (req: Request, res: Response) => {
    const curUserId = (req.session.userId as string) ?? '';
    const communityName = req.params.communityName;
    await FollowCollection.addOne(curUserId, communityName);
    res.status(200).json({
      message: 'Your follow was added successfully.'
    });
  }
);

/**
 * Delete a follow
 *
 * @name DELETE /api/follows/:communityName
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If there is no follow between current user and username 
 */
router.delete(
  '/:communityName?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isValidCommunityName,
    followValidator.isFollowExists
  ],
  async (req: Request, res: Response) => {
    const currUser = (req.session.userId as string) ?? '';
    const communityName = (req.params.communityName);
    await FollowCollection.deleteOne(currUser, communityName);
    res.status(200).json({
      message: 'Your follow was deleted successfully.'
    });
  }
);

export { router as followRouter };