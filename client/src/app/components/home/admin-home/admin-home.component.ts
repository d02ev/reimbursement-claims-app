import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-admin-home',
	standalone: true,
	imports: [CommonModule, RouterOutlet],
	templateUrl: './admin-home.component.html',
	styleUrl: './admin-home.component.css',
})
export class AdminHomeComponent {}
