import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService, User} from "../../../../auth/service/auth.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {SettingsDialogComponent} from "../../dialog/settings-dialog/settings-dialog.component";
import {DialogAction} from "../../../data/object/DialogResult";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMobile: boolean;
  @Input()
  user: User;
  @Output()
  langChange = new EventEmitter<string>();
  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  logout(): void{
    this.authService.logout();
  }


  showSettings(): void{
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      autoFocus: false,
      width: '800px',
      minHeight: '300px',
      maxHeight: '90vh',
      restoreFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === DialogAction.SETTING_CHANGE){
        // вообще-то передавать в смарт компонент нечего. Но пока оствалю так. вдруг понадобиться
        this.langChange.emit(result.obj);
        return;
      }
    });
  }
}
