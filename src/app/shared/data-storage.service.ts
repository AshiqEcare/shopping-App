import { AuthService } from './../auth/auth.service';
import { RecipeService } from './../recipes/recipe.service';
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes()

    // post request add values to the data
    // put request completely re-save the data
    this.http.put('https://shopping-app-7a0ef-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(response => console.log(response))
  }

  getRecipes() {
    // return this.authService.user.pipe(take(1), exhaustMap(user => {
    //   return this.http.get<Recipe[]>('https://shopping-app-7a0ef-default-rtdb.firebaseio.com/recipes.json', {
    //     params: new HttpParams().set('auth', user.token)
    //   })
    // }), map(recipes => {
    //   return recipes.map(recipe => {
    //     return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
    //   })
    // }), tap(recipes => {
    //   this.recipeService.setRecipes(recipes)
    //   console.log(recipes)
    // }))


    // without passing token
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