import { Routes } from '@angular/router';

// Import all standalone page components for the patient feature
import { Dashboard } from './pages/dashboard/dashboard';
import { Appointments } from './pages/appointments/appointments';
import { Profile } from './pages/profile/profile';


export const PATIENT_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, title: 'Patient Dashboard' },
  { path: 'appointments', component: Appointments, title: 'My Appointments' },
  { path: 'profile', component: Profile, title: 'Patient Profile' },
];