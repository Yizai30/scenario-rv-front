import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar-component/topbar.component';
import { ContentComponent } from './content-component/content.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { AppComponentComponent } from './app-component/app-component.component';
import {AppRoutes} from './app.routes';
import { HomeComponent } from './home/home.component';
import { TopbarExcludeComponent } from './topbar-exclude/topbar-exclude.component';
import { ContentExcludeComponent } from './content-exclude/content-exclude.component';
import { AppExcludeComponent } from './app-exclude/app-exclude.component';
import { AppCirculateComponent } from './app-circulate/app-circulate.component';
import { TopbarCirculateComponent } from './topbar-circulate/topbar-circulate.component';
import { ContentCirculateComponent } from './content-circulate/content-circulate.component';
import { ContentSMTComponent } from './content-smt/content-smt.component';
import { AppSmtComponent } from './app-smt/app-smt.component';
import { TopbarSmtComponent } from './topbar-smt/topbar-smt.component';

@NgModule({
    declarations: [
        AppComponent,
        TopbarComponent,
        ContentComponent,
        AppComponentComponent,
        HomeComponent,
        TopbarExcludeComponent,
        ContentExcludeComponent,
        AppExcludeComponent,
        AppCirculateComponent,
        TopbarCirculateComponent,
        ContentCirculateComponent,
        ContentSMTComponent,
        AppSmtComponent,
        TopbarSmtComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FileUploadModule,
        HttpClientModule,
        CommonModule,
        RouterModule,
        RouterModule.forRoot(AppRoutes)
    ],
    providers: [],
  exports: [
    TopbarComponent,
    ContentComponent,
    TopbarExcludeComponent,
    ContentExcludeComponent,
    TopbarCirculateComponent,
    ContentCirculateComponent
  ],
    bootstrap: [AppComponent]
})
export class AppModule { }
