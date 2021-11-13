import {Component, Inject, OnInit} from '@angular/core';
import {BladeDse} from "../../../data/model/entity/BladeDse";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {SelectShifrDialogComponent} from "../select-shifr-dialog/select-shifr-dialog.component";

@Component({
  selector: 'app-edit-blade-dse-dialog',
  templateUrl: './edit-blade-dse-dialog.component.html',
  styleUrls: ['./edit-blade-dse-dialog.component.css']
})
export class EditBladeDseDialogComponent implements OnInit {
  dialogTitle: string;
  dialogAddSaveButton: string;
  bladeDse: BladeDse;
  form: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<EditBladeDseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [BladeDse, string, string],
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.dialogTitle = this.data[1];
    this.dialogAddSaveButton = this.data[2];
    this.bladeDse = this.data[0];
    if(!this.bladeDse.shifr){
      this.form = this.formBuilder.group({
        name: [this.bladeDse.name, Validators.required],
        shifr: ['', Validators.required],
      });
    } else {
      this.form = this.formBuilder.group({
        name: [this.bladeDse.name, Validators.required],
        shifr: [this.bladeDse.shifr.name, Validators.required],
      });
    }
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
    if (this.getNameField.value && this.getNameField.value.trim().length > 0 &&
      this.getShifrField.value && this.getShifrField.value.trim().length > 0){
      this.bladeDse.name = this.getNameField.value.trim().toUpperCase();
      // this.bladeDse.shifr.name = this.getShifrField.value.trim().toUpperCase();
      this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.bladeDse))
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
        this.bladeDse.shifr = result.obj;
        this.bladeDse.shifr.status = true;
        this.getShifrField.setValue(this.bladeDse.shifr.name);
      }
    });
  }
}
