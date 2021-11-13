import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  constructor(
    private translateService: TranslateService
  ) {
  }
  createSchema(): Observable<any[]>{
    const result = [];
    this.translateService.get('RANKING.4-RAY').subscribe(name => result.push({ranking: "4", name}));
    this.translateService.get('RANKING.4-RAY-FP').subscribe(name => result.push({ranking: "4fp", name}));
    this.translateService.get('RANKING.2-RAY').subscribe(name => result.push({ranking: "2", name}));
    this.translateService.get('RANKING.N-RAY').subscribe(name => result.push({ranking: "n", name}));
    return of(result);
  }
}
