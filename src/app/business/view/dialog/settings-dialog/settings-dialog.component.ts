import { Component, OnInit } from '@angular/core';
import {AuthService, User} from "../../../../auth/service/auth.service";
import {
  ADMIN_ROLE,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  LANG_EN,
  LANG_RU,
} from "../../../../app.constant";
import {MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {PageEvent} from "@angular/material/paginator";
import {BladeDseService} from "../../../data/service/impl/blade-dse.service";
import {BladeDse} from "../../../data/model/entity/BladeDse";
import {SearchBladeDse} from "../../../data/model/search/SearchBladeDse";
import {ExceptionHandler} from "../../../../util/util";
import {RotorService} from "../../../data/service/impl/rotor.service";
import {Rotor} from "../../../data/model/entity/Rotor";
import {SearchRotor} from "../../../data/model/search/SearchRotor";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {
  user: User;
  isAdmin: boolean;

  settingsChanged = false; // были ли изменены настройки
  lang: string; // хранит выбранный язык в настройках

  // просто ссылаются на готовые константы
  en = LANG_EN;
  ru = LANG_RU;

  // readonly defaultPageSize = DEFAULT_PAGE_SIZE;
  // readonly defaultPageNumber = DEFAULT_PAGE_NUMBER;

  totalFoundedBladeDse: number;
  bladeDseList: BladeDse[];
  selectedBladeDse: BladeDse;
  searchBladeDse: SearchBladeDse;

  totalFoundedRotor: number;
  rotorList: Rotor[];
  selectedRotor: Rotor;
  searchRotor: SearchRotor;

  // readonly defaultPageSize = DEFAULT_PAGE_SIZE;
  // readonly defaultPageNumber = DEFAULT_PAGE_NUMBER;


  constructor(
    private translateService: TranslateService,
    private bladeDseService: BladeDseService,
    private rotorService: RotorService,
    private exceptionHandler: ExceptionHandler,
    private dialogRef: MatDialogRef<SettingsDialogComponent>, // для возможности работы с текущим диалог. окном
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.lang = this.translateService.currentLang;
    this.user = this.authService.currentUser.getValue();
    if (this.user.roleSet.find(r =>  r.name === ADMIN_ROLE)){
      this.isAdmin = true;
      this.initSearch();
    }
  }
  initSearch(){
    this.searchBladeDse = new SearchBladeDse('', '');
    this.searchRotor = new SearchRotor('', '');
    this.onSearchBladeDse(this.searchBladeDse);
    this.onSearchRotor(this.searchRotor);
  }

  // переключение языка
  langChanged(): void {
    this.translateService.use(this.lang); // сразу устанавливаем язык для приложения
    this.settingsChanged = true; // указываем, что настройки были изменены
  }
  // нажали Закрыть
  close(): void {
    if (this.settingsChanged) { // если в настройках произошли изменения
      this.dialogRef.close(new DialogResult(DialogAction.SETTING_CHANGE, this.lang));
    } else {
      this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
    }
  }

// работа с типами лопаток

  onAddBladeDse(bladeDse: BladeDse): void{
    this.bladeDseService.add(bladeDse).subscribe(result => {
      this.selectedBladeDse = result;
      this.onSearchBladeDse(this.searchBladeDse);
    }, error => {
      this.exceptionHandler.handle(error, bladeDse.name + '-' + bladeDse.shifr.name)
      // если операция не выпонилась, обновить введенные данные на данные до обновлнения
      this.onSearchBladeDse(this.searchBladeDse);
    });
  }
  onEditBladeDse(bladeDse: BladeDse): void{
    this.bladeDseService.update(bladeDse).subscribe(result => {
      this.selectedBladeDse = bladeDse;
    }, error => {
      this.exceptionHandler.handle(error, bladeDse.name + '-' + bladeDse.shifr.name)
      // если операция не выпонилась, обновить введенные данные на данные до обновлнения
      this.onSearchBladeDse(this.searchBladeDse);
    })
  }
  onDeleteBladeDse(bladeDse: BladeDse): void{
    this.bladeDseService.delete(bladeDse.id).subscribe(result => {
      this.selectedBladeDse = null;
      this.searchBladeDse.pageNumber = 0;
      this.onSearchBladeDse(this.searchBladeDse);
    }, error => {
      this.exceptionHandler.handle(error, bladeDse.name + '-' + bladeDse.shifr.name)
      // если операция не выпонилась, обновить введенные данные на данные до обновлнения
      this.onSearchBladeDse(this.searchBladeDse);
    });
  }

  onSelectBladeDse(bladeDse: BladeDse): void{
    this.selectedBladeDse = bladeDse;
    this.dialogRef.close(new DialogResult(DialogAction.SELECT, this.selectedBladeDse));
  }

  onSearchBladeDse(search: SearchBladeDse): void{
    this.searchBladeDse = search;
    this.searchBladeDse.pageNumber = 0;
    this.bladeDseService.searchPage(this.searchBladeDse).subscribe(result => {
      this.bladeDseList = result.content;
      this.totalFoundedBladeDse = result.totalElements;
    }, error => {
      this.exceptionHandler.handle(error, '');
    });
  }

  pagingBladeDse(pageEvent: PageEvent): void{
    if (this.searchBladeDse.pageSize !== pageEvent.pageSize){
      this.searchBladeDse.pageNumber = 0;
    } else {
      this.searchBladeDse.pageNumber = pageEvent.pageIndex;
    }
    this.searchBladeDse.pageSize = pageEvent.pageSize;
    this.bladeDseService.searchPage(this.searchBladeDse).subscribe(result => {
      this.bladeDseList = result.content;
      this.totalFoundedBladeDse = result.totalElements;
    }, error => {
      this.exceptionHandler.handle(error, '');
    })
  }

// работа с роторами

  onAddRotor(rotor: Rotor): void{
    this.rotorService.add(rotor).subscribe(result => {
      this.selectedRotor = result;
      this.onSearchRotor(this.searchRotor);
    }, error => {
      this.exceptionHandler.handle(error, rotor.name + '-' + rotor.shifr.name)
      // если операция не выпонилась, обновить введенные данные на данные до обновлнения
      this.onSearchRotor(this.searchRotor);
    });
  }
  onEditRotor(rotor: Rotor): void{
    this.rotorService.update(rotor).subscribe(result => {
      this.selectedRotor = rotor;
    }, error => {
      this.exceptionHandler.handle(error, rotor.name + '-' + rotor.shifr.name)
      // если операция не выпонилась, обновить введенные данные на данные до обновлнения
      this.onSearchRotor(this.searchRotor);
    });
  }
  onDeleteRotor(rotor: Rotor): void{
    this.rotorService.delete(rotor.id).subscribe(result => {
      this.selectedRotor = null;
      this.searchRotor.pageNumber = 0;
      this.onSearchRotor(this.searchRotor);
    }, error => {
      this.exceptionHandler.handle(error, rotor.name + '-' + rotor.shifr.name)
      // если операция не выпонилась, обновить введенные данные на данные до обновлнения
      this.onSearchRotor(this.searchRotor);
    });
  }

  onSelectRotor(rotor: Rotor): void{
    this.selectedRotor = rotor;
    this.dialogRef.close(new DialogResult(DialogAction.SELECT, this.selectedRotor));
  }

  onSearchRotor(search: SearchRotor): void{
    this.searchRotor = search;
    this.searchRotor.pageNumber = 0;
    this.rotorService.searchPage(this.searchRotor).subscribe(result => {
      this.rotorList = result.content;
      this.totalFoundedRotor = result.totalElements;
    }, error => {
      this.exceptionHandler.handle(error, '');
    });
  }

  pagingRotor(pageEvent: PageEvent): void{
    if (this.searchRotor.pageSize !== pageEvent.pageSize){
      this.searchRotor.pageNumber = 0;
    } else {
      this.searchRotor.pageNumber = pageEvent.pageIndex;
    }
    this.searchRotor.pageSize = pageEvent.pageSize;
    this.rotorService.searchPage(this.searchRotor).subscribe(result => {
      this.rotorList = result.content;
      this.totalFoundedRotor = result.totalElements;
    }, error => {
      this.exceptionHandler.handle(error, '');
    })
  }

}
