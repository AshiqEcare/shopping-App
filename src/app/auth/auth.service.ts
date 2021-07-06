import { environment } from './../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { Subject, throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string,
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // user = new Subject<User>();
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any

  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKEY,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }
        )
      )


    // Catch & Throw error handling seperate type
    // .pipe(catchError(errorRes => {
    //   let errorMessage = 'An unknown error occurred.!'
    //   if (!errorRes.error || !errorRes.error.error) {
    //     return throwError(errorMessage)
    //   }
    //   switch (errorRes.error.error.message) {
    //     case 'EMAIL_EXISTS':
    //       errorMessage = 'This email already exixts.!'
    //     default:
    //       break;
    //   }
    //   return throwError(errorMessage)
    // }))

    // handle authentication seperate type
    // tap(resData => {
    //   // forming date stamp for user constructor
    //   const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000)
    //   // forming user constructor
    //   const user = new User(resData.email, resData.localId, resData.idToken, expirationDate)
    //   // emiting the user to whole app for user details
    //   this.user.next(user)
    // }))
  }

  logIn(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKEY,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }
        ))
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'))

    if (!userData) {
      return
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

    if (loadedUser.token) {
      this.user.next(loadedUser)
      // getting expiration duration
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(expirationDuration)
    }
  }

  logout() {
    this.user.next(null)
    this.router.navigate(['/login'])
    localStorage.removeItem('userData') // clear's specif local storage key
    localStorage.clear() // clear's all localstorage items 

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }

    this.tokenExpirationTimer = null
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout()
    }, expirationDuration);
  }


  private handleAuthentication(email: string, userId: string, token: string,
    expiresIn: number) {
    // forming date stamp for user constructor
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
    // forming user constructor
    const user = new User(email, userId, token, expirationDate)
    // emiting the user to whole app for user details
    this.user.next(user)
    //calling autologout with timer
    this.autoLogout(expiresIn * 1000)
    // storing user data into local storage
    localStorage.setItem('userData', JSON.stringify(user))
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.!'
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage)
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exixts.!'
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email doesnot exixt.!'
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password entered is wrong.!'
        break;
    }
    return throwError(errorMessage)
  }
}