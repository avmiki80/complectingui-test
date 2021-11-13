import {Observable} from "rxjs";
import {AbstractIdentifiableObject} from "../model/entity/AbstractIdentifiableObject";
import {SearchObject} from "../model/search/SearchObject";
import {ICrudService} from "./ICrudService";
import {ISearchService} from "./ISearchService";

export interface ICommonService<E extends AbstractIdentifiableObject, S extends SearchObject> extends ICrudService<E>, ISearchService<E, S>{
}
