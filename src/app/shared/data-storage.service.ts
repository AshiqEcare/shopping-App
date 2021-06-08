import { RecipeService } from './../recipes/recipe.service';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes()

    // post request add values to the data
    // put request completely re-save the data
    this.http.put('https://shopping-app-7a0ef-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(response => console.log(response))
  }

  getRecipes() {
    return this.http.get<Recipe[]>('https://shopping-app-7a0ef-default-rtdb.firebaseio.com/recipes.json').pipe(map(recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
      })
    }), tap(recipes => {
      this.recipeService.setRecipes(recipes)
      console.log(recipes)
    }))
  }

}