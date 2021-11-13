import {Inject, Injectable, InjectionToken} from '@angular/core';
import {AbstractCommonService} from "../abstract-common.service";
import {Rotor} from "../../model/entity/Rotor";
import {HttpClient} from "@angular/common/http";
import {SearchRotor} from "../../model/search/SearchRotor";

export const ROTOR_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class RotorService extends AbstractCommonService<Rotor, SearchRotor>{

  constructor(
    @Inject(ROTOR_URL_TOKEN)  protected baseUrl: InjectionToken<string>,
    protected httpClient: HttpClient) {
    super(baseUrl, httpClient);
  }
}
