import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DEFAULT_SORT_DIRECTION, DELAY_TIME, NAME} from "../../../../app.constant";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../../auth/service/auth.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {StaticMethods} from "../../../../util/util";
import {ConfirmDialogComponent} from "../../dialog/confirm-dialog/confirm-dialog.component";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {Blade} from "../../../data/model/entity/Blade";
import {SearchBlade} from "../../../data/model/search/SearchBlade";
import {SelectionModel} from "@angular/cdk/collections";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
import {EditBladeDialogComponent} from "../../dialog/edit-blade-dialog/edit-blade-dialog.component";

@Component({
  selector: 'app-list-blade-view',
  templateUrl: './list-blade-view.component.html',
  styleUrls: ['./list-blade-view.component.css']
})
export class ListBladeViewComponent implements OnInit {
  readonly indNumber = 'indNumber';
  readonly mr = 'mr';
  readonly mx = 'mx';
  readonly my = 'my';
  readonly mz = 'mz';
  private searchSubject: Subject<any> = new Subject();
  private debTime: number = DELAY_TIME;
  itemListSearch: Blade[] = null;
  searchIndNumber: string = '';
  sortDirectionIndNumber: string = null;
  sortDirectionMr: string = null;
  sortDirectionMx: string = null;
  sortDirectionMy: string = null;
  sortDirectionMz: string = null;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Blade>;

  @Input()
  user: User;
  @Input()
  selectedItem: Blade;
  viewType: boolean;
  @Input('viewType')
  set setViewType(mode: boolean) {
    this.viewType = mode;
    if (this.viewType) {
      this.displayedColumns = ['indNumber', 'shifr', 'mr', 'mx', 'my', 'mz', 'exclude', 'operation'];
    } else {
      this.displayedColumns = ['indNumber', 'shifr', 'mr', 'mx', 'my', 'mz', 'paz'];
    }
  }
  itemList: Blade[];
  @Input('bladeList')
  set setItemList(bladeList: Blade[]) {
    this.itemList = bladeList;
    this.fillTable();
  }
  @Input()
  totalFounded: number;
  searchBlade: SearchBlade;
  @Input('searchBlade')
  set setSearchBlade(searchBlade: SearchBlade) {
    this.searchBlade = searchBlade;
  }

  @Output('searchBlade')
  searchItem = new EventEmitter<SearchBlade>();
  @Output('selectBlade')
  selectItem = new EventEmitter<Blade>();
  @Output('editBlade')
  editItem = new EventEmitter<Blade>();
  @Output('deleteBlade')
  deleteItem = new EventEmitter<Blade>();
  @Output()
  pagingEvent = new EventEmitter<PageEvent>();







  selection = new SelectionModel<Blade>(true, []);



  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {
    this.searchSubject.pipe(debounceTime(this.debTime)).subscribe(field => {
      this.searchBlade.indNumber = this.searchIndNumber;
      this.searchBlade.pageNumber = 0;
      if (field) this.searchBlade.sortColumn = field;
      switch (field) {
        case this.indNumber: {
          this.searchBlade.sortDirection = this.sortDirectionIndNumber = StaticMethods.selectSortDirection(this.sortDirectionIndNumber);
          this.sortDirectionMr = null;
          this.sortDirectionMx = null;
          this.sortDirectionMy = null;
          this.sortDirectionMz = null;
          break;
        }
        case this.mr: {
          this.searchBlade.sortDirection = this.sortDirectionMr = StaticMethods.selectSortDirection(this.sortDirectionMr);
          this.sortDirectionIndNumber = null;
          this.sortDirectionMx = null;
          this.sortDirectionMy = null;
          this.sortDirectionMz = null;
          break;
        }
        case this.mx: {
          this.searchBlade.sortDirection = this.sortDirectionMx = StaticMethods.selectSortDirection(this.sortDirectionMx);
          this.sortDirectionMr = null;
          this.sortDirectionIndNumber = null;
          this.sortDirectionMy = null;
          this.sortDirectionMz = null;
          break;
        }
        case this.my: {
          this.searchBlade.sortDirection = this.sortDirectionMy = StaticMethods.selectSortDirection(this.sortDirectionMy);
          this.sortDirectionMr = null;
          this.sortDirectionMx = null;
          this.sortDirectionIndNumber = null;
          this.sortDirectionMz = null;
          break;
        }
        case this.mz: {
          this.searchBlade.sortDirection = this.sortDirectionMz = StaticMethods.selectSortDirection(this.sortDirectionMz);
          this.sortDirectionMr = null;
          this.sortDirectionMx = null;
          this.sortDirectionMy = null;
          this.sortDirectionIndNumber = null;
          break;
        }
        default: {
          this.searchBlade.sortDirection = DEFAULT_SORT_DIRECTION;
          this.sortDirectionIndNumber = null;
          this.sortDirectionMr = null;
          this.sortDirectionMx = null;
          this.sortDirectionMy = null;
          this.sortDirectionMz = null;
          break;
        }
      }
      this.searchItem.emit(this.searchBlade);
    });
  }

