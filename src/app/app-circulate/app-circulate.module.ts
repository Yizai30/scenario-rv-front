import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { AppCirculateRoutes } from './app-circulate.routes';
import { AppCirculateComponent } from './app-circulate.component';
import {AppModule} from '../app.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AppCirculateRoutes as any),
    AppModule
  ],
  declarations: [
    AppCirculateComponent
  ]
})
export class AppCirculateModule { }
