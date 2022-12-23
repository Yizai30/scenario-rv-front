import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { AppComponentRoutes } from './app-component.routes';
import { AppComponentComponent } from './app-component.component';
import {AppModule} from '../app.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AppComponentRoutes as any),
    AppModule
  ],
  declarations: [
    AppComponentComponent
  ]
})
export class AppComponentModule { }
