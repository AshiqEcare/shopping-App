import { Subscription } from 'rxjs';
import { RecipeService } from './../recipe.service';
import { Recipe } from "./../recipe.model";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-recipes-list",
  templateUrl: "./recipes-list.component.html",
  styleUrls: ["./recipes-list.component.scss"]
})
export class RecipesListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  subscription: Subscription

  constructor(private recipeService: RecipeService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscription = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes
    })

    this.recipes = this.recipeService.getRecipes();
  }

  goToNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
