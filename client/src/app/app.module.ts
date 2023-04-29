import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { UserHomeComponent } from './user/user-home/user-home.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';
import { EditUserDetailsComponent } from './user/edit-user-details/edit-user-details.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { ClaimsHomeComponent } from './claims/claims-home/claims-home.component';
import { EditClaimsComponent } from './claims/edit-claims/edit-claims.component';
import { ApprovedClaimsComponent } from './claims/approved-claims/approved-claims.component';
import { DeclinedClaimsComponent } from './claims/declined-claims/declined-claims.component';
import { ApproveClaimComponent } from './claims/approve-claim/approve-claim.component';
import { DeclineClaimComponent } from './claims/decline-claim/decline-claim.component';
import { CreateClaimComponent } from './claims/create-claim/create-claim.component';
import { UserClaimsComponent } from './claims/user-claims/user-claims.component';
import { AccessUsersComponent } from './user/access-users/access-users.component';
import { AccessApproversComponent } from './user/access-approvers/access-approvers.component';
import { AccessAdminsComponent } from './user/access-admins/access-admins.component';
import { SuperAdminHomeComponent } from './super-admin/super-admin-home/super-admin-home.component';
import { ErrorInterceptor, TokenInterceptor } from './interceptors';
import {
  AdminService,
  AuthService,
  ClaimService,
  ErrorService,
  SuperAdminService,
} from './services';
import { AccessUsersAdminComponent } from './user/access-users-admin/access-users-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserHomeComponent,
    UserDetailsComponent,
    EditUserDetailsComponent,
    ResetPasswordComponent,
    AdminHomeComponent,
    ClaimsHomeComponent,
    EditClaimsComponent,
    ApprovedClaimsComponent,
    DeclinedClaimsComponent,
    ApproveClaimComponent,
    DeclineClaimComponent,
    CreateClaimComponent,
    UserClaimsComponent,
    AccessUsersComponent,
    AccessApproversComponent,
    AccessAdminsComponent,
    SuperAdminHomeComponent,
    AccessUsersAdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    SuperAdminService,
    AdminService,
    AuthService,
    ClaimService,
    ErrorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
