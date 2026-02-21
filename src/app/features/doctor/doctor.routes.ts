import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Appointments } from './pages/appointments/appointments';
import { Schedule } from './pages/schedule/schedule';
import { Profile } from './pages/profile/profile';
import { AppointmentDetails } from './pages/appointment-details/appointment-details';


export const DOCTOR_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, title: 'Doctor Dashboard' },
  { path: 'appointment-details', component: AppointmentDetails, title: 'Doctor Profile' },
  { path: 'appointments', component: Appointments, title: 'Manage Appointments' },
  { path: 'schedule', component: Schedule, title: 'Schedule Management' },
  { path: 'profile', component: Profile, title: 'Doctor Profile' },
];