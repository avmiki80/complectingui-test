import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DEFAULT_SORT_DIRECTION, DELAY_TIME, NAME, SHIFR} from "../../../../app.constant";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {StaticMethods} from "../../../../util/util";
import {ConfirmDialogComponent} from "../../dialog/confirm-dialog/confirm-dialog.component";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {Complect} from "../../../data/model/entity/Complect";
import {SearchComplect} from "../../../data/model/search/SearchComplect";
import {RankingDialogComponent} from "../../dialog/ranking-dialog/ranking-dialog.component";
import {RankingData} from "../../../data/object/RankingData";
import {RankingService} from "../../../../util/ranking.service";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-list-complect-view',
  templateUrl: './list-complect-view.component.html',
  styleUrls: ['./list-complect-view.component.css']
})
export class ListComplectViewComponent implements OnInit {
  schema = [];
  readonly name = NAME;
  readonly shifr = SHIFR;
  private searchSubject: Subject<any> = new Subject();
  private debTime: number = DELAY_TIME;
  searchName: string;
  searchShifr: string;
  sortDirectionName: string = null;
  sortDirectionShifr: string = null;
  displayedColumns: string[] = ['name', 'shifr', 'count', 'tuComplect', 'tuNeighb', 'tuOpposite',  'operation', 'ranking'];
  dataSource: MatTableDataSource<Complect>;

  @Input()
  selectedItem: Complect;
  searchComplect: SearchComplect;
  @Input('searchComplect')
  set setSearchComplect(searchComplect: SearchComplect){
    this.searchComplect = searchComplect;
  }
  itemList: Complect[];
  @Input('complectList')
  set setItemList(complectList: Complect[]) {
    this.itemList = complectList;
    this.fillTable();
  }
  @Input()
  totalFounded: number;

  @Output('selectComplect')
  selectItem = new EventEmitter<Complect>();
  @Output('searchComplect')
  searchItem = new EventEmitter<SearchComplect>();
  @Output('deleteComplect')
  deleteItem = new EventEmitter<Complect>();
  @Output()
  ranking = new EventEmitter<RankingData>();
  @Output()
  pagingEvent = new EventEmitter<PageEvent>();

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService,
    private rankingService: RankingService
  ) {
    this.searchSubject.pipe(debounceTime(this.debTime)).subscribe(field => {
      this.searchComplect.name = this.searchName;
      this.searchComplect.shifr = this.searchShifr;
      this.searchComplect.pageNumber = 0;
      if (field) this.searchComplect.sortColumn = field;
      switch (field) {
        case this.name: {
          this.searchComplect.sortDirection = this.sortDirectionName = StaticMethods.selectSortDirection(this.sortDirectionName);
          this.sortDirectionShifr = null;
          break;
        }
        case this.shifr: {
          this.searchComplect.sortDirection = this.sortDirectionShifr = StaticMethods.selectSortDirection(this.sortDirectionShifr);
          this.sortDirectionName = null;
          break;
        }
        default: {
          this.searchComplect.sortDirection = DEFAULT_SORT_DIRECTION;
          this.sortDirectionName = null;
          this.sortDirectionShifr = null;
          break;
        }
      }
      this.searchItem.emit(this.searchComplect);
    });
  }

  ngOnInit(): void {
    this.rankingService.createSchema().subscribe(result => {
      this.schema = result;
    });
    this.dataSource = new MatTableDataSource<Complect>();
    this.fillTable();
  }
  fillTable(): void {
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.itemList;
  }
  onClickSelectItem(item: Complect): void {
    if (item && item !== this.selectedItem) {
      this.selectedItem = item;
      this.selectItem.emit(this.selectedItem);
    }
  }
  onClickDeleteItem(item: Complect): void {
    if (item) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: '400px',
        data: {
          dialogTitle: this.translateService.instant('COMMON.CONFIRM-ACTION'),
          message: this.translateService.instant('COMPLECT.CONFIRM-DELETE', {name: item.name})
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
  onClickCreateSchema() :void {
    this.rankingService.createSchema().subscribe(result => {
      this.schema = result;
    });
  }
  onClickRanking(raysNumber: string): void {
    if (this.selectedItem && raysNumber.trim().length > 0) {
      const rankingData = new RankingData(this.selectedItem.id, 0,0, 0, raysNumber);
      const dialogRef = this.dialog.open(RankingDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
        maxWidth: '400px',
        data: [
          rankingData,
          this.translateService.instant('RANKING.RANKING'),
          this.translateService.instant('RANKING.RANKING', {name: this.selectedItem.name})
        ]
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result as DialogResult && result && result.action === DialogAction.SET) {
          this.ranking.emit(result.obj);
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