  ngOnInit(): void {
    if (this.viewType) {
      this.displayedColumns = ['indNumber', 'shifr', 'mr', 'mx', 'my', 'mz', 'exclude', 'operation'];
    } else {
      this.displayedColumns = ['indNumber', 'shifr', 'mr', 'mx', 'my', 'mz', 'paz'];
    }
    this.dataSource = new MatTableDataSource<Blade>();
  }
  fillTable(): void {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.itemList.filter(value => value.indNumber.toUpperCase().includes(this.searchIndNumber.toUpperCase()));
    if (!this.viewType) {
      this.addTableObjects();
      // @ts-ignore
      this.dataSource.sortingDataAccessor = (blade, colName) => {
        switch (colName) {
          case 'indNumber': {
            return blade.indNumber ? blade.indNumber : null;
          }
          case 'mr': {
            return blade.data.mr ? blade.data.mr : null;
          }
          case 'mx': {
            return blade.data.mx ? blade.data.mx : null;
          }

          case 'my': {
            return blade.data.my ? blade.data.my : null;
          }
          case 'mz': {
            return blade.data.mz ? blade.data.mz : null;
          }
        }
      };
    }
  }
  addTableObjects(): void {
    this.dataSource.sort = this.sort; // компонент для сортировки данных (если необходимо)
    this.dataSource.paginator = this.paginator; // обновить компонент постраничности (кол-во записей, страниц)
  }
  onClickSelectItem(item: Blade): void {
    if (item && item !== this.selectedItem) {
      this.selectedItem = item;
      this.selectItem.emit(this.selectedItem);
    }
  }
  onToggleExclude(blade: Blade) {
    // blade.excluded = !blade.excluded;
    this.selectedItem = blade;
    this.selectedItem.excluded = !this.selectedItem.excluded;
    this.selectedItem.username = this.user.username;
    this.selectedItem.date = new Date();
    this.editItem.emit(blade);
  }
  onClickEditItem(item : Blade): void{
    if (item) {
      this.selectedItem = item;
      const dialogRef = this.dialog.open(EditBladeDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: '800px',
        data: [this.selectedItem,
          this.translateService.instant('BLADE.EDIT'),
          this.translateService.instant('COMMON.SAVE')],
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result as DialogResult && result.obj && result.action === DialogAction.SAVE) {
          this.selectedItem = result.obj;
          this.selectedItem.username = this.user.username;
          this.selectedItem.date = new Date();
          this.editItem.emit(this.selectedItem);
        }
      });
    }
  }
  onClickDeleteItem(item: Blade): void {
    if (item) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: '400px',
        data: {
          dialogTitle: this.translateService.instant('COMMON.CONFIRM-ACTION'),
          message: this.translateService.instant('BLADE.CONFIRM-DELETE', {name: item.indNumber})
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result as DialogResult && result && result.action === DialogAction.OK) {
          this.selectedItem = null;
          this.deleteItem.emit(item);
        }
      });
    }
  }









  onChangeFixPaz(blade: Blade): void {
    blade.fixPaz = +blade.fixPaz; // преобразовать сторку в число
    if (isNaN(blade.fixPaz)) {
      blade.fixPaz = 0;
    }
    this.selectedItem = blade;
    this.editItem.emit(blade);
  }

  onSelectFixPaz(blade: Blade): void {
    if (blade.fixPaz !== 0) {
      blade.fixPaz = 0;
      this.selectedItem = blade;
      this.editItem.emit(blade);
    }
    this.selection.toggle(blade);
  }

  // isChange: boolean = false;
  // onSelectFixPaz(blade: Blade): void {
  //   if (blade.fixPaz !== 0) {
  //     blade.fixPaz = 0;
  //     this.selectedItem = blade;
  //     this.editItem.emit(blade);
  //   }
  //   this.isChange = !this.isChange;
  // }


  onFilter(field: string): void {
    if (this.viewType) {
      this.searchSubject.next(field);
    } else {
      this.fillTable();
    }
  }
  pageChanged(pageEvent: PageEvent): void {
    this.pagingEvent.emit(pageEvent);
  }
}
