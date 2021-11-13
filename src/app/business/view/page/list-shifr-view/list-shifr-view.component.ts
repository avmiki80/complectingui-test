import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Shifr} from "../../../data/model/entity/Shifr";
import {SearchObject} from "../../../data/model/search/SearchObject";
import {User} from "../../../../auth/service/auth.service";
import {PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {ConfirmDialogComponent} from "../../dialog/confirm-dialog/confirm-dialog.component";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {EditShifrDialogComponent} from "../../dialog/edit-shifr-dialog/edit-shifr-dialog.component";
import {StaticMethods} from "../../../../util/util";
import {DEFAULT_SORT_DIRECTION, NAME} from "../../../../app.constant";

@Component({
  selector: 'app-list-shifr-view',
  templateUrl: './list-shifr-view.component.html',
  styleUrls: ['./list-shifr-view.component.css']
})
export class ListShifrViewComponent implements OnInit {
  readonly name = NAME;
  searchName: string;
  sortDirectionShifr: string = null;
  displayedColumns: string[] = ['shifr', 'operation'];
  dataSource: MatTableDataSource<Shifr>;
  searchValues: SearchObject;
  @Input('searchValues')
  set setSearchvalues(searchValues: SearchObject){
    this.searchValues = searchValues;
  }
  @Input()
  totalFounded: number;
  @Input()
  selectedItem: Shifr;

  itemList: Shifr[];
  @Input('shifrList')
  set setItemList(shifrList: Shifr[]) {
    this.itemList = shifrList;
    this.fillTable();
  }

  @Input()
  user: User;
  @Output('selectShifr')
  selectItem = new EventEmitter<Shifr>();
  @Output('deleteShifr')
  deleteItem = new EventEmitter<Shifr>();
  @Output('addShifr')
  addItem = new EventEmitter<Shifr>();
  @Output('editShifr')
  editItem = new EventEmitter<Shifr>();
  @Output('searchShifr')
  searchItem = new EventEmitter<SearchObject>();
  @Output()
  pagingEvent = new EventEmitter<PageEvent>();
  // @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {

  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Shifr>();
    this.fillTable();
  }

  fillTable(): void {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.itemList;
    this.addTableObjects();
    // @ts-ignore
    this.dataSource.sortingDataAccessor = (shifr) => {
      return shifr.name;
    };
  }

  addTableObjects(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  onFilter(field: string): void {
    this.searchValues.name = this.searchName;
    if(field != null) this.searchValues.sortColumn = field;
    switch (field) {
      case NAME: {
        this.searchValues.sortDirection = this.sortDirectionShifr = StaticMethods.selectSortDirection(this.sortDirectionShifr);
        break;
      }
      default: {
        this.searchValues.sortDirection = DEFAULT_SORT_DIRECTION;
        this.sortDirectionShifr = null;
        break;
      }
    }
    this.searchItem.emit(this.searchValues);
  }

  onClickSelectItem(item: Shifr): void {
    if(item && item !== this.selectedItem) {
      this.selectedItem = item;
      this.selectItem.emit(this.selectedItem);
    }
  }

  onClickDeleteItem(item: Shifr): void {
    if (item) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: '400px',
        data: {
          dialogTitle: this.translateService.instant('COMMON.CONFIRM'),
          message: this.translateService.instant('SHIFR.CONFIRM-DELETE', {name: item.name})
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result as DialogResult && result && result.action === DialogAction.OK){
          this.selectedItem = null;
          this.deleteItem.emit(item);
        }
      });
    }
  }
  onClickAddItem(): void{
    const item = new Shifr('');
    const dialogRef = this.dialog.open(EditShifrDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      maxWidth: '800px',
      data: [item,
        this.translateService.instant('SHIFR.ADD'),
        this.translateService.instant('COMMON.ADD')],
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result as DialogResult && result.obj && result.action === DialogAction.SAVE){
        this.selectedItem = result.obj;
        this.selectedItem.username = this.user.username;
        this.selectedItem.date = new Date();
        this.addItem.emit(this.selectedItem);
      }
    });
  }
  onClickEditItem(item : Shifr): void{
    if (item){
      this.selectedItem = item;
      const dialogRef = this.dialog.open(EditShifrDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: '800px',
        data: [this.selectedItem,
          this.translateService.instant('SHIFR.EDIT'),
          this.translateService.instant('COMMON.EDIT')],
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.obj && result.action === DialogAction.SAVE){
          this.selectedItem = result.obj;
          this.selectedItem.username = this.user.username;
          this.selectedItem.date = new Date();
          this.editItem.emit(this.selectedItem);
        }
      });
    }
  }
  pageChanged(pageEvent: PageEvent): void{
    this.pagingEvent.emit(pageEvent);
  }

}
