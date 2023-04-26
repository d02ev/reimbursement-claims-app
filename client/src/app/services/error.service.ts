import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  // private attribute
  private _errorMessage = '';

  // getters and setters
  set errorMessage(message: string) {
    this._errorMessage = message;
  }
  get errorMessage(): string {
    return this._errorMessage;
  }
}
