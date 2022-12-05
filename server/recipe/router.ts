import type { Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import fetch from 'cross-fetch';
import express from 'express';
import FoodCollection from '../food/collection';
import { Food } from '../food/model';
import * as userValidator from '../user/middleware';
import * as util from './util';


const router = express.Router();

/**
 * Gets all suggested recipes for current user based 
 * on their stockpile and dietary restrictions
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
    today.setHours(0);
    const userId = (req.session.userId as string) ?? '';
    const params: Record<string, string> = {
      addRecipeInformation: 'true',
      fillIngredients: 'true',
    };

    // Add ingredients
    const fullStockpile = await FoodCollection.findAllByUser(userId);
    const filteredStockpile: HydratedDocument<Food>[] = [];
    let ingredientStr = '';

    fullStockpile.forEach((food) => {
      if (!food.prepared && food.expiration > today) {
        filteredStockpile.push(food);
        if (ingredientStr.length === 0) {
          ingredientStr = food.name;
        } else {
          ingredientStr += `,+${food.name}`;
        }
      }
    });

    if (ingredientStr.length) {
      params.includeIngredients = ingredientStr;
      params.sort = 'max-used-ingredients';
    }

    await util.addUserInformationToParams(params, userId);
    params.number = '5';
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
 * Gets recipes searching by given name and dietary restrictions
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
    const today = new Date();
    today.setHours(0);
    const params: Record<string, string> = {
      query: (req.query.recipeName as string),
      addRecipeInformation: 'true',
      fillIngredients: 'true',
    };

    await util.addUserInformationToParams(params, req.session.userId);
    params.number = '5';
    const url = util.constructUrlWithParams(params);

    const r = await fetch(url);
    const apiRes = await r.json();

    if (!r.ok) {
      res.status(apiRes.status).json({ error: apiRes.error });
      return;
    }

    const fullStockpile = await FoodCollection.findAllByUser(req.session.userId);
    const filteredStockpile = fullStockpile.filter((food) => !food.prepared && food.expiration > today);

    const response = apiRes.results.map((recipe:Record<any, any>) => util.constructQueryRecipeResponse(filteredStockpile, recipe));
    response.sort((recipe1: any, recipe2: any) => {
      if (recipe1.usedCount > recipe2.usedCount) {
        return -1;
      } else if (recipe1.usedCount < recipe2.usedCount) {
        return 1;
      } else if (recipe1.expiringCount > recipe2.expiringCount) {
        return -1;
      } else {
        return 1;
      }
    });
    res.status(200).json(response);
    return;
  }
);

export { router as recipeRouter };
