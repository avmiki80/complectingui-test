import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {registerLocaleData} from "@angular/common";
import localeRu from '@angular/common/locales/ru';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {environment} from "../environments/environment.prod";
import {MultiTranslateHttpLoader} from "ngx-translate-multi-http-loader";
import {TranslateLoader, TranslateModule, TranslatePipe} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {RequestInterceptorService} from "./auth/interceptor/request-interceptor.service";
import {AUTH_URL_TOKEN, LOGIN_URL_TOKEN} from "./auth/service/auth.service";
import { AccessDeniedComponent } from './auth/page/access-denied/access-denied.component';
import { MainComponent } from './business/view/page/main/main.component';
import {RouterModule} from "@angular/router";
import {BLADE_URL_TOKEN} from "./business/data/service/impl/blade.service";
import {COMPLECT_URL_TOKEN} from "./business/data/service/impl/complect.service";
import {UTIL_URL_TOKEN} from "./business/data/service/impl/util.service";
import { SettingsDialogComponent } from './business/view/dialog/settings-dialog/settings-dialog.component';
import { ConfirmDialogComponent } from './business/view/dialog/confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from './business/view/dialog/message-dialog/message-dialog.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import { FooterComponent } from './business/view/page/footer/footer.component';
import { HeaderComponent } from './business/view/page/header/header.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatTabsModule} from "@angular/material/tabs";
import {MatRadioModule} from "@angular/material/radio";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {AppRoutingModule} from "./app-routing.module";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import { SelectShifrDialogComponent } from './business/view/dialog/select-shifr-dialog/select-shifr-dialog.component';
import { EditShifrDialogComponent } from './business/view/dialog/edit-shifr-dialog/edit-shifr-dialog.component';
import { ListShifrViewComponent } from './business/view/page/list-shifr-view/list-shifr-view.component';
import {SHIFR_URL_TOKEN} from "./business/data/service/impl/shifr.service";
import {BLADE_DSE_URL_TOKEN} from "./business/data/service/impl/blade-dse.service";
import { EditBladeDseDialogComponent } from './business/view/dialog/edit-blade-dse-dialog/edit-blade-dse-dialog.component';
import { ListBladeDseViewComponent } from './business/view/page/list-blade-dse-view/list-blade-dse-view.component';
import { EditRotorDialogComponent } from './business/view/dialog/edit-rotor-dialog/edit-rotor-dialog.component';
import { ListRotorViewComponent } from './business/view/page/list-rotor-view/list-rotor-view.component';
import { EditStageDialogComponent } from './business/view/dialog/edit-stage-dialog/edit-stage-dialog.component';
import { ListStageViewComponent } from './business/view/page/list-stage-view/list-stage-view.component';
import {ROTOR_URL_TOKEN} from "./business/data/service/impl/rotor.service";
import { SelectBladeDseDialogComponent } from './business/view/dialog/select-blade-dse-dialog/select-blade-dse-dialog.component';
import { ActionButtonComponent } from './business/view/page/action-button/action-button.component';
import { ListBladeViewComponent } from './business/view/page/list-blade-view/list-blade-view.component';
import { EditComplectDialogComponent } from './business/view/dialog/edit-complect-dialog/edit-complect-dialog.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { ListComplectViewComponent } from './business/view/page/list-complect-view/list-complect-view.component';
import { RankingDialogComponent } from './business/view/dialog/ranking-dialog/ranking-dialog.component';
import { EditBladeDialogComponent } from './business/view/dialog/edit-blade-dialog/edit-blade-dialog.component';
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";



registerLocaleData(localeRu);
//для загрузки перевода по сети
function HttpLoaderFactory(httpClient: HttpClient): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(httpClient, [
    {prefix: environment.frontendURL + '/assets/i18n/', suffix: '.json'}//путь к папке и суффикс файлов
  ]);
}
@NgModule({
  declarations: [
    AppComponent,
    AccessDeniedComponent,
    MainComponent,
    SettingsDialogComponent,
    ConfirmDialogComponent,
    MessageDialogComponent,
    FooterComponent,
    HeaderComponent,
    SelectShifrDialogComponent,
    EditShifrDialogComponent,
    ListShifrViewComponent,
    EditBladeDseDialogComponent,
    ListBladeDseViewComponent,
    EditRotorDialogComponent,
    ListRotorViewComponent,
    EditStageDialogComponent,
    ListStageViewComponent,
    SelectBladeDseDialogComponent,
    ActionButtonComponent,
    ListBladeViewComponent,
    EditComplectDialogComponent,
    ListComplectViewComponent,
    RankingDialogComponent,
    EditBladeDialogComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTabsModule,
    MatRadioModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    MatCheckboxModule,
    MatListModule,
    MatSelectModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,//для загрузки переводов по сети
        deps: [HttpClient]
      }
    }),

  ],
  providers: [

    {provide: AUTH_URL_TOKEN, useValue: environment.authURL + '/auth'},
    {provide: LOGIN_URL_TOKEN, useValue: environment.loginUrl},

    {provide: BLADE_URL_TOKEN, useValue: environment.backendURL + '/blade'},
    {provide: COMPLECT_URL_TOKEN, useValue: environment.backendURL + '/complect'},
    {provide: SHIFR_URL_TOKEN, useValue: environment.backendURL + '/shifr'},
    {provide: BLADE_DSE_URL_TOKEN, useValue: environment.backendURL + '/blade_dse'},
    {provide: ROTOR_URL_TOKEN, useValue: environment.backendURL + '/rotor'},
    {provide: UTIL_URL_TOKEN, useValue: environment.backendURL},

    {provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true},

    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}},
    // {provide: PLATFORM_PIPES, useValue: TranslatePipe, multi: true },

    //нужно указать для корректной работы диалоговых окон
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}},
  ],
  entryComponents: [
    SettingsDialogComponent,
    ConfirmDialogComponent,
    MessageDialogComponent,
    SelectShifrDialogComponent,
    EditShifrDialogComponent,
    EditBladeDseDialogComponent,
    EditRotorDialogComponent,
    EditStageDialogComponent,
    SelectBladeDseDialogComponent,
    EditComplectDialogComponent,
    RankingDialogComponent,
    EditBladeDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

