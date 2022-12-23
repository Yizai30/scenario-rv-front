import {AppComponentComponent} from './app-component/app-component.component';
import {HomeComponent} from './home/home.component';
import {AppExcludeComponent} from './app-exclude/app-exclude.component';
import {AppCirculateComponent} from './app-circulate/app-circulate.component';
import {AppSmtComponent} from './app-smt/app-smt.component';

export const AppRoutes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'app-component',
    component: AppComponentComponent
  },
  {
    path: 'app-exclude',
    component: AppExcludeComponent
  },
  {
    path: 'app-circulate',
    component: AppCirculateComponent
  },
  {
    path: 'app-smt',
    component: AppSmtComponent
  }
];
