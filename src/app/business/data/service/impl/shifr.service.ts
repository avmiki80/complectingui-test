import {Inject, Injectable, InjectionToken} from '@angular/core';
import {AbstractCommonService} from "../abstract-common.service";
import {SearchObject} from "../../model/search/SearchObject";
import {Shifr} from "../../model/entity/Shifr";
import {HttpClient} from "@angular/common/http";

export const SHIFR_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class ShifrService extends AbstractCommonService<Shifr, SearchObject>{

  constructor(
    protected httpClient: HttpClient,
    @Inject(SHIFR_URL_TOKEN) protected baseUrl: InjectionToken<string>

  ) {
    super(baseUrl, httpClient);
  }
}
