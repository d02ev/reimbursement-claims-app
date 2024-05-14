import { Routes } from '@angular/router';
import { MainHomeComponent } from './components/home/main-home/main-home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: MainHomeComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  }
];
