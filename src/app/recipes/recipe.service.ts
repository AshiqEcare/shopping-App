import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  // for cross component communication
  public recipeSelected = new EventEmitter<Recipe>();
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     "Test Recipe",
  //     "A Test Recipe description",
  //     "https://cookieandkate.com/images/2019/10/best-red-chilaquiles-recipe-3.jpg",
  //     [
  //       new Ingredient('Meat', 1),
  //       new Ingredient('French Fries', 10)
  //     ]
  //   ),
  //   new Recipe(
  //     "Test Recipe 2",
  //     "A Test Recipe description 2",
  //     "https://cookieandkate.com/images/2019/10/best-red-chilaquiles-recipe-3.jpg",
  //     [
  //       new Ingredient('Meat', 5),
  //       new Ingredient('French Fries', 5)
  //     ]
  //   )
  // ];

  private recipes: Recipe[] = []

  constructor(private slService: ShoppingListService) { }

  getRecipes() {
    // we will get a copy of this recipe array outside
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe)
    this.recipesChanged.next(this.recipes.slice())
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe
    this.recipesChanged.next(this.recipes.slice())
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1)
    this.recipesChanged.next(this.recipes.slice())
  }

  setRecipes(recipe: Recipe[]) {
    this.recipes = recipe
    this.recipesChanged.next(this.recipes.slice())
  }
}