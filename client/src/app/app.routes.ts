import { Routes } from '@angular/router';
import { MainHomeComponent } from './components/home/main-home/main-home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserHomeComponent } from './components/home/user-home/user-home.component';
import { adminGuard, authGuard, userGuard } from './guards';
import { DisplayClaimComponent } from './components/claim/display-claim/display-claim.component';
import { AdminHomeComponent } from './components/home/admin-home/admin-home.component';

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
				component: RegisterComponent,
			},
		],
	},
	{
		path: 'user/home',
		canActivate: [authGuard, userGuard],
		component: UserHomeComponent,
		children: [
			{
				path: '',
        canActivate: [authGuard],
        data: { 'role': 'User' },
				component: DisplayClaimComponent,
			},
		],
	},
  {
    path: 'admin/home',
    canActivate: [authGuard, adminGuard],
    component: AdminHomeComponent,
    children: [
      {
        path: '',
        canActivate: [authGuard],
        data: { 'role': 'Admin' },
        component: DisplayClaimComponent,
      },
    ]
  }
];
