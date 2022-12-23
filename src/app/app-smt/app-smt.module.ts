import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { AppSmtRoutes } from './app-smt.routes';
import { AppSmtComponent } from './app-smt.component';
import {AppModule} from '../app.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AppSmtRoutes as any),
    AppModule
  ],
  declarations: [
    AppSmtComponent
  ]
})
export class AppSmtModule { }
