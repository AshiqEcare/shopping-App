import { Ingredient } from "./../../shared/ingredient.model";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-shopping-edit",
  templateUrl: "./shopping-edit.component.html",
  styleUrls: ["./shopping-edit.component.scss"]
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // @ViewChild("nameInput", { static: false }) nameInput: ElementRef;
  // @ViewChild("amountInput", { static: false }) amountInput: ElementRef;

  @ViewChild("f", { static: false }) slForm: NgForm;
  editingStartedSubscription: Subscription;
  editMode = false;
  deleteMode = false
  editedItemIndex: number;
  editedItem: Ingredient;
  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.editingStartedSubscription = this.slService.editingStarted.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.slService.getIngredient(index)
        this.deleteMode = true;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    )
  }

  onSubmit(form: NgForm) {
    // const ingName = this.nameInput.nativeElement.value;
    // const ingAmount = this.amountInput.nativeElement.value;

    const value = form.value
    const newIngredient = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, newIngredient)
    } else {
      this.slService.addIngredient(newIngredient);
    }

    this.editMode = false;
    form.reset();
  }

  clear() {
    this.editMode = false;
    this.deleteMode = false;
    this.slForm.reset();
  }

  delete() {
    this.clear();
    this.slService.deleteIngredient(this.editedItemIndex)
  }

  ngOnDestroy() {
    this.editingStartedSubscription.unsubscribe()
  }
}
