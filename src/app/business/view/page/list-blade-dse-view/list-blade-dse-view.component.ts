import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SearchObject} from "../../../data/model/search/SearchObject";
import {User} from "../../../../auth/service/auth.service";
import {PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {BladeDse} from "../../../data/model/entity/BladeDse";
import {SearchBladeDse} from "../../../data/model/search/SearchBladeDse";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {Shifr} from "../../../data/model/entity/Shifr";
import {StaticMethods} from "../../../../util/util";
import {DEFAULT_SORT_DIRECTION, NAME, SHIFR} from "../../../../app.constant";
import {ConfirmDialogComponent} from "../../dialog/confirm-dialog/confirm-dialog.component";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {EditBladeDseDialogComponent} from "../../dialog/edit-blade-dse-dialog/edit-blade-dse-dialog.component";

@Component({
  selector: 'app-list-blade-dse-view',
  templateUrl: './list-blade-dse-view.component.html',
  styleUrls: ['./list-blade-dse-view.component.css']
})
export class ListBladeDseViewComponent implements OnInit {
  readonly name = NAME;
  readonly shifr = SHIFR;
  searchName: string;
  searchShifr: string;
  sortDirectionName: string = null;
  sortDirectionShifr: string = null;
  displayedColumns: string[] = ['name', 'shifr', 'operation'];
  dataSource: MatTableDataSource<BladeDse>;
  searchValues: SearchBladeDse;
  @Input('searchValues')
  set setSearchvalues(searchValues: SearchBladeDse){
    this.searchValues = searchValues;
  }
  @Input()
  totalFounded: number;
  @Input()
  selectedItem: BladeDse;

  itemList: BladeDse[];
  @Input('bladeDseList')
  set setItemList(bladeDseList: BladeDse[]) {
    this.itemList = bladeDseList;
    this.fillTable();
  }

  @Input()
  user: User;
  @Output('selectBladeDse')
  selectItem = new EventEmitter<BladeDse>();
  @Output('deleteBladeDse')
  deleteItem = new EventEmitter<BladeDse>();
  @Output('addBladeDse')
  addItem = new EventEmitter<BladeDse>();
  @Output('editBladeDse')
  editItem = new EventEmitter<BladeDse>();
  @Output('searchBladeDse')
  searchItem = new EventEmitter<SearchBladeDse>();
  @Output()
  pagingEvent = new EventEmitter<PageEvent>();
  // @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<BladeDse>();
    this.fillTable();
  }
  fillTable(): void {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.itemList;
    // @ts-ignore
    // this.dataSource.sortingDataAccessor = (bladeDse) => {
    //   return bladeDse.name;
    // };
  }
  onFilter(field: string): void {
    this.searchValues.name = this.searchName;
    this.searchValues.shifr = this.searchShifr;
    if(field != null) this.searchValues.sortColumn = field;
    switch (field) {
      case NAME: {
        this.searchValues.sortDirection = this.sortDirectionName = StaticMethods.selectSortDirection(this.sortDirectionName);
        this.sortDirectionShifr = null;
        break;
      }
      case SHIFR: {
        this.searchValues.sortDirection = this.sortDirectionShifr = StaticMethods.selectSortDirection(this.sortDirectionShifr);
        this.sortDirectionName = null;
        break;
      }
      default: {
        this.searchValues.sortDirection = DEFAULT_SORT_DIRECTION;
        this.sortDirectionName = null;
        this.sortDirectionShifr = null;
        break;
      }
    }
    this.searchItem.emit(this.searchValues);
  }

  onClickSelectItem(item: BladeDse): void {
    if(item && item !== this.selectedItem) {
      this.selectedItem = item;
      this.selectItem.emit(this.selectedItem);
    }
  }

  onClickDeleteItem(item: BladeDse): void {
    if (item) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: '400px',
        data: {
          dialogTitle: this.translateService.instant('COMMON.CONFIRM'),
          message: this.translateService.instant('BLADE-DSE.CONFIRM-DELETE', {name: item.name + '-'+ item.shifr.name})
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
    const item = new BladeDse('', null);
    const dialogRef = this.dialog.open(EditBladeDseDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      maxWidth: '800px',
      data: [item,
        this.translateService.instant('BLADE-DSE.ADD'),
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
  onClickEditItem(item : BladeDse): void{
    if (item){
      this.selectedItem = item;
      const dialogRef = this.dialog.open(EditBladeDseDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: '800px',
        data: [this.selectedItem,
          this.translateService.instant('BLADE-DSE.EDIT'),
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
