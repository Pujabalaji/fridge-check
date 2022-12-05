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
  status: string; // either 'used' or 'missing'
  stockpileMatches: FoodResponse[];
}

type RecipeResponse = {
  _id: number;
  name: string;
  imageUrl: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  usedCount: number;
  expiringCount: number;
  source: string;
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
  week.setHours(0);
  week.setDate(week.getDate() + 7);
  let expiringCount = 0;
  const ingredients: RecipeIngredient[] = [];

  recipe.extendedIngredients.forEach((ingredient: Record<any, any>) => {
    // name contains both name and nameClean, if they differ
    const recipeIngredientNames: string[] = (ingredient.name !== ingredient.nameClean && ingredient.nameClean) ? [ingredient.name, ingredient.nameClean] : [ingredient.name];
    let stockpileMatches: FoodResponse[] = [];
    if (usedIds.has(ingredient.id)) {
      stockpile.forEach((stockpileIngredient) => {
        const lowerStockpileName = stockpileIngredient.name.toLowerCase();
        let foundMatch = false;
        if (recipeIngredientNames.some((recipeIngredientName) => recipeIngredientName.includes(lowerStockpileName) || lowerStockpileName.includes(recipeIngredientName))) {
          stockpileMatches.push(foodUtils.constructFoodResponse(stockpileIngredient));
          if (!foundMatch && stockpileIngredient.expiration <= week) {
            expiringCount += 1;
          }
          foundMatch = true;
        }
      });
    }

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
    prepTime: recipe.preparationMinutes,
    cookTime: recipe.cookingMinutes,
    usedCount: recipe.usedIngredientCount,
    expiringCount,
    source: recipe.sourceUrl,
  };
};

/**
 * Transform a recipe response from the api into an object
 * with all the information needed by the frontend
 *
 * @param {Object} recipe - a recipe response from the api
 * @returns {RecipeResponse} - The recipe object
 */
const constructQueryRecipeResponse = (stockpile: Array<HydratedDocument<Food>>, recipe: Record<any, any>): RecipeResponse => {
  // Create recipe ingredients
  let week = new Date();
  week.setHours(0);
  week.setDate(week.getDate() + 7);
  let expiringCount = 0;
  let usedCount = 0;
  const ingredients: RecipeIngredient[] = [];

  recipe.extendedIngredients.forEach((ingredient: Record<any, any>) => {
    // name contains both name and nameClean, if they differ
    const recipeIngredientNames: string[] = (ingredient.name !== ingredient.nameClean && ingredient.nameClean) ? [ingredient.name, ingredient.nameClean] : [ingredient.name];
    let stockpileMatches: FoodResponse[] = [];

    stockpile.forEach((stockpileIngredient) => {
      const lowerStockpileName = stockpileIngredient.name.toLowerCase();
      let foundMatch = false;

      if (recipeIngredientNames.some((recipeIngredientName) => recipeIngredientName.includes(lowerStockpileName))) {
        stockpileMatches.push(foodUtils.constructFoodResponse(stockpileIngredient));
       
        if (!foundMatch) {
          usedCount += 1;
          expiringCount += (stockpileIngredient.expiration <= week) ? 1 : 0;
        }
        foundMatch = true;
      }
    });

    ingredients.push({
      _id: ingredient.id,
      name: recipeIngredientNames,
      amount: ingredient.amount,
      unit: ingredient.unit,
      status: (stockpileMatches.length) ? "used" : "missing",
      stockpileMatches,
    });
  });

  return {
    _id: recipe.id,
    name: recipe.title,
    imageUrl: recipe.image,
    ingredients,
    instructions: recipe.analyzedInstructions.length ? recipe.analyzedInstructions[0].steps.map((step: any) => { return step.step; }) : [],
    prepTime: recipe.preparationMinutes,
    cookTime: recipe.cookingMinutes,
    usedCount,
    expiringCount,
    source: recipe.sourceUrl,
  };
};

const constructUrlWithParams = (params: Record<string, string>): string => {
  const keys = [process.env.API_KEY, process.env.API_KEY2, process.env.API_KEY3, process.env.API_KEY4, process.env.API_KEY5];
  const random = Math.floor(Math.random() * 5);
  
  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${keys[random]}`;

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