import { ShoppingListService } from './shopping-list.service';
import { Ingredient } from "./../shared/ingredient.model";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-shopping-list",
  templateUrl: "./shopping-list.component.html",
  styleUrls: ["./shopping-list.component.scss"]
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  isChange: Subscription

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    this.isChange = this.slService.ingredientsChanged.subscribe((ingredient: Ingredient[]) => {
      this.ingredients = ingredient;
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.isChange.unsubscribe()
  }

  onItemEdit(index: number) {
    this.slService.editingStarted.next(index);
  }

}
