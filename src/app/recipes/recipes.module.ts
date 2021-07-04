import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipesDetailComponent } from "./recipes-detail/recipes-detail.component";
import { RecipesItemComponent } from "./recipes-list/recipes-item/recipes-item.component";
import { RecipesListComponent } from "./recipes-list/recipes-list.component";
import { RecipesStartComponent } from "./recipes-start/recipes-start.component";
import { RecipesComponent } from "./recipes.component";
import { RecipesRoutingModule } from './recipes.routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    RecipesComponent,
    RecipesListComponent,
    RecipesDetailComponent,
    RecipesItemComponent,
    RecipesStartComponent,
    RecipeEditComponent,
  ],
  imports: [RouterModule, SharedModule, ReactiveFormsModule, RecipesRoutingModule],
  // exports: [
  //   RecipesComponent,
  //   RecipesListComponent,
  //   RecipesDetailComponent,
  //   RecipesItemComponent,
  //   RecipesStartComponent,
  //   RecipeEditComponent,
  // ]
})

export class RecipesModule {

}