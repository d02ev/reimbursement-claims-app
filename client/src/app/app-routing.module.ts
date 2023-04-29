import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { UserHomeComponent } from './user/user-home/user-home.component';
import {
  adminGuard,
  approverGuard,
  authGuard,
  superAdminGuard,
  userGuard,
} from './guards';
import { CreateClaimComponent } from './claims/create-claim/create-claim.component';
import { EditClaimsComponent } from './claims/edit-claims/edit-claims.component';
import { ApproveClaimComponent } from './claims/approve-claim/approve-claim.component';
import { DeclineClaimComponent } from './claims/decline-claim/decline-claim.component';
import { UserClaimsComponent } from './claims/user-claims/user-claims.component';
import { ClaimsHomeComponent } from './claims/claims-home/claims-home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AccessUsersComponent } from './user/access-users/access-users.component';
import { AccessApproversComponent } from './user/access-approvers/access-approvers.component';
import { AccessAdminsComponent } from './user/access-admins/access-admins.component';
import { SuperAdminHomeComponent } from './super-admin/super-admin-home/super-admin-home.component';
import { AccessUsersAdminComponent } from './user/access-users-admin/access-users-admin.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { ApprovedClaimsComponent } from './claims/approved-claims/approved-claims.component';
import { DeclinedClaimsComponent } from './claims/declined-claims/declined-claims.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'auth/login',
        component: LoginComponent,
      },
      {
        path: 'auth/register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: 'super/dashboard',
    component: SuperAdminHomeComponent,
    canActivate: [authGuard, superAdminGuard],
    children: [
      {
        path: '',
        component: AccessUsersAdminComponent,
        canActivate: [authGuard, superAdminGuard],
      },
      {
        path: 'admins',
        component: AccessAdminsComponent,
        canActivate: [authGuard, superAdminGuard],
      },
    ],
  },
  {
    path: 'admin/dashboard',
    component: AdminHomeComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        component: AccessUsersComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'approvers',
        component: AccessApproversComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'claims',
        component: ClaimsHomeComponent,
        canActivate: [authGuard, approverGuard],
      },
      {
        path: 'claims/approved',
        component: ApprovedClaimsComponent,
        canActivate: [authGuard, approverGuard],
      },
      {
        path: 'claims/declined',
        component: DeclinedClaimsComponent,
        canActivate: [authGuard, approverGuard],
      },
      {
        path: 'claims/approve/:claimId',
        component: ApproveClaimComponent,
        canActivate: [authGuard, approverGuard],
      },
      {
        path: 'claims/decline/:claimId',
        component: DeclineClaimComponent,
        canActivate: [authGuard, approverGuard],
      },
      {
        path: 'profile',
        component: UserDetailsComponent,
        canActivate: [authGuard, userGuard],
      },
    ],
  },
  {
    path: 'user/dashboard',
    component: UserHomeComponent,
    canActivate: [authGuard, userGuard],
    children: [
      {
        path: 'claims/create',
        component: CreateClaimComponent,
        canActivate: [authGuard, userGuard],
      },
      {
        path: 'claims/edit/:claimId',
        component: EditClaimsComponent,
        canActivate: [authGuard, userGuard],
      },
      {
        path: '',
        component: UserClaimsComponent,
        canActivate: [authGuard, userGuard],
      },
      {
        path: 'claims',
        component: ClaimsHomeComponent,
        canActivate: [authGuard, approverGuard],
      },
      {
        path: 'claims/approved',
        component: ApprovedClaimsComponent,
        canActivate: [authGuard, approverGuard],
      },
      {
        path: 'claims/declined',
        component: DeclinedClaimsComponent,
        canActivate: [authGuard, approverGuard],
      },
      {
        path: 'claims/approve/:claimId',
        component: ApproveClaimComponent,
        canActivate: [authGuard, approverGuard],
      },
      {
        path: 'claims/decline/:claimId',
        component: DeclineClaimComponent,
        canActivate: [authGuard, approverGuard],
      },
      {
        path: 'profile',
        component: UserDetailsComponent,
        canActivate: [authGuard, userGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
