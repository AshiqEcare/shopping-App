import { RecipeService } from './../recipes/recipe.service';
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  @Output() featureSelected = new EventEmitter<string>();

  constructor(private recipeService: RecipeService, private dataStorageService: DataStorageService) { }

  ngOnInit() { }

  // without routing method
  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }

  onSaveRecipe() {
    this.dataStorageService.storeRecipes()
  }

  onFetchRecipe() {
    this.dataStorageService.getRecipes().subscribe()
  }
}
