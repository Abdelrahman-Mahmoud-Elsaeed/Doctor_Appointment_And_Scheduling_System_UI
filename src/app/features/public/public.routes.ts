import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { FindDoctor } from './pages/find-doctor/find-doctor';
import { DoctorDetails } from './pages/doctor-details/doctor-details';
import { PatientLogin } from './pages/patient-login/patient-login';
import { Register } from './pages/register/register';
import { DoctorLogin } from './pages/doctor-login/doctor-login';
import { AppointmentBooking } from './pages/appointment-booking/appointment-booking';

export const PUBLIC_ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home, title: 'Home | Appointment System' },
  { path: 'find-doctor', component: FindDoctor, title: 'Find Doctor' },
  { path: 'doctor-details/:id', component: DoctorDetails, title: 'Doctor Details' },
  { path: 'login', component: PatientLogin, title: 'Login' },
  { path: 'doctor-login', component: DoctorLogin, title: 'Doctor Login' },
  { path: 'register', component: Register, title: 'Register' },
  { path: 'appointment-booking/:id', component: AppointmentBooking, title: 'Book Sppointment' },
];