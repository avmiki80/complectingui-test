import {Component, OnInit} from '@angular/core';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_COLUMN,
  DEFAULT_SORT_DIRECTION,
  LANG_RU
} from "../../../../app.constant";
import {AuthService, User} from "../../../../auth/service/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {RotorService} from "../../../data/service/impl/rotor.service";
import {ExceptionHandler} from "../../../../util/util";
import {SearchRotor} from "../../../data/model/search/SearchRotor";
import {Rotor} from "../../../data/model/entity/Rotor";
import {PageEvent} from "@angular/material/paginator";
import {UtilService} from "../../../data/service/impl/util.service";
import {SearchBlade} from "../../../data/model/search/SearchBlade";
import {BladeService} from "../../../data/service/impl/blade.service";
import {Blade} from "../../../data/model/entity/Blade";
import {Stage} from "../../../data/model/entity/Stage";
import {DoComplect} from "../../../data/object/DoComplect";
import {ComplectService} from "../../../data/service/impl/complect.service";
import {Complect} from "../../../data/model/entity/Complect";
import {SearchComplect} from "../../../data/model/search/SearchComplect";
import {RankingData} from "../../../data/object/RankingData";
import * as FileSaver from 'file-saver';
import {FormControl} from "@angular/forms";
import {MessageDialogComponent} from "../../dialog/message-dialog/message-dialog.component";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  readonly defaultPageSize = DEFAULT_PAGE_SIZE;
  readonly defaultPageNumber = DEFAULT_PAGE_NUMBER;
  readonly defaultSortColumn = DEFAULT_SORT_COLUMN;
  readonly defaultSortDirection = DEFAULT_SORT_DIRECTION;

  user: User;
  lang: string;

  totalFoundedRotor: number;
  rotorList: Rotor[];
  selectedRotor: Rotor;
  searchRotor: SearchRotor;

  totalFoundedBlade: number;
  bladeList: Blade[];
  selectedBlade: Blade;
  searchBlade: SearchBlade;
  selectedStage: Stage;

  totalFoundedComplect: number;
  complectList: Complect[];
  selectedComplect: Complect;
  searchComplect: SearchComplect;

  totalFoundedComplectBlade: number;
  complecBladeList: Blade[];
  searchComplectBlade: SearchBlade;
  selectedComplectBlade: Blade;

// переменная селектор выбранного таба
  selectedTab = new FormControl(0);
