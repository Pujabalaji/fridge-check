import { Dictionary } from "vue-router/types/router";

type RecipeIngredient = {
  _id: number;
  name: string[];
  amount: number;
  unit: string;
  status?: string;
}

type RecipeResponse = {
  _id: number;
  name: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  source: string;
  usedCount?: number;
  usedIds?: Set<number>;
};


/**
 * Transform a recipe response from the api into an object
 * with all the information needed by the frontend
 *
 * @param {Object} recipe - a recipe response from the api
 * @returns {RecipeResponse} - The recipe object
 */
const constructRecipeResponse = (recipe: Dictionary<any>): RecipeResponse => {
  // Find all used ingredients, if any
  const usedIds = new Set<number>;
  if ("usedIngredients" in recipe) {
    for (const ingredient of recipe.usedIngredients) {
      usedIds.add(ingredient.id);
    }
  }
  
  // Create recipe ingredients
  const ingredients = recipe.extendedIngredients.map((ingredient: Dictionary<any>) => {
    const ingredientResponse: RecipeIngredient = {
      _id: ingredient.id,
      name: ingredient.name !== ingredient.nameClean ? [ingredient.name, ingredient.nameClean] : [ingredient.name],
      amount: ingredient.amount,
      unit: ingredient.unit,
    };

    if ("usedIngredients" in recipe) {
      ingredientResponse.status = (ingredient.id in usedIds) ? "used" : "missing";
    }

    return ingredientResponse;
  });

  const recipeResponse:RecipeResponse = {
    _id: recipe.id,
    name: recipe.title,
    ingredients,
    instructions: recipe.analyzedInstructions.length ? recipe.analyzedInstructions[0].steps.map((step: any) => { return step.step; }) : [],
    source: recipe.sourceUrl,
  };

  if ("usedIngredients" in recipe) {
    recipeResponse.usedCount = recipe.usedIngredientCount;
    recipeResponse.usedIds = usedIds;
  }

  return recipeResponse;
};

export {
  constructRecipeResponse
};