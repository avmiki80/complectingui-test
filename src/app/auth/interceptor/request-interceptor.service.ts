import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from "rxjs/operators";
/*
  Interceptor - перехватывает все исходящие запросы - можно изменять данные перед отправкой
 */
@Injectable({
  providedIn: 'root'
})
export class RequestInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true // разрешить отправку куков на backend
    });
    return next.handle(req); // отправляем исходящий запрос дальше на backend
  }
}
