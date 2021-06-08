import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { RecipeService } from './../recipes/recipe.service';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from "@angular/core";
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() featureSelected = new EventEmitter<string>();
  isAuthenticated = false;
  userSub: Subscription;

  constructor(private recipeService: RecipeService, private dataStorageService: DataStorageService, private authService: AuthService) { }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true
      // this.isAuthenticated = !!user // alternative, shorter method
    })
  }

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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.userSub.unsubscribe()
  }
}
