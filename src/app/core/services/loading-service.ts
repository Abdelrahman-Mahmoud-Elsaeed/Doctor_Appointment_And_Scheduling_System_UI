import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event as RouterEvent } from '@angular/router';

const PAGE_MESSAGES: Record<string, string> = {
  'home': 'Loading Home...',
  'find-doctor': 'Loading Doctors...',
  'doctor-profile': 'Loading Doctor Profile...',
  'appointment-booking': 'Loading Booking Form...',
  'reschedule': 'Loading Reschedule Options...',
  'appointments': 'Loading Appointments...',
  'profile': 'Loading Profile...',
  'dashboard': 'Loading Dashboard...',
  'doctor-appointments': 'Loading Appointments...',
  'appointment-details': 'Loading Appointment Details...',
  'work-schedule': 'Loading Schedule...',
  'doctor-own-profile': 'Loading Profile...',
  'login': 'Loading Login...',
  'doctor-login': 'Loading Doctor Login...',
  'register': 'Loading Registration...',
  'schedule': 'Loading schedule...',
  '404': 'Loading...'
};

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private router = inject(Router);
  
  // State
  private _isLoading = signal(false);
  private _message = signal('Loading...');
  private previousUrl = '';

  // Expose as ReadOnly signals
  isLoading = this._isLoading.asReadonly();
  message = this._message.asReadonly();

  constructor() {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this._message.set(this.getMessageForUrl(event.url));
        this._isLoading.set(true);
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(() => this._isLoading.set(false), 800);

        if (event instanceof NavigationEnd) {
          const currentUrl = event.urlAfterRedirects.split('?')[0];
          if (currentUrl !== this.previousUrl) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.previousUrl = currentUrl;
          }
        }
      }
    });
  }

  private getMessageForUrl(url: string): string {
    const cleanUrl = url.split('?')[0].replace(/^\//, '');
    const match = Object.keys(PAGE_MESSAGES).find(key => cleanUrl.includes(key));
    return match ? PAGE_MESSAGES[match] : 'Loading...';
  }
}