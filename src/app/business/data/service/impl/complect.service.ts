import {Inject, Injectable, InjectionToken} from '@angular/core';
import {AbstractCommonService} from "../abstract-common.service";
import {Complect} from "../../model/entity/Complect";
import {SearchComplect} from "../../model/search/SearchComplect";
import {HttpClient} from "@angular/common/http";

export const COMPLECT_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class ComplectService extends AbstractCommonService<Complect, SearchComplect>{
  constructor(
    @Inject(COMPLECT_URL_TOKEN)  protected baseUrl: InjectionToken<string>,
    protected httpClient: HttpClient
  ) {
    super(baseUrl, httpClient);
  }
}
