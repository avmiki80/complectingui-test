import {AbstractIdentifiableObject} from "../model/entity/AbstractIdentifiableObject";
import {Observable} from "rxjs";

export interface ICrudService<E extends AbstractIdentifiableObject> {
  add(e: E): Observable<E>;
  update(e: E): Observable<E>;
  get(id: number): Observable<E>;
  delete(id: number): Observable<E>
  getAll(): Observable<E[]>;
}
