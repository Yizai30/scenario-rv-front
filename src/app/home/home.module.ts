import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { HomeComponentRoutes } from './home.routes';
import { HomeComponent} from './home.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(HomeComponentRoutes as any)
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
