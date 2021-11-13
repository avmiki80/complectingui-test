import {Inject, Injectable, InjectionToken} from '@angular/core';
import {AbstractBaseService} from "../abstract-base.service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Blade} from "../../model/entity/Blade";
import {Observable} from "rxjs";
import {DoComplect} from "../../object/DoComplect";
import {RankingData} from "../../object/RankingData";

export const UTIL_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class UtilService extends AbstractBaseService{

  constructor(
    @Inject(UTIL_URL_TOKEN) protected baseUrl: InjectionToken<string>,
    protected httpClient: HttpClient
  ) {
    super(baseUrl, httpClient);
  }

  // заглушка. До реализации не дошли руки.
  doUploadFile(fileToUpload: File): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(`${this.baseUrl}/upload/?name=${fileToUpload.name}`, fileToUpload, { observe: 'response', responseType:  'blob' as 'json'});
  }

  // заглушка. До реализации не дошли руки.
  doReport(object: any): Observable<HttpResponse<Blob>> {
    return this.httpClient.post<Blob>(`${this.baseUrl}/report`, {bienieName: object, calcBienieResult: object}, { observe: 'response', responseType: 'blob' as 'json'});
  }

  doComplect(data: DoComplect): Observable<Blade []>{
    return this.httpClient.post<Blade []>(`${this.baseUrl}/complect/docomplect`, data);
  }
  doRanking(data: RankingData): Observable<HttpResponse<Blob>>{
    return this.httpClient.post<Blob>(`${this.baseUrl}/complect/doranking`, data, { observe: 'response', responseType: 'blob' as 'json'});
  }
}
