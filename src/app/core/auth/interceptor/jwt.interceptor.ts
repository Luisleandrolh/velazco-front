import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  //token definido
  private token: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzQ3NDI3MDg1LCJleHAiOjE3NTg0MjcwODV9.CX_46TcslLoORPiVkoRw1Ig0uFYNfg6HnNGlMeJohl0';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`
      }
    });
  
 
    return next.handle(clonedReq);
  }
}
