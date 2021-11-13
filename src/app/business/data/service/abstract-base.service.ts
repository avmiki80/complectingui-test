import {Injectable, InjectionToken} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractBaseService{
  protected baseUrl: InjectionToken<string>;
  protected httpClient: HttpClient;
  constructor(baseUrl: InjectionToken<string>, httpClient: HttpClient) {
    this.baseUrl = baseUrl;
    this.httpClient = httpClient;
  }
}
