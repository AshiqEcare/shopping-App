import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      //  if user not logged in / no user details
      if (!user) {
        return next.handle(req)
      }
      //  if user logged in / user details present
      const modifiedRequest = req.clone({
        params: new HttpParams().set('auth', user.token)
      })
      return next.handle(modifiedRequest)
    }))
  }
}