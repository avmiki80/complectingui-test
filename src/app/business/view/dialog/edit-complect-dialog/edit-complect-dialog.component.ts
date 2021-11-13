import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {DatePipe, getLocaleDateFormat} from "@angular/common";

@Component({
  selector: 'app-edit-complect-dialog',
  templateUrl: './edit-complect-dialog.component.html',
  styleUrls: ['./edit-complect-dialog.component.css']
})
export class EditComplectDialogComponent implements OnInit {
  dialogTitle: string;
  dialogAddSaveButton: string;
  complectNamePrefix: string;
  complectNameInput: string;
  complectName: string;
  constructor(
    private dialogRef: MatDialogRef<EditComplectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [string, string, string],
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.dialogTitle = this.data[0];
    this.dialogAddSaveButton = this.data[1];
    this.complectNamePrefix = this.data[2] + ' ' + new DatePipe('ru-RU').transform(new Date(), 'dd.MM.yyyy') + '-';
    this.complectNameInput = '';
    this.complectName = '';
  }

  onConfirm(): void{
    this.complectName = (this.complectNamePrefix + this.complectNameInput).trim().toUpperCase();
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.complectName))
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }

  onFilter(event): void {
    let keyCode = event.keyCode;
    //если нажали клавиши: backspace, tab, escape, home, end, стрелочки или delete - то ничего не делаем
    if ([8, 9, 27, 35, 36, 37, 38, 39, 40, 46].indexOf(keyCode) !== -1) {
      return;
    }
    //если нажали лююбые клавиши отличные от цифр на основной клавиатуре или на дополнительной (NumPad), то отменяем ввод символа
    if ((keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105)) {
      event.preventDefault();
    }
    //если нажали 0 на основной и доп клавиатуре и при этом уже в строке есть 0, то отменяем ввод символа
    if ((keyCode == 48 || keyCode == 96) && (this.complectNameInput == '0' || this.complectNameInput[1] == '0')) {
      event.preventDefault();
    }
  }
  onCheckFields(): boolean {
    return this.complectNameInput.trim().length < 2;
  }
}
