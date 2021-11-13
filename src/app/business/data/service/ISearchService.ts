import {SearchObject} from "../model/search/SearchObject";
import {Observable} from "rxjs";
import {AbstractIdentifiableObject} from "../model/entity/AbstractIdentifiableObject";

export interface ISearchService<E extends AbstractIdentifiableObject, S extends SearchObject> {
  searchPage(search: S): Observable<any>;
  search(search: S): Observable<E[]>;
}
