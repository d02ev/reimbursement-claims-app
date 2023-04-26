import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-approver-home',
  templateUrl: './approver-home.component.html',
  styleUrls: ['./approver-home.component.css'],
})
export class ApproverHomeComponent {
  constructor(private readonly _authService: AuthService) {}

  // public attributes
  public userEmail = this._authService.getPayloadValueOf('email');

  // public methods
  public logout(): void {
    this._authService.logoutUser();
  }
}
