import {Component, Inject, OnInit} from '@angular/core';
import {AuthService, User} from "../../../../auth/service/auth.service";
import {Shifr} from "../../../data/model/entity/Shifr";
import {SearchObject} from "../../../data/model/search/SearchObject";
import {TranslateService} from "@ngx-translate/core";
import {ShifrService} from "../../../data/service/impl/shifr.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ExceptionHandler} from "../../../../util/util";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {PageEvent} from "@angular/material/paginator";
import {BladeDse} from "../../../data/model/entity/BladeDse";
import {SearchBladeDse} from "../../../data/model/search/SearchBladeDse";
import {BladeDseService} from "../../../data/service/impl/blade-dse.service";

@Component({
  selector: 'app-select-blade-dse-dialog',
  templateUrl: './select-blade-dse-dialog.component.html',
  styleUrls: ['./select-blade-dse-dialog.component.css']
})
export class SelectBladeDseDialogComponent implements OnInit {
  user: User;
  dialogTitle: string;
  bladeDseList: BladeDse[];
  selectedBladeDse: BladeDse;

  // readonly defaultPageSize = DEFAULT_PAGE_SIZE;
  // readonly defaultPageNumber = DEFAULT_PAGE_NUMBER;
  totalFounded: number;
  search: SearchBladeDse;

  constructor(
    private translateService: TranslateService,
    private bladeDseService: BladeDseService,
    private authService: AuthService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SelectBladeDseDialogComponent>,
    private exceptionHandler: ExceptionHandler,
    @Inject(MAT_DIALOG_DATA) private data: [string]
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUser.getValue();
    this.dialogTitle = this.data[0];
    this.initSearch();
  }
  initSearch(){
    this.search = new SearchBladeDse('', '');
    this.onSearchBladeDse(this.search);
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
  onAddBladeDse(bladeDse: BladeDse): void{
    this.bladeDseService.add(bladeDse).subscribe(result => {
      this.selectedBladeDse = result;
      this.onSearchBladeDse(this.search);
    }, error => {
      this.exceptionHandler.handle(error, bladeDse.name)
      // если операция не выпонилась, обновить введенные данные на данные до обновлнения
      this.onSearchBladeDse(this.search);
    });
  }
  onEditBladeDse(bladeDse: BladeDse): void{
    this.bladeDseService.update(bladeDse).subscribe(result => {
      this.selectedBladeDse = bladeDse;
    }, error => {
      this.exceptionHandler.handle(error, bladeDse.name)
      // если операция не выпонилась, обновить введенные данные на данные до обновлнения
      this.onSearchBladeDse(this.search);
    })
  }
  onDeleteBladeDse(bladeDse: BladeDse): void{
    this.bladeDseService.delete(bladeDse.id).subscribe(result => {
      this.selectedBladeDse = null;
      this.search.pageNumber = 0;
      this.onSearchBladeDse(this.search);
    }, error => {
      this.exceptionHandler.handle(error, bladeDse.name)
      // если операция не выпонилась, обновить введенные данные на данные до обновлнения
      this.onSearchBladeDse(this.search);
    });
  }

  onSelectBladeDse(bladeDse: BladeDse): void{
    this.selectedBladeDse = bladeDse;
    this.dialogRef.close(new DialogResult(DialogAction.SELECT, this.selectedBladeDse));
  }

  onSearchBladeDse(search: SearchBladeDse): void{
    this.search = search;
    this.search.pageNumber = 0;
    this.bladeDseService.searchPage(this.search).subscribe(result => {
      this.bladeDseList = result.content;
      this.totalFounded = result.totalElements;
    }, error => {
      this.exceptionHandler.handle(error, '');
    });
  }

  paging(pageEvent: PageEvent): void{
    if (this.search.pageSize !== pageEvent.pageSize){
      this.search.pageNumber = 0;
    } else {
      this.search.pageNumber = pageEvent.pageIndex;
    }
    this.search.pageSize = pageEvent.pageSize;
    this.bladeDseService.searchPage(this.search).subscribe(result => {
      this.bladeDseList = result.content;
      this.totalFounded = result.totalElements;
    }, error => {
      this.exceptionHandler.handle(error, '');
    })
  }
}
