import {Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ShifrService} from "../../../data/service/impl/shifr.service";
import {AuthService, User} from "../../../../auth/service/auth.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Shifr} from "../../../data/model/entity/Shifr";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {SearchObject} from "../../../data/model/search/SearchObject";
import {PageEvent} from "@angular/material/paginator";
import {ExceptionHandler} from "../../../../util/util";

@Component({
  selector: 'app-select-shifr-dialog',
  templateUrl: './select-shifr-dialog.component.html',
  styleUrls: ['./select-shifr-dialog.component.css']
})
export class SelectShifrDialogComponent implements OnInit {
  user: User;
  dialogTitle: string;
  shifrList: Shifr[];
  selectedShifr: Shifr;

  // readonly defaultPageSize = DEFAULT_PAGE_SIZE;
  // readonly defaultPageNumber = DEFAULT_PAGE_NUMBER;
  totalFounded: number;
  search: SearchObject;

  constructor(
    private translateService: TranslateService,
    private shifrService: ShifrService,
    private authService: AuthService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<SelectShifrDialogComponent>,
    private exceptionHandler: ExceptionHandler,
    @Inject(MAT_DIALOG_DATA) private data: [string]
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUser.getValue();
    this.dialogTitle = this.data[0];
    this.initSearch();
  }
  initSearch(){
    this.search = new SearchObject('');
    this.onSearchShifr(this.search);
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
  onAddShifr(shifr: Shifr): void{
    this.shifrService.add(shifr).subscribe(result => {
      this.selectedShifr = result;
      this.onSearchShifr(this.search);
    }, error => {
      this.exceptionHandler.handle(error, shifr.name)
      // если операция не выпонилась, обновить введенные данные на данные до обновлнения
      this.onSearchShifr(this.search);
    });
  }
  onEditShifr(shifr: Shifr): void{
    this.shifrService.update(shifr).subscribe(result => {
      this.selectedShifr = shifr;
    }, error => {
      this.exceptionHandler.handle(error, shifr.name)
      // если операция не выпонилась, обновить введенные данные на данные до обновлнения
      this.onSearchShifr(this.search);
    })
  }
  onDeleteShifr(shifr: Shifr): void{
    this.shifrService.delete(shifr.id).subscribe(result => {
      this.selectedShifr = null;
      this.search.pageNumber = 0;
      this.onSearchShifr(this.search);
    }, error => {
      this.exceptionHandler.handle(error, shifr.name)
      // если операция не выпонилась, обновить введенные данные на данные до обновлнения
      this.onSearchShifr(this.search);
    });
  }

  onSelectShifr(shifr: Shifr): void{
    this.selectedShifr = shifr;
    this.dialogRef.close(new DialogResult(DialogAction.SELECT, this.selectedShifr));
  }

  onSearchShifr(search: SearchObject): void{
    this.search = search;
    this.search.pageNumber = 0;
    this.shifrService.searchPage(this.search).subscribe(result => {
      this.shifrList = result.content;
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
    this.shifrService.searchPage(this.search).subscribe(result => {
      this.shifrList = result.content;
      this.totalFounded = result.totalElements;
    }, error => {
      this.exceptionHandler.handle(error, '');
    })
  }
}
