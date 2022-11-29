import type {Request, Response} from 'express';
import fetch from 'cross-fetch';
import express from 'express';
import * as util from './util';

const router = express.Router();

/**
 * Get the signed in user
 *
 * @name GET /api/recipes/suggested
 *
 * @return - currently logged in user, or null if not logged in
 */
router.get(
  '/suggested',
  async (req: Request, res: Response) => {
    return res.status(404).json({error: "Implement this function"});
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
    const apiRes:any = await r.json();

    
    if (!r.ok) {
      res.status(apiRes.status).json({error: apiRes.error});
      return;
    }
    
    const response = apiRes.results.map(util.constructRecipeResponse);
    res.status(200).json(response);
    return;
  }
);

export {router as recipeRouter};
