import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild([{ path: 'login', component: AuthComponent }]), SharedModule],
  exports: [AuthComponent]
})
export class AuthModule {

}