import type { HydratedDocument } from 'mongoose';
import type { Food } from '../food/model';
import UserCollection from '../user/collection';
import { FoodResponse } from '../food/util';
import * as foodUtils from '../food/util';

type RecipeIngredient = {
  _id: number;
  name: string[];
  amount: number;
  unit: string;
  status?: string; // either 'used' or 'missing'
  stockpileMatches?: FoodResponse[];
}

type RecipeResponse = {
  _id: number;
  name: string;
  imageUrl: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  source: string;
  usedCount?: number;
  expiringCount?: number;
};


/**
 * Transform a recipe response from the api into an object
 * with all the information needed by the frontend with used 
 * ingredient information
 *
 * @param {Object} recipe - a recipe response from the api
 * @returns {RecipeResponse} - The recipe object
 */
const constructSuggestedRecipeResponse = (stockpile: Array<HydratedDocument<Food>>, recipe: Record<any, any>): RecipeResponse => {
  // Find all used ingredient ids
  const usedIds = new Set<number>;
  for (const ingredient of recipe.usedIngredients) {
    usedIds.add(ingredient.id);
  }

  // Create recipe ingredients with match to stockpile
  let week = new Date();
  week.setDate(week.getDate() + 7);
  let expiringCount = 0;
  const ingredients: RecipeIngredient[] = [];

  recipe.extendedIngredients.forEach((ingredient: Record<any, any>) => {
    // name contains both name and nameClean, if they differ
    const recipeIngredientNames = ingredient.name !== ingredient.nameClean ? [ingredient.name, ingredient.nameClean] : [ingredient.name];
    const stockpileMatches = stockpile.filter((stockpileIngredient) => recipeIngredientNames.some((recipeIngredientName) => recipeIngredientName.includes(stockpileIngredient.name.toLowerCase()))).map(foodUtils.constructFoodResponse);
    expiringCount += stockpileMatches.reduce((prev, curr) => (curr.rawExpiration <= week) ? prev + 1 : prev, 0);

    ingredients.push({
      _id: ingredient.id,
      name: recipeIngredientNames,
      amount: ingredient.amount,
      unit: ingredient.unit,
      status: (usedIds.has(ingredient.id)) ? "used" : "missing",
      stockpileMatches,
    });
  });

  return {
    _id: recipe.id,
    name: recipe.title,
    imageUrl: recipe.image,
    ingredients,
    instructions: recipe.analyzedInstructions.length ? recipe.analyzedInstructions[0].steps.map((step: any) => { return step.step; }) : [],
    source: recipe.sourceUrl,
    usedCount: recipe.usedIngredientCount,
    expiringCount
  };
};

/**
 * Transform a recipe response from the api into an object
 * with all the information needed by the frontend
 *
 * @param {Object} recipe - a recipe response from the api
 * @returns {RecipeResponse} - The recipe object
 */
const constructQueryRecipeResponse = (recipe: Record<any, any>): RecipeResponse => {
  // Create recipe ingredients
  const ingredients = recipe.extendedIngredients.map((ingredient: Record<any, any>) => {
    return {
      _id: ingredient.id,
      name: ingredient.name !== ingredient.nameClean ? [ingredient.name, ingredient.nameClean] : [ingredient.name],
      amount: ingredient.amount,
      unit: ingredient.unit,
    };
  });

  return {
    _id: recipe.id,
    name: recipe.title,
    imageUrl: recipe.image,
    ingredients,
    instructions: recipe.analyzedInstructions.length ? recipe.analyzedInstructions[0].steps.map((step: any) => { return step.step; }) : [],
    source: recipe.sourceUrl,
  };
};

const constructUrlWithParams = (params: Record<string, string>): string => {
  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}`;

  for (const [key, value] of Object.entries(params)) {
    url += `&${key}=${value}`;
  }

  return url;
}

const addUserInformationToParams = async (params: Record<string, string>, userId: string): Promise<void> => {
  // Add intolerances
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

    params.intolerances = intoleranceStr;
  }

  // Add diets
  if (user.otherDietaryRestrictions.length) {
    let dietStr = '';
    user.otherDietaryRestrictions.forEach((value, index) => {
      if (index == 0) {
        dietStr += value;
      } else {
        dietStr += `, ${value}`;
      }
    });

    params.diet = dietStr;
  }
}

export {
  constructSuggestedRecipeResponse,
  constructQueryRecipeResponse,
  constructUrlWithParams,
  addUserInformationToParams,
};