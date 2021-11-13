import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {SelectBladeDseDialogComponent} from "../select-blade-dse-dialog/select-blade-dse-dialog.component";
import {Stage} from "../../../data/model/entity/Stage";

@Component({
  selector: 'app-edit-stage-dialog',
  templateUrl: './edit-stage-dialog.component.html',
  styleUrls: ['./edit-stage-dialog.component.css']
})
export class EditStageDialogComponent implements OnInit {
  dialogTitle: string;
  dialogAddSaveButton: string;
  stage: Stage;
  reverse: boolean;
  form: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<EditStageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Stage, string, string],
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dialogTitle = this.data[1];
    this.dialogAddSaveButton = this.data[2];
    this.stage = this.data[0];
    this.reverse = false;
    if (this.stage)
      this.reverse = this.stage.reverse;
    if(!this.stage.bladeDse){
      this.form = this.formBuilder.group({
        name: [this.stage.name, Validators.required],
        count: [this.stage.count, [Validators.required, Validators.min]],
        tuComplect: [this.stage.tuComplect, [Validators.required, Validators.min]],
        tuOpposite: [this.stage.tuOpposite, [Validators.required, Validators.min]],
        tuNeighb: [this.stage.tuNeighb, [Validators.required, Validators.min]],
        shifr: ['', Validators.required],
      });
    } else {
      this.form = this.formBuilder.group({
        name: [this.stage.name, Validators.required],
        count: [this.stage.count, [Validators.required, Validators.min]],
        tuComplect: [this.stage.tuComplect, [Validators.required, Validators.min]],
        tuOpposite: [this.stage.tuOpposite, [Validators.required, Validators.min]],
        tuNeighb: [this.stage.tuNeighb, [Validators.required, Validators.min]],
        shifr: [this.stage.bladeDse.shifr.name, Validators.required],
      });
    }
  }
  get getNameField(): AbstractControl{
    return this.form.get('name');
  }
  get getShifrField(): AbstractControl{
    return this.form.get('shifr');
  }
  get getCountField(): AbstractControl{
    return this.form.get('count');
  }
  get getTuComplectField(): AbstractControl{
    return this.form.get('tuComplect');
  }
  get getTuOppositeField(): AbstractControl{
    return this.form.get('tuOpposite');
  }
  get getTuNeighbField(): AbstractControl{
    return this.form.get('tuNeighb');
  }

  onConfirm(): void{
    if (this.form.invalid){
      return;
    }
    if (!this.stage.bladeDse){
      return;
    }
    if (this.getNameField.value && this.getNameField.value.trim().length > 0 &&
      this.getShifrField.value && this.getShifrField.value.trim().length > 0 &&
      this.getCountField.value && this.getCountField.value > 0 &&
      this.getTuComplectField.value && this.getTuComplectField.value > 0 &&
      this.getTuNeighbField.value && this.getTuNeighbField.value > 0 &&
      this.getTuOppositeField.value && this.getTuOppositeField.value > 0){

      this.stage.name = this.getNameField.value.trim().toUpperCase();
      this.stage.count =  this.getCountField.value;
      this.stage.tuNeighb =  this.getTuNeighbField.value;
      this.stage.tuComplect =  this.getTuComplectField.value;
      this.stage.tuOpposite = this.getTuOppositeField.value;
      this.stage.reverse = this.reverse;
      this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.stage))
    }
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
  onCheckFields(): boolean{
    return !!(this.getNameField.errors || this.getShifrField.errors || this.getCountField.errors
      || this.getTuComplectField.errors || this.getTuNeighbField.errors || this.getTuOppositeField.errors);
  }
  onClickSelectBladeDse(){
    const dialogRef = this.dialog.open(SelectBladeDseDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '1000px',
      data: [this.translateService.instant('SHIFR.SELECT')],
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.obj && result.action === DialogAction.SELECT){
        this.stage.bladeDse = result.obj;
        this.getShifrField.setValue(this.stage.bladeDse.shifr.name);
      }
    });
  }
  onToggleReverse(): void{
    this.reverse != this.reverse;
  }
}
