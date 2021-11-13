import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../../auth/service/auth.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {ConfirmDialogComponent} from "../../dialog/confirm-dialog/confirm-dialog.component";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {EditStageDialogComponent} from "../../dialog/edit-stage-dialog/edit-stage-dialog.component";
import {Stage} from "../../../data/model/entity/Stage";
import {SearchStage} from "../../../data/model/search/SearchStage";

@Component({
  selector: 'app-list-stage-view',
  templateUrl: './list-stage-view.component.html',
  styleUrls: ['./list-stage-view.component.css']
})
export class ListStageViewComponent implements OnInit {
  // readonly name = NAME;
  // readonly shifr = SHIFR;
  searchName: string;
  searchShifr: string;
  // sortDirectionName: string = null;
  // sortDirectionShifr: string = null;
  displayedColumns: string[] = ['name', 'shifr', 'count', 'tuComplect', 'tuOpposite', 'tuNeighb', 'reverse', 'operation'];
  dataSource: MatTableDataSource<Stage>;
  searchValues: SearchStage;
  @Input('searchValues')
  set setSearchvalues(searchValues: SearchStage){
    this.searchValues = searchValues;
  }
  // @Input()
  // totalFounded: number;
  @Input()
  selectedItem: Stage;

  itemList: Stage[];
  @Input('stageList')
  set setItemList(rotorList: Stage[]) {
    this.itemList = rotorList;
    this.fillTable();
  }

  @Input()
  user: User;
  @Output('selectStage')
  selectItem = new EventEmitter<Stage>();
  @Output('deleteStage')
  deleteItem = new EventEmitter<Stage>();
  @Output('addStage')
  addItem = new EventEmitter<Stage>();
  @Output('editStage')
  editItem = new EventEmitter<Stage>();
  @Output('searchStage')
  searchItem = new EventEmitter<SearchStage>();
  // @Output()
  // pagingEvent = new EventEmitter<PageEvent>();
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Stage>();
    this.fillTable();
  }
  fillTable(): void {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.itemList;
    this.addTableObjects()
    // когда получаем новые данные..
    // чтобы можно было сортировать по столбцам "категория" и "приоритет", т.к. там не примитивные типы, а объекты
    // @ts-ignore - показывает ошибку для типа даты, но так работает, т.к. можно возвращать любой тип
    this.dataSource.sortingDataAccessor = (item, colName) => {

      // по каким полям выполнять сортировку для каждого столбца
      switch (colName) {
        case 'name': {
          // @ts-ignore
          return item.name ? item.name : null;
        }
        case 'shifr': {
          // @ts-ignore
          return item.bladeDse.shifr.name ? item.bladeDse.shifr.name : null;
        }
      }
    };
  }
  private addTableObjects(): void{
    setTimeout(() => this.dataSource.sort = this.sort);
    setTimeout(() => this.dataSource.paginator = this.paginator);

  }
  onFilter(field: string): void {
    this.searchValues.name = this.searchName;
    this.searchValues.shifr = this.searchShifr;
    // if(field != null) this.searchValues.sortColumn = field;
    // switch (field) {
    //   case NAME: {
    //     this.searchValues.sortDirection = this.sortDirectionName = StaticMethods.selectSortDirection(this.sortDirectionName);
    //     this.sortDirectionShifr = null;
    //     break;
    //   }
    //   case SHIFR: {
    //     this.searchValues.sortDirection = this.sortDirectionShifr = StaticMethods.selectSortDirection(this.sortDirectionShifr);
    //     this.sortDirectionName = null;
    //     break;
    //   }
    //   default: {
    //     this.searchValues.sortDirection = DEFAULT_SORT_DIRECTION;
    //     this.sortDirectionName = null;
    //     this.sortDirectionShifr = null;
    //     break;
    //   }
    // }
    this.searchItem.emit(this.searchValues);
  }

  onClickSelectItem(item: Stage): void {
    if(item && item !== this.selectedItem) {
      this.selectedItem = item;
      this.selectItem.emit(this.selectedItem);
    }
  }

  onClickDeleteItem(item: Stage): void {
    if (item) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: '400px',
        data: {
          dialogTitle: this.translateService.instant('COMMON.CONFIRM'),
          message: this.translateService.instant('STAGE.CONFIRM-DELETE', {name: item.name + '-' + item.bladeDse.shifr.name})
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
    const item = new Stage('', 0, 0, 0, 0, false, null);
    const dialogRef = this.dialog.open(EditStageDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      maxWidth: '800px',
      maxHeight: '90vh',
      data: [item,
        this.translateService.instant('STAGE.ADD'),
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
  onClickEditItem(item : Stage): void{
    if (item){
      this.selectedItem = item;
      const dialogRef = this.dialog.open(EditStageDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: '800px',
        maxHeight: '90vh',
        data: [this.selectedItem,
          this.translateService.instant('STAGE.EDIT'),
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
  onToggleReverse(item): void{
    this.selectedItem = item;
    this.selectedItem.reverse = !this.selectedItem.reverse;
    this.editItem.emit(this.selectedItem);
  }
}
