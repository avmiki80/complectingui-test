import {Component, Inject, OnInit} from '@angular/core';
import {Shifr} from "../../../data/model/entity/Shifr";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";

@Component({
  selector: 'app-edit-shifr-dialog',
  templateUrl: './edit-shifr-dialog.component.html',
  styleUrls: ['./edit-shifr-dialog.component.css']
})
export class EditShifrDialogComponent implements OnInit {
  dialogTitle: string;
  dialogAddSaveButton: string;
  shifr: Shifr;
  form: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<EditShifrDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Shifr, string, string],
    private translateService: TranslateService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.dialogTitle = this.data[1];
    this.dialogAddSaveButton = this.data[2];
    this.shifr = this.data[0];
    this.form = this.formBuilder.group({
      name: [this.shifr.name, Validators.required],
    });
  }
  get getNameField(): AbstractControl{
    return this.form.get('name');
  }

  onConfirm(): void{
    if (this.form.invalid){
      return;
    }
    if (this.getNameField.value && this.getNameField.value.trim().length > 0){
      this.shifr.name = this.getNameField.value.trim().toUpperCase();
      this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.shifr))
    }
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
  onCheckFields(): boolean{
    return !!(this.getNameField.errors);
  }
}
