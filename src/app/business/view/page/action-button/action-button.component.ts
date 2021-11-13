import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {UtilService} from "../../../data/service/impl/util.service";
import {MatDialog} from "@angular/material/dialog";
import {EditComplectDialogComponent} from "../../dialog/edit-complect-dialog/edit-complect-dialog.component";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.css']
})
export class ActionButtonComponent implements OnInit {
  selectedFile: File = null;
  @Output()
  importFile = new EventEmitter<File>();
  @Output()
  doComplect = new EventEmitter<string>();
  @Input()
  enableDoComplect: boolean
  @Input()
  shifrForComplect: string

  constructor(
    private translateService: TranslateService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.selectedFile = null;
  }

  onClickImport(event){
    this.selectedFile = (event.target.files[0] as File);
    if (this.selectedFile){
      return this.importFile.emit(this.selectedFile);
    }
  }
  onClickComplect(){
    const dialogRef = this.dialog.open(EditComplectDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      maxWidth: '800px',
      data: [
        this.translateService.instant('COMPLECT.SAVE'),
        this.translateService.instant('COMMON.SAVE'),
        this.shifrForComplect],
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result as DialogResult && result.obj && result.action === DialogAction.SAVE){
        return this.doComplect.emit(result.obj);
      }
    });
  }
}
