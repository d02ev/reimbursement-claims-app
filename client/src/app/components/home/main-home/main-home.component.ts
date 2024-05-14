import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-main-home',
	standalone: true,
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
	templateUrl: './main-home.component.html',
	styleUrl: './main-home.component.css',
})
export class MainHomeComponent {}
