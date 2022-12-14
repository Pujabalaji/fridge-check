import type {Request, Response, NextFunction} from 'express';
import UserCollection from '../user/collection';
import { communities, allergies, Allergy, otherRestrictions, OtherRestriction } from '../user/model';

/**
 * Checks if the current session user (if any) still exists in the database, for instance,
 * a user may try to post something in some browser while the account has been deleted in another or
 * when a user tries to modify an account in some browser while it has been deleted in another
 */
const isCurrentSessionUserExists = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await UserCollection.findOneByUserId(req.session.userId);

    if (!user) {
      req.session.userId = undefined;
      res.status(500).json({
        error: 'User session was not recognized.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if a username in req.body is valid, that is, it matches the username regex
 */
const isValidUsername = (req: Request, res: Response, next: NextFunction) => {
  const usernameRegex = /^\w+$/i;
  if (!usernameRegex.test(req.body.username)) {
    res.status(400).json({
      error: 'Username must be a nonempty alphanumeric string.'
    });
    return;
  }

  next();
};

/**
 * Checks if a password in req.body is valid, that is, at 6-50 characters long without any spaces
 */
const isValidPassword = (req: Request, res: Response, next: NextFunction) => {
  const passwordRegex = /^\S+$/;
  if (!passwordRegex.test(req.body.password)) {
    res.status(400).json({
      error: 'Password must be a nonempty string.'
    });
    return;
  }

  next();
};


/**
 * Checks if proposed home community is valid
 */
 const isValidHomeCommunity = (req: Request, res: Response, next: NextFunction) => {
  if ("homeCommunity" in req.body && !communities.includes(req.body.homeCommunity)) {
    res.status(400).json({
      error: 'Home Community must be a valid living community at or near MIT.'
    });
    return;
  }
  next();
};

/**
 * Checks if proposed email is valid
 */
 const isValidEmail = (req: Request, res: Response, next: NextFunction) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if ("email" in req.body && !emailRegex.test(req.body.email)) {
    res.status(400).json({
      error: 'You must provide a valid email address.'
    });
    return;
  }
  next();
};

/**
 * Checks if proposed allergies are valid
 */
 const isValidAllergies = (req: Request, res: Response, next: NextFunction) => {
  if ("allergies" in req.body && !req.body.allergies.every((element: String) => {
    return allergies.includes(element as Allergy);
  })) {
    res.status(400).json({
      error: 'All allergies must be valid allergies.'
    });
    return;
  }
  next();
};

/**
 * Checks if proposed dietary restrictions are valid
 */
 const isValidDietaryRestrictions = (req: Request, res: Response, next: NextFunction) => {
  if ("otherDietaryRestrictions" in req.body && !req.body.otherDietaryRestrictions.every((element: String) => {
    return otherRestrictions.includes(element as OtherRestriction);
  })) {
    res.status(400).json({
      error: 'All dietery restrictions must be valid restrictions.'
    });
    return;
  }
  next();
};

/**
 * Checks if a user with username and password in req.body exists
 */
const isAccountExists = async (req: Request, res: Response, next: NextFunction) => {
  const {username, password} = req.body as {username: string; password: string};

  if (!username || !password) {
    res.status(400).json({error: `Missing ${username ? 'password' : 'username'} credentials for sign in.`});
    return;
  }

  const user = await UserCollection.findOneByUsernameAndPassword(
    username, password
  );

  if (user) {
    next();
  } else {
    res.status(401).json({error: 'Invalid user login credentials provided.'});
  }
};

/**
 * Checks if a username in req.body is already in use
 */
const isUsernameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.username !== undefined) { // If username is not being changed, skip this check
    const user = await UserCollection.findOneByUsername(req.body.username);

    // If the current session user wants to change their username to one which matches
    // the current one irrespective of the case, we should allow them to do so
    if (user && (user?._id.toString() !== req.session.userId)) {
      res.status(409).json({
        error: 'An account with this username already exists.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the user is logged in, that is, whether the userId is set in session
 */
const isUserLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    res.status(403).json({
      error: 'You must be logged in to complete this action.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user is signed out, that is, userId is undefined in session
 */
const isUserLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    res.status(403).json({
      error: 'You are already signed in.'
    });
    return;
  }

  next();
};

export {
  isCurrentSessionUserExists,
  isUserLoggedIn,
  isUserLoggedOut,
  isUsernameNotAlreadyInUse,
  isAccountExists,
  isValidUsername,
  isValidPassword,
  isValidEmail,
  isValidAllergies,
  isValidDietaryRestrictions,
  isValidHomeCommunity
};
