import { OnDestroy } from '@angular/core';
import { PlaceholderDirective } from './../shared/placeholder.directive';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthResponseData, AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { AlertModalComponent } from '../shared/alert-modal/alert-modal.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  isLoginMode = true;
  isLoading = false;
  error: string = null

  user = new Subject<User>();

  private closeSub: Subscription


  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit(form: NgForm) {
    // console.log(form.value)
    if (!form.valid) {
      return;
    }
    this.isLoading = true
    const email = form.value.email
    const password = form.value.password

    let authObs: Observable<AuthResponseData>

    if (this.isLoginMode) {
      authObs = this.authService.logIn(email, password)
    } else {
      authObs = this.authService.signUp(email, password)
    }

    // common subscribe for both login & signup's
    authObs.subscribe(resData => {
      console.log(resData)
      this.isLoading = false
      this.error = null
      // on succesful loggin, navigate to recipes section
      this.router.navigate(['/recipes'])
    }, errorMessage => {
      console.log(errorMessage)
      this.error = errorMessage
      this.showErrorAlert(errorMessage)
      this.isLoading = false
    })
    form.reset()
  }

  onHandleError() {
    this.error = null
  }

  private showErrorAlert(message: string) {
    const alertComFactoryResolver = this.componentFactoryResolver.resolveComponentFactory(AlertModalComponent)

    const viewAlertHostRef = this.alertHost.viewContainerRef

    // clearing previous instances of viewcontainer
    viewAlertHostRef.clear()

    // making an instance of the view container
    const containerRef = viewAlertHostRef.createComponent(alertComFactoryResolver)

    containerRef.instance.message = message
    this.closeSub = containerRef.instance.close.subscribe(() => {
      viewAlertHostRef.clear()
      this.closeSub.unsubscribe()
    })
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe()
    }
  }


}
