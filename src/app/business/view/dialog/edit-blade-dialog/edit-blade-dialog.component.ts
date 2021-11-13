import {Component, Inject, OnInit} from '@angular/core';
import {Stage} from "../../../data/model/entity/Stage";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {SelectBladeDseDialogComponent} from "../select-blade-dse-dialog/select-blade-dse-dialog.component";
import {Blade} from "../../../data/model/entity/Blade";

@Component({
  selector: 'app-edit-blade-dialog',
  templateUrl: './edit-blade-dialog.component.html',
  styleUrls: ['./edit-blade-dialog.component.css']
})
export class EditBladeDialogComponent implements OnInit {
  dialogTitle: string;
  dialogAddSaveButton: string;
  blade: Blade;
  form: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<EditBladeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Blade, string, string],
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dialogTitle = this.data[1];
    this.dialogAddSaveButton = this.data[2];
    this.blade = this.data[0];
    if(!this.blade.bladeDse){
      this.form = this.formBuilder.group({
        name: [this.blade.indNumber, Validators.required],
        cell: [this.blade.store.cell, Validators.required],
        stelag: [this.blade.store.stelag, Validators.required],
        mr: [this.blade.data.mr, [Validators.required]],
        mx: [this.blade.data.mx, [Validators.required]],
        my: [this.blade.data.my, [Validators.required]],
        mz: [this.blade.data.mz, [Validators.required]],
        shifr: ['', Validators.required],
      });
    } else {
      this.form = this.formBuilder.group({
        name: [this.blade.indNumber, Validators.required],
        cell: [this.blade.store.cell, Validators.required],
        stelag: [this.blade.store.stelag, Validators.required],
        mr: [this.blade.data.mr, [Validators.required]],
        mx: [this.blade.data.mx, [Validators.required]],
        my: [this.blade.data.my, [Validators.required]],
        mz: [this.blade.data.mz, [Validators.required]],
        shifr: [this.blade.bladeDse.shifr.name, Validators.required],
      });
    }
  }
  get getNameField(): AbstractControl{
    return this.form.get('name');
  }
  get getShifrField(): AbstractControl{
    return this.form.get('shifr');
  }
  get getMrField(): AbstractControl{
    return this.form.get('mr');
  }
  get getMxField(): AbstractControl{
    return this.form.get('mx');
  }
  get getMyField(): AbstractControl{
    return this.form.get('my');
  }
  get getMzField(): AbstractControl{
    return this.form.get('mz');
  }
  get getStelagField(): AbstractControl{
    return this.form.get('stelag');
  }
  get getCellField(): AbstractControl{
    return this.form.get('cell');
  }
  onConfirm(): void{
    if (this.form.invalid){
      return;
    }
    if (!this.blade.bladeDse){
      return;
    }
    if (this.getNameField.value && this.getNameField.value.trim().length > 0 &&
      this.getShifrField.value && this.getShifrField.value.trim().length > 0 &&
      this.getStelagField.value && this.getStelagField.value.trim().length > 0 &&
      this.getCellField.value && this.getCellField.value.trim().length > 0 &&
      this.getMrField.value !== null &&
      this.getMxField.value !== null &&
      this.getMyField.value !== null &&
      this.getMzField.value !== null){
      this.blade.indNumber = this.getNameField.value.trim().toUpperCase();
      this.blade.store.stelag = this.getStelagField.value.trim().toUpperCase();
      this.blade.store.cell = this.getCellField.value.trim().toUpperCase();
      this.blade.data.mr =  this.getMrField.value;
      this.blade.data.mx =  this.getMxField.value;
      this.blade.data.my =  this.getMyField.value;
      this.blade.data.mz = this.getMzField.value;
      this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.blade))
    }
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
  onCheckFields(): boolean{
    return !!(this.getNameField.errors || this.getShifrField.errors || this.getMrField.errors
      || this.getMxField.errors || this.getMyField.errors || this.getMzField.errors || this.getStelagField.errors || this.getStelagField.errors || this.getCellField.errors);
  }
  onClickSelectBladeDse(){
    const dialogRef = this.dialog.open(SelectBladeDseDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      width: '800px',
      data: [this.translateService.instant('SHIFR.SELECT')],
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.obj && result.action === DialogAction.SELECT){
        this.blade.bladeDse = result.obj;
        this.getShifrField.setValue(this.blade.bladeDse.shifr.name);
      }
    });
  }
}
