import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-display-claim',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './display-claim.component.html',
	styleUrl: './display-claim.component.css',
})
export class DisplayClaimComponent implements OnInit {
  loggedInUserRole: string = '';

  constructor(private readonly _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
   this.loggedInUserRole = this._activatedRoute.snapshot.data['role'];

   // approve and decline options only for admin

   // update, create and delete only for user
  }
}