// флаг отключает активность кнопки комплектовки если список лопаток пуст.
  enableDoComplect: boolean;

  shifrForComplect: string = '';

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private rotorService: RotorService,
    private bladeService: BladeService,
    private complectService: ComplectService,
    private exceptionHandler: ExceptionHandler,
    private utilService: UtilService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.enableDoComplect = false;
    this.lang = LANG_RU;
    this.translateService.use(this.lang);
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });

    this.initSearchRotor(null, null);
    this.onSearchRotor();
    this.initSearchBlade(null, null, null, null, 0);
    this.initSearchComplectBlade(null, null, null, null, 0);
    this.initSearchComplect(null, null, null);
    this.onSearchComplect();
  }

  onChangLanguage(lang: string): void {
    this.translateService.use(lang).subscribe(l => this.lang = l);
  }

  // Методы по роторам
  initSearchRotor(name: string, shifr: string): void {
    if (!name) { name = ''; }
    if (!shifr) { shifr = ''; }
    this.searchRotor = new SearchRotor(name, shifr);
  }
  onSearchRotor(searchRotor?: SearchRotor): void {
    if (!this.searchRotor) { // если поисковый объект не проиницилизирован, то
      this.initSearchRotor(null, null); // создаем новый объект с параметрами по умолчанию
    }
    if (searchRotor) { // если переданы параметры для поиска объектов, то
      this.searchRotor = searchRotor; // применяем переданные параметры к поиску
    }
    this.rotorService.searchPage(this.searchRotor).subscribe(resultRotors => { //вызываем метод постраничного поиска роторов по параметрам
      this.rotorList = resultRotors.content; // полученные объекты заносим в список
      this.totalFoundedRotor = resultRotors.totalElements; // получаем общее количество найденых объектов

      let detectedRotor = this.rotorList[0]; // создаем переменную обнаруженный объект и заносим туда первый по списку (для выбора по умолчанию)
      if (this.selectedRotor) { // если ранее уже было выбрано что-то, то
        const detectedRotorTemp = this.rotorList.find(rotor => rotor.id === this.selectedRotor.id); // ищем это среди полученных после поиска
        if (detectedRotorTemp) { // если это обнаружили, то
          this.selectedRotor = detectedRotor = detectedRotorTemp; // делаем это выбранным по умолчанию
        }
      }
      this.onSelectRotor(detectedRotor); // вызываем метод выбора
    }, error => {
      // Todo организовать обработку ошибок
      this.exceptionHandler.handle(error, '');
    });
  }
  onSelectRotor(rotor: Rotor): void {
    if (rotor) { // если передали какой ротор выбирать, то
      this.selectedRotor = rotor; // выбранным ротором делаем его
      // Todo что-то сделать при выборе ротора (получить лопатки не в комплекте или что-то еще)
    }
  }
  pagingRotor(pageEvent: PageEvent): void {
    if (this.searchRotor.pageSize !== pageEvent.pageSize) {
      this.searchRotor.pageNumber = 0;
    } else {
      this.searchRotor.pageNumber = pageEvent.pageIndex;
    }
    this.searchRotor.pageSize = pageEvent.pageSize;
    this.selectedRotor = null;
    this.onSearchRotor();
  }

  // Методы по лопаткам
  initSearchBlade(name: string, indNumber: string, shifr: string, complectName: string, isComplect?: number): void {
    if (!name) { name = ''; }
    if (!indNumber) { indNumber = ''; }
    if (!shifr) { shifr = ''; }
    if (!complectName) { complectName = ''; }
    if (isComplect) {
      this.searchBlade = new SearchBlade(name, indNumber, shifr, complectName, isComplect);
    } else {
      this.searchBlade = new SearchBlade(name, indNumber, shifr, complectName);
    }
  }
  onSearchBlade(searchBlade?: SearchBlade) {
    if (!this.searchBlade) { // если поисковый объект не проиницилизирован, то
      this.initSearchBlade(null, null, null, null, 0); // создаем новый объект с параметрами по умолчанию
    }
    if (searchBlade) { // если переданы параметры для поиска объектов, то
      this.searchBlade = searchBlade; // применяем переданные параметры к поиску
    }
    if (this.searchBlade.shifr.trim().length !== 0) { // если шифр лопатки для поиска указан, то
      this.bladeService.searchPage(this.searchBlade).subscribe(resultBlades => { // вызываем метод постраничного поиска по параметрам
        this.bladeList = resultBlades.content; // полученные объекты заносим в список
        this.totalFoundedBlade = resultBlades.totalElements; // получаем общее количество найденых объектов
        // проверяем полученный список лопаток на пустоту, для активации конпки комплеутовки
        this.enableDoComplect = !(!this.totalFoundedBlade || this.totalFoundedBlade === 0);
        let detectedBlade = this.bladeList[0]; // создаем переменную обнаруженный объект и заносим туда первый по списку (для выбора по умолчанию)
        if (this.selectedBlade) { // если ранее уже было выбрано что-то, то
          const detectedBladeTemp = this.bladeList.find(blade => blade.id === this.selectedBlade.id); // ищем это среди полученных после поиска
          if (detectedBladeTemp) { // если это обнаружили, то
            this.selectedBlade = detectedBlade = detectedBladeTemp; // делаем это выбранным по умолчанию
          }
        }
        this.onSelectBlade(detectedBlade); // вызываем метод выбора
      }, error => {
        // Todo организовать обработку ошибок
        this.exceptionHandler.handle(error, '');
      });
    }
  }
  onSelectBlade(balde: Blade): void{
    if (balde) {
      this.selectedBlade = balde;
      // Todo что-то сделать при выборе ротора (получить лопатки не в комплекте или что-то еще)
    }
  }
  onUpdateBlade(blade: Blade) {
    if (blade) {
      //Todo тут присваивать или уже в сабскрайбе ?
      this.selectedBlade = blade;
      this.bladeService.update(blade).subscribe(() => {
        if (!blade.indNumber.toUpperCase().includes(this.searchBlade.indNumber.toUpperCase())) {
          this.initSearchBlade(null, null, null, null, 0);
        }
        this.onSearchBlade();
      }, error => {
        this.exceptionHandler.handle(error, blade.indNumber)
        // если операция не выпонилась, обновить введенные данные на данные до обновлнения
        this.onSearchBlade();
      });
    }
  }
  onDeleteBlade(blade: Blade): void {
    if (blade) {
      this.bladeService.delete(blade.id).subscribe(result => {
        this.selectedBlade = null;
        if (this.bladeList.length === 1) {
          if (this.searchBlade.pageNumber > 0) {
            this.searchBlade.pageNumber--;
          } else {
            this.initSearchBlade(null, null, null, null, 0);
          }
        }
        this.onSearchBlade();
      }, error => {
        this.exceptionHandler.handle(error, blade.indNumber + '-' + blade.bladeDse.shifr.name);
        // если операция не выпонилась, обновить введенные данные на данные до обновлнения
        this.onSearchBlade();
      });
    }
  }
  pagingBlade(pageEvent: PageEvent): void {
    if (this.searchBlade.pageSize !== pageEvent.pageSize) {
      this.searchBlade.pageNumber = 0;
    } else {
      this.searchBlade.pageNumber = pageEvent.pageIndex;
    }
    this.searchBlade.pageSize = pageEvent.pageSize;
    this.selectedBlade = null;
    this.onSearchBlade();
  }

  // Методы по комплекту
  initSearchComplect(name: string, shifr: string, stageName: string): void {
    if (!name) { name = ''; }
    if (!shifr) { shifr = ''; }
    if (!stageName) { stageName = ''; }
    this.searchComplect = new SearchComplect(name, shifr, stageName);
  }
  initSearchComplectBlade(name: string, indNumber: string, shifr: string, complectName: string, isComplect?: number): void {
    if (!name) { name = ''; }
    if (!indNumber) { indNumber = ''; }
    if (!shifr) { shifr = ''; }
    if (!complectName) { complectName = ''; }
    if (isComplect) {
      this.searchComplectBlade = new SearchBlade(name, indNumber, shifr, complectName, isComplect);
    } else {
      this.searchComplectBlade = new SearchBlade(name, indNumber, shifr, complectName);
    }
  }
  onSearchComplect(searchComplect?: SearchComplect): void {
    if (!this.searchComplect) { // если поисковый объект не проиницилизирован, то
      this.initSearchComplect(null, null, null); // создаем новый объект с параметрами по умолчанию
    }
    if (searchComplect) { // если переданы параметры для поиска объектов, то
      this.searchComplect = searchComplect; // применяем переданные параметры к поиску
    }
    this.complectService.searchPage(this.searchComplect).subscribe(resultComplects => { //вызываем метод постраничного поиска по параметрам
      this.complectList = resultComplects.content; // полученные объекты заносим в список
      this.totalFoundedComplect = resultComplects.totalElements; // получаем общее количество найденых объектов

      let detectedComplect = this.complectList[0]; // создаем переменную обнаруженный объект и заносим туда первый по списку (для выбора по умолчанию)
      if (this.selectedComplect) { // если ранее уже было выбрано что-то, то
        const detectedComplectTemp = this.complectList.find(complect => complect.id === this.selectedComplect.id); // ищем это среди полученных после поиска
        if (detectedComplectTemp) { // если это обнаружили, то
          this.selectedComplect = detectedComplect = detectedComplectTemp; // делаем это выбранным по умолчанию
        }
      }
      this.onSelectComplect(detectedComplect); // вызываем метод выбора
    }, error => {
      // Todo организовать обработку ошибок
      this.exceptionHandler.handle(error, '');
    });
  }
  onSelectComplect(complect: Complect): void{
    if (complect) {
      this.selectedComplect = complect;
      this.complectService.get(complect.id).subscribe(resultComplect => {
        this.complecBladeList = resultComplect.blades;
        this.totalFoundedComplectBlade = resultComplect.blades.length;
      });
    }
  }
  onUncomplect(complect: Complect): void {
    if (complect) {
      this.complectService.delete(complect.id).subscribe(result => {
        this.selectedComplect = null;
        if (this.complectList.length === 1) {
          if (this.searchComplect.pageNumber > 0) {
            this.searchComplect.pageNumber--;
          } else {
            this.initSearchComplect(null, null, null);
          }
        }
        this.onSearchComplect();
        this.onSearchBlade();
      }, error => {
        this.exceptionHandler.handle(error, complect.name + '-' + complect.stage.bladeDse.shifr.name);
        // если операция не выпонилась, обновить введенные данные на данные до обновлнения
        this.onSearchComplect();
      });
    }

  }
  pagingComplect(pageEvent: PageEvent): void {
    if (this.searchComplect.pageSize !== pageEvent.pageSize) {
      this.searchComplect.pageNumber = 0;
    } else {
      this.searchComplect.pageNumber = pageEvent.pageIndex;
    }
    this.searchComplect.pageSize = pageEvent.pageSize;
    this.selectedComplect = null;
    this.onSearchComplect();
  }

