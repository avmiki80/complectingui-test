import {Inject, Injectable, InjectionToken} from '@angular/core';
import {AbstractCommonService} from "../abstract-common.service";
import {BladeDse} from "../../model/entity/BladeDse";
import {SearchBladeDse} from "../../model/search/SearchBladeDse";
import {HttpClient} from "@angular/common/http";

export const BLADE_DSE_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class BladeDseService extends AbstractCommonService<BladeDse, SearchBladeDse>{

  constructor(
    protected httpClient: HttpClient,
    @Inject(BLADE_DSE_URL_TOKEN) protected baseUrl: InjectionToken<string>
  ) {
    super(baseUrl, httpClient);
  }
}
