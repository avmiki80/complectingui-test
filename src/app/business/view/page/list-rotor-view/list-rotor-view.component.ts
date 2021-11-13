import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DEFAULT_SORT_DIRECTION, DELAY_TIME, NAME, SHIFR} from "../../../../app.constant";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../../auth/service/auth.service";
import {PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {StaticMethods} from "../../../../util/util";
import {ConfirmDialogComponent} from "../../dialog/confirm-dialog/confirm-dialog.component";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {Rotor} from "../../../data/model/entity/Rotor";
import {SearchRotor} from "../../../data/model/search/SearchRotor";
import {EditRotorDialogComponent} from "../../dialog/edit-rotor-dialog/edit-rotor-dialog.component";
import {Stage} from "../../../data/model/entity/Stage";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-list-rotor-view',
  templateUrl: './list-rotor-view.component.html',
  styleUrls: ['./list-rotor-view.component.css']
})
export class ListRotorViewComponent implements OnInit {
  readonly name = NAME;
  readonly shifr = SHIFR;
  private searchSubject: Subject<any> = new Subject();
  private debTime: number = DELAY_TIME;
  searchName: string;
  searchShifr: string;
  sortDirectionName: string = null;
  sortDirectionShifr: string = null;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Rotor>;
  selectedStage: Stage;



//Todo ниже под сомнением до след коментария
  @Input()
  user: User;


  @Output('selectRotor')
  selectItem = new EventEmitter<Rotor>();
  @Output('deleteRotor')
  deleteItem = new EventEmitter<Rotor>();
  @Output('addRotor')
  addItem = new EventEmitter<Rotor>();
  @Output('editRotor')
  editItem = new EventEmitter<Rotor>();
//Todo сомнения кончились



  onlyView: boolean;
  @Input('onlyView')
  set setOnlyView(mode: boolean) {
    this.onlyView = mode;
    if (this.onlyView) {
      this.displayedColumns = ['name', 'shifr', 'menu'];
    }
    else {
      this.displayedColumns = ['name', 'shifr', 'operation'];
    }
  }
  @Input()
  selectedItem: Rotor;
  searchRotor: SearchRotor;
  @Input('searchRotor')
  set setSearchRotor(searchRotor: SearchRotor){
    this.searchRotor = searchRotor;
  }
  itemList: Rotor[];
  @Input('rotorList')
  set setItemList(rotorList: Rotor[]) {
    this.itemList = rotorList;
    this.fillTable();
  }
  @Input()
  totalFounded: number;

  @Output('searchRotor')
  searchItem = new EventEmitter<SearchRotor>();
  @Output()
  selectStage = new EventEmitter<Stage>();
  @Output()
  pagingEvent = new EventEmitter<PageEvent>();


  // @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {
    this.searchSubject.pipe(debounceTime(this.debTime)).subscribe(field => {
      this.searchRotor.name = this.searchName;
      this.searchRotor.shifr = this.searchShifr;
      this.searchRotor.pageNumber = 0;
      if (field) this.searchRotor.sortColumn = field;
      switch (field) {
        case this.name: {
          this.searchRotor.sortDirection = this.sortDirectionName = StaticMethods.selectSortDirection(this.sortDirectionName);
          this.sortDirectionShifr = null;
          break;
        }
        case this.shifr: {
          this.searchRotor.sortDirection = this.sortDirectionShifr = StaticMethods.selectSortDirection(this.sortDirectionShifr);
          this.sortDirectionName = null;
          break;
        }
        default: {
          this.searchRotor.sortDirection = DEFAULT_SORT_DIRECTION;
          this.sortDirectionName = null;
          this.sortDirectionShifr = null;
          break;
        }
      }
      this.searchItem.emit(this.searchRotor);
    });
  }

  ngOnInit(): void {
    if (this.onlyView) {
      this.displayedColumns = ['name', 'shifr', 'menu'];
    }
    else {
      this.displayedColumns = ['name', 'shifr', 'operation'];
    }
    this.dataSource = new MatTableDataSource<Rotor>();
    this.fillTable();
  }
  fillTable(): void {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.itemList;
  }
  onClickSelectItem(item: Rotor): void {
    if (item && item !== this.selectedItem) {
      this.selectedItem = item;
      // this.selectItem.emit(this.selectedItem);
    }
  }
  onClickSelectStage(stage: Stage) {
    if (stage && stage !== this.selectedStage) {
      if (this.selectedStage === undefined) {
        this.selectedStage = stage;
        this.selectStage.emit(this.selectedStage);
      }
      else {
        if (stage.id !== this.selectedStage.id) {
          this.selectedStage = stage;
          this.selectStage.emit(this.selectedStage);
        }
      }
    }
  }


  onClickDeleteItem(item: Rotor): void {
    if (item) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: '400px',
        data: {
          dialogTitle: this.translateService.instant('COMMON.CONFIRM-ACTION'),
          message: this.translateService.instant('ROTOR.CONFIRM-DELETE', {name: item.name + '-'+ item.shifr.name})
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
  onClickAddItem(): void {
    const item = new Rotor('', null);
    const dialogRef = this.dialog.open(EditRotorDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      maxWidth: '1400px',
      maxHeight: '90vh',
      data: [item,
        this.translateService.instant('ROTOR.ADD'),
        this.translateService.instant('COMMON.ADD')],
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result as DialogResult && result.obj && result.action === DialogAction.SAVE) {
        this.selectedItem = result.obj;
        this.selectedItem.username = this.user.username;
        this.selectedItem.date = new Date();
        this.addItem.emit(this.selectedItem);
      }
    });
  }
  onClickEditItem(item : Rotor): void{
    if (item){
      this.selectedItem = item;
      const dialogRef = this.dialog.open(EditRotorDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: '1400px',
        maxHeight: '90vh',
        data: [this.selectedItem,
          this.translateService.instant('ROTOR.EDIT'),
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




  onFilter(field: string): void {
    this.searchSubject.next(field);
  }
  pageChanged(pageEvent: PageEvent): void{
    this.pagingEvent.emit(pageEvent);
  }
}
