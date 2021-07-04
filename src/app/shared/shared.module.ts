import { CommonModule } from '@angular/common';
import { PlaceholderDirective } from './placeholder.directive';
import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { NgModule } from "@angular/core";
import { AlertModalComponent } from "./alert-modal/alert-modal.component";

@NgModule({
  declarations: [AlertModalComponent, LoadingSpinnerComponent, DropdownDirective, PlaceholderDirective],
  imports: [CommonModule],
  exports: [AlertModalComponent, LoadingSpinnerComponent, DropdownDirective, PlaceholderDirective, CommonModule],
  entryComponents: [AlertModalComponent]
})
export class SharedModule {

}