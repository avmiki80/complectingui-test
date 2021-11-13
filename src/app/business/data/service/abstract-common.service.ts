import {Injectable, InjectionToken} from '@angular/core';
import {AbstractBaseService} from "./abstract-base.service";
import {AbstractIdentifiableObject} from "../model/entity/AbstractIdentifiableObject";
import {HttpClient} from "@angular/common/http";
import {ICommonService} from "./ICommonService";
import {Observable} from "rxjs";
import {SearchObject} from "../model/search/SearchObject";

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractCommonService<E extends AbstractIdentifiableObject, S extends SearchObject> extends AbstractBaseService implements ICommonService<E, S>{

  constructor(
    baseUrl: InjectionToken<string>,
    httpClient: HttpClient) {
    super(baseUrl, httpClient);
  }

  searchPage(search: S): Observable<any>{
    return this.httpClient.post<any>(this.baseUrl + '/search', search);
  }
  search(search: S): Observable<E[]>{
    return this.httpClient.post<E[]>(this.baseUrl + '/search', search);
  }

  add(obj: E): Observable<E> {
    return this.httpClient.put<E>(this.baseUrl + '/add', obj);
  }

  delete(id: number): Observable<E> {
    return this.httpClient.post<E>(this.baseUrl + '/delete', id);
  }

  get(id: number): Observable<E> {
    return this.httpClient.post<E>(this.baseUrl + '/get', id);
  }

  getAll(): Observable<E[]> {
    return this.httpClient.post<E[]>(this.baseUrl + '/getAll', null);
  }

  update(obj: E): Observable<E> {
    return this.httpClient.patch<E>(this.baseUrl + '/update', obj);
  }
}
