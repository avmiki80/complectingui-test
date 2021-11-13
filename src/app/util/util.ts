import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {MessageDialogComponent} from "../business/view/dialog/message-dialog/message-dialog.component";

export class StaticMethods {
  public static selectSortDirection(direction: string): string {
    if (direction === 'asc')  return 'desc';
    if (direction === 'desc') return null;
    return 'asc';
  }
}

@Injectable({
  providedIn: 'root'
})
export class ExceptionHandler {
  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {}

  public handle(error: any, text: string){
    switch (error.error.exception) {
      case 'DataIntegrityViolationException': {
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          autoFocus: false,
          restoreFocus: false,
          width: '500px',
          data: {
            dialogTitle: this.translateService.instant('ERROR.ERROR'),
            message: this.translateService.instant('ERROR.NOT-UNIQUE', {name: text})
          }
        });
        break;
      }
      case 'UnexpectedRollbackException': {
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          autoFocus: false,
          restoreFocus: false,
          width: '500px',
          data: {
            dialogTitle: this.translateService.instant('ERROR.ERROR'),
            message: this.translateService.instant('ERROR.FOREGIN-KEY',
              {name: text})
          }
        });
        break;
      }
      default: {
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          autoFocus: false,
          restoreFocus: false,
          width: '500px',
          data: {
            dialogTitle: this.translateService.instant('ERROR.ERROR'),
            message: error.error.exception + ': ' + error.error.cause
          }
        });
        break;
      }
    }
  }
  public handleError(error: any, text: string){
    switch (error) {
      case 'Duplicate shifr': {
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          autoFocus: false,
          restoreFocus: false,
          width: '500px',
          data: {
            dialogTitle: this.translateService.instant('ERROR.ERROR'),
            message: this.translateService.instant('ERROR.NOT-UNIQUE', {name: text})
          }
        });
        break;
      }
      default: {
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          autoFocus: false,
          restoreFocus: false,
          width: '500px',
          data: {
            dialogTitle: this.translateService.instant('ERROR.ERROR'),
            message: error
          }
        });
        break;
      }
    }
  }
}
