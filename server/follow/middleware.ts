import type {Request, Response, NextFunction} from 'express';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection';
import { communities } from 'server/user/model';

/**
 * Checks if a Follow between the current user and the communityName in req.params exists
 */
 const isFollowExists = async (req: Request, res: Response, next: NextFunction) => {
    const curUserId = (req.session.userId as string) ?? '';
    const communityName = (req.params.communityName);
    const follow = await FollowCollection.findOne(curUserId, communityName);
    if (!follow) {
      res.status(404).json({
        error: {
          followNotFound: `Follow between current user and ${communityName} does not exist.`
        }
      });
      return;
    }
  
    next();
  };

  /**
   * Checks if name of community in req.params is a valid community name
   */
  const isValidCommunityName = async (req: Request, res: Response, next: NextFunction) => {
    // const communityName = req.params.communityName;
    // const validCommunityName = communities.includes(communityName);
    // if (!validCommunityName) {
    //     res.status(400).json({
    //       error: {
    //         invalidCommunityNameRequest: `${communityName} is not a valid communityName.`
    //       }
    //     });
    //     return;
    //   }
    
    //   next();
  }

  /**
 * Checks if current user already follows the user in req.params
 */
const isRepeatFollow = async (req: Request, res: Response, next: NextFunction) => {
    const curUserId = (req.session.userId as string) ?? '';
    const communityName = req.params.communityName;
    const follow = await FollowCollection.findOne(curUserId, communityName);
    if (follow) {
      res.status(409).json({
        error: `Follow between current user and ${communityName} already exists.`
      });
      return;
    }
  
    next();
  };

export {
    isFollowExists,
    isValidCommunityName,
    isRepeatFollow
};