import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AbstractCommonService} from "../abstract-common.service";
import {Blade} from "../../model/entity/Blade";
import {SearchBlade} from "../../model/search/SearchBlade";

export const BLADE_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class BladeService extends AbstractCommonService<Blade, SearchBlade>{

  constructor(
    protected httpClient: HttpClient,
    @Inject(BLADE_URL_TOKEN) protected baseUrl: InjectionToken<string>
  ) {
    super(baseUrl, httpClient);
  }
}
