import type { Request, Response } from 'express';
import fetch from 'cross-fetch';
import express from 'express';
import FoodCollection from '../food/collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get the signed in user
 *
 * @name GET /api/recipes/suggested
 *
 * @return - currently logged in user, or null if not logged in
 * @throws {403} - If user is not logged in
 */
router.get(
  '/suggested',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const today = new Date();
    const userId = (req.session.userId as string) ?? '';
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&addRecipeInformation=true&fillIngredients=true`;

    // Add ingredients
    const stockpile = await FoodCollection.findAllByUser(userId);
    const names = stockpile.filter(food => food.expiration >= today).map((food) => food.name);
    if (names.length) {
      const ingredients = names.reduce((prev: string, current: string) => prev + ',+' + current);
      url += `&includeIngredients=${ingredients}&sort=max-used-ingredients`;
    }

    // Add intolerances to url
    const user = await UserCollection.findOneByUserId(userId);
    if (user.allergies.length) {
      let intoleranceStr = '';
      user.allergies.forEach((value, index) => {
        if (index == 0) {
          intoleranceStr += value;
        } else {
          intoleranceStr += `, ${value}`;
        }
      });
      url += `&intolerances=${intoleranceStr}`;
    }

    // Add diets to url
    if (user.otherDietaryRestrictions.length) {
      let dietStr = '';
      user.otherDietaryRestrictions.forEach((value, index) => {
        if (index == 0) {
          dietStr += value;
        } else {
          dietStr += `, ${value}`;
        }
      });
      url += `&diet=${dietStr}`;
    }

    // fetch stuff
    const r = await fetch(url);
    const apiRes = await r.json();

    if (!r.ok) {
      res.status(apiRes.status).json({ error: apiRes.error });
      return;
    }

    const response = apiRes.results.map(util.constructRecipeResponse);
    res.status(200).json(response);
    return;
  }
);

/**
 * Sign in user.
 *
 * @name GET /api/recipes?recipeName=name
 *
 * @return {RecipeResponse[]} - An array of recipes with given name
 * 
 */
router.get(
  '/',
  async (req: Request, res: Response) => {
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&query=${req.query.recipeName}&addRecipeInformation=true&fillIngredients=true`;
    const r = await fetch(url);
    const apiRes = await r.json();


    if (!r.ok) {
      res.status(apiRes.status).json({ error: apiRes.error });
      return;
    }

    const response = apiRes.results.map(util.constructRecipeResponse);
    res.status(200).json(response);
    return;
  }
);

export { router as recipeRouter };