// Остальные методы
  onSelectStage(stage: Stage) {
    if (stage) {
      this.selectedStage = stage;
      this.searchBlade.shifr = stage.bladeDse.shifr.name;
      this.searchBlade.pageNumber = 0;
      this.onSearchBlade();
      this.shifrForComplect = stage.bladeDse.shifr.name;
    }
  }
  onDoRanking(data: RankingData): void {
    if (data) {
      this.utilService.doRanking(data).subscribe( response => {
          const fileName = response.headers.get('content-disposition').match(/.*filename=\"?([^;\"]+)\"?.*/);
          const data = response.body;
          this.downloadFile(data, fileName[1]);
        },
        error => {}
      );
    }
  }
  downloadFile(data: Blob, fileName: string): void {
    const blob = new Blob([data]);
    FileSaver.saveAs(blob, fileName);
  }

  onImportFile(importFile: File) {
    if (importFile) {
      this.utilService.doUploadFile(importFile).subscribe(
        response => {
          const fileName = response.headers.get('content-disposition').match(/.*filename=\"?([^;\"]+)\"?.*/);
          const data = response.body;
          this.downloadFile(data, fileName[1]);
        },
          error => this.exceptionHandler.handle(error, 'ОШИБИЩЕ')
      );
    }
  }
  onDoComplect(complectName: string){
    if (this.selectedStage){
      this.utilService.doComplect(new DoComplect(complectName, this.selectedStage.id)).subscribe(result => {
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          autoFocus: false,
          restoreFocus: false,
          maxWidth: '800px',
          data: {
            dialogTitle: this.translateService.instant('COMMON.INFORMATION'),
            message: this.translateService.instant('COMPLECT.COMPLECT-FORMED', {name: complectName})
          }
        });
        this.onSearchComplect(this.searchComplect);
        this.onSearchBlade(this.searchBlade);
      }, error => {
        console.log(error);
        this.exceptionHandler.handle(error, complectName);
      });
    }
  }

  onUpdateComplectBlade(blade: Blade){
    this.bladeService.update(blade).subscribe(() => {
      this.onSelectComplect(this.selectedComplect);
    }, error => {
      this.exceptionHandler.handle(error, blade.indNumber)
    });
  }
}
