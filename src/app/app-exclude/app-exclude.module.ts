import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { AppExcludeRoutes } from './app-exclude.routes';
import { AppExcludeComponent } from './app-exclude.component';
import {AppModule} from '../app.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AppExcludeRoutes as any),
    AppModule
  ],
  declarations: [
    AppExcludeComponent
  ]
})
export class AppExcludeModule { }
