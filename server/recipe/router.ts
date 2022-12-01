import type { Request, Response } from 'express';
import fetch from 'cross-fetch';
import express from 'express';
import FoodCollection from '../food/collection';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get the signed in user
 *
 * @name GET /api/recipes/suggested
 *
 * @return - suggested recipes for currently logged in user
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
    const params: Record<string, string> = {
      addRecipeInformation: 'true',
      fillIngredients: 'true',
    };

    // Add ingredients
    const fullStockpile = await FoodCollection.findAllByUser(userId);
    const filteredStockpile = fullStockpile.filter(food => !food.prepared && (food.expiration > today));
    const names = filteredStockpile.map((food) => food.name);
    if (names.length) {
      const ingredients = names.reduce((prev: string, current: string) => prev + ',+' + current);

      params.includeIngredients = ingredients;
      params.sort = 'max-used-ingredients';
    }

    await util.addUserInformationToParams(params, userId);
    params.number = "1";
    const url = util.constructUrlWithParams(params)

    const r = await fetch(url);
    const apiRes = await r.json();

    if (!r.ok) {
      res.status(apiRes.status).json({ error: apiRes.error });
      return;
    }

    const response = apiRes.results.map((recipe: Record<any, any>) => util.constructSuggestedRecipeResponse(filteredStockpile, recipe));
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
 * @throws {403} - If user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const params: Record<string, string> = {
      query: (req.query.recipeName as string),
      addRecipeInformation: 'true',
      fillIngredients: 'true',
    };

    await util.addUserInformationToParams(params, req.session.userId);
    params.number = "1";
    const url = util.constructUrlWithParams(params);

    const r = await fetch(url);
    const apiRes = await r.json();

    if (!r.ok) {
      res.status(apiRes.status).json({ error: apiRes.error });
      return;
    }

    const response = apiRes.results.map(util.constructQueryRecipeResponse);
    res.status(200).json(response);
    return;
  }
);

export { router as recipeRouter };
