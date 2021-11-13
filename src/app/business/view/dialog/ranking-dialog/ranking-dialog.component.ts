import {Component, Inject, OnInit} from '@angular/core';
import {Shifr} from "../../../data/model/entity/Shifr";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {DialogAction, DialogResult} from "../../../data/object/DialogResult";
import {RankingData} from "../../../data/object/RankingData";

@Component({
  selector: 'app-ranking-dialog',
  templateUrl: './ranking-dialog.component.html',
  styleUrls: ['./ranking-dialog.component.css']
})
export class RankingDialogComponent implements OnInit {

  dialogTitle: string;
  dialogButton: string;
  rankingData: RankingData;
  form: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<RankingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [RankingData, string, string],
    private translateService: TranslateService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.dialogTitle = this.data[1];
    this.dialogButton = this.data[2];
    this.rankingData = this.data[0];
    this.form = this.formBuilder.group({
      dbDisk: [this.rankingData.startDisbalance, [Validators.required, Validators.min]],
      angleDbDisk: [this.rankingData.startAngleDisbalance, [Validators.required, Validators.min, Validators.max]],
      needDB: [this.rankingData.needDisbalance, [Validators.required, Validators.min]],
    });
  }
  get getDBDiskield(): AbstractControl{
    return this.form.get('dbDisk');
  }
  get getAngleDBDiskField(): AbstractControl{
    return this.form.get('angleDbDisk');
  }
  get getNeedDBField(): AbstractControl{
    return this.form.get('needDB');
  }
  onConfirm(): void{
    if (this.form.invalid){
      return;
    }
    if (this.getDBDiskield.value >= 0 &&
      this.getAngleDBDiskField.value >= 0 && this.getAngleDBDiskField.value < 360 &&
      this.getNeedDBField.value >= 0
    ){
      this.rankingData.startDisbalance = this.getDBDiskield.value;
      this.rankingData.startAngleDisbalance = this.getAngleDBDiskField.value;
      this.rankingData.needDisbalance = this.getNeedDBField.value;
      this.dialogRef.close(new DialogResult(DialogAction.SET, this.rankingData))
    }
  }
  onCancel(): void{
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
  onCheckFields(): boolean{
    return !!(this.getDBDiskield.errors || this.getAngleDBDiskField.errors || this.getNeedDBField.errors);
  }
}
