import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { PatientLayout } from './layouts/patient-layout/patient-layout';
import { DoctorLayout } from './layouts/doctor-layout/doctor-layout';
import { authGuard } from './core/guards/auth.guard'; 
import { roleGuard } from './core/guards/role.guard'; 

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout, 
    children: [
      {
        path: '',
        loadChildren: () => import('./features/public/public.routes') 
                            .then(m => m.PUBLIC_ROUTES)
      }
    ]
  },

  {
    path: 'patient',
    component: PatientLayout, 
    canActivate: [authGuard], 
    children: [
      {
        path: '',
        loadChildren: () => import('./features/patient/patient.routes') 
                            .then(m => m.PATIENT_ROUTES)
      }
    ]
  },

  {
    path: 'doctor',
    component: DoctorLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Doctor'] },
    children: [
      {
        path: '',
        loadChildren: () => import('./features/doctor/doctor.routes')
                            .then(m => m.DOCTOR_ROUTES)
      }
    ]
  }
];