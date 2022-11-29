import { Dictionary } from "vue-router/types/router";

type RecipeIngredient = {
  _id: number;
  name: string[];
  amount: number;
  unit: string;
}

type RecipeResponse = {
  _id: number;
  name: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  source: string;
};


/**
 * Transform a recipe response from the api into an object
 * with all the information needed by the frontend
 *
 * @param {Object} recipe - a recipe response from the api
 * @returns {RecipeResponse} - The recipe object
 */
const constructRecipeResponse = (recipe: Dictionary<any>): RecipeResponse => {
  return {
    _id: recipe.id,
    name: recipe.title,
    ingredients: recipe.extendedIngredients.map((ingredient: Dictionary<any>) => {
      return {
        _id: ingredient.id,
        name: ingredient.name !== ingredient.nameClean ? [ingredient.name, ingredient.nameClean] : [ingredient.name],
        amount: ingredient.amount,
        unit: ingredient.unit
      }
    }
    ),
    instructions: recipe.analyzedInstructions.length ? recipe.analyzedInstructions[0].steps.map((step: any) => { return step.step; }) : [],
    source: recipe.sourceUrl,
  };
};

export {
  constructRecipeResponse
};