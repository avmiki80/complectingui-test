import {Component, Inject, OnInit} from '@angular/core';
import {BladeDse} from "../../../data/model/entity/BladeDse";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {SelectShifrDialogComponent} from "../select-shifr-dialog/select-shifr-dialog.component";
import {Rotor} from "../../../data/model/entity/Rotor";
import {Stage} from "../../../data/model/entity/Stage";
import {SearchStage} from "../../../data/model/search/SearchStage";
import {AuthService, User} from "../../../../auth/service/auth.service";
import {ExceptionHandler} from "../../../../util/util";
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-edit-rotor-dialog',
  templateUrl: './edit-rotor-dialog.component.html',
  styleUrls: ['./edit-rotor-dialog.component.css']
})
export class EditRotorDialogComponent implements OnInit {
  dialogTitle: string;
  dialogAddSaveButton: string;
  rotor: Rotor;
  user: User;

  stageList: Stage[];
  searchStage: SearchStage;
  selectedStage: Stage;

  form: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<EditRotorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Rotor, string, string],
    private translateService: TranslateService,
    private autheService: AuthService,
    private exceptionHandler: ExceptionHandler,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.user = this.autheService.currentUser.getValue();
    this.dialogTitle = this.data[1];
    this.dialogAddSaveButton = this.data[2];
    this.rotor = this.data[0];
    this.stageList = this.data[0].stages;
    if (!this.stageList){
      this.stageList = [];
    }
    if(!this.rotor.shifr){
      this.form = this.formBuilder.group({
        name: [this.rotor.name, Validators.required],
        shifr: ['', Validators.required],
      });
    } else {
      this.form = this.formBuilder.group({
        name: [this.rotor.name, Validators.required],
        shifr: [this.rotor.shifr.name, Validators.required],
      });
    }
    this.initSearchStage();
  }
  get getNameField(): AbstractControl{
    return this.form.get('name');
  }
  get getShifrField(): AbstractControl{
    return this.form.get('shifr');
  }
  onConfirm(): void{
    if (this.form.invalid){
      return;
    }
    if (!this.stageList || this.stageList.length === 0){
      return;
    }
    if (this.getNameField.value && this.getNameField.value.trim().length > 0 &&
      this.getShifrField.value && this.getShifrField.value.trim().length > 0){
      this.rotor.name = this.getNameField.value.trim().toUpperCase();
      this.rotor.stages = this.stageList;
      // this.rotor.shifr.name = this.getShifrField.value.trim().toUpperCase();
      this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.rotor))
    }
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
  onCheckFields(): boolean{
    return !!(this.getNameField.errors || this.getShifrField.errors);
  }
  onClickSelectShifr(){
    const dialogRef = this.dialog.open(SelectShifrDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      maxWidth: '800px',
      data: [this.translateService.instant('SHIFR.SELECT')],
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.obj && result.action === DialogAction.SELECT){
        this.rotor.shifr = result.obj;
        this.rotor.shifr.status = true;
        this.getShifrField.setValue(this.rotor.shifr.name);
      }
    });
  }
  private initSearchStage(){
    this.searchStage = new SearchStage('', '');
  }

  onAddStage(stage: Stage): void{
    const exist = this.stageList.find(s => {
      if (s.bladeDse.shifr.name === stage.bladeDse.shifr.name)
        return s;
      return null;
    });
    if (exist){
      this.exceptionHandler.handleError('Duplicate shifr', stage.bladeDse.shifr.name);
      return;
    }
    this.stageList.push(stage);
    this.stageList = Array.from(this.stageList);
  }
  onUpdateStage(stage: Stage): void{
    const index = this.stageList.findIndex(s => s.id === stage.id);
    const res = this.stageList.filter(s => s.bladeDse.shifr.name === stage.bladeDse.shifr.name);
    if(res && res.length > 1){
      this.exceptionHandler.handleError('Duplicate shifr', stage.bladeDse.shifr.name);
      return;
    }
    this.stageList = Array.from(this.stageList);
  }

  onDeleteStage(stage: Stage):void{
    this.stageList = this.stageList.filter(s => s.bladeDse.shifr.name !== stage.bladeDse.shifr.name);
  }
}
