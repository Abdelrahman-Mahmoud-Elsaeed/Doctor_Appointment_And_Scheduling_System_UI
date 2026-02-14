import { Injectable } from '@angular/core';
import { mockAppointments } from '@assets/mockData';

@Injectable()
export class PatientAppointments {
  
  readonly mockAppointments = mockAppointments;

  readonly confirmedAppointments = this.mockAppointments.filter(a => a.status === 'confirmed');
  readonly pendingAppointments = this.mockAppointments.filter(a => a.status === 'pending');
  readonly completedAppointments = this.mockAppointments.filter(a => a.status === 'completed');
  readonly filterOptions = [
    { value: 'all', label: 'All Doctors' },
    { value: 'dr-sarah', label: 'Dr. Sarah Johnson' },
    { value: 'dr-michael', label: 'Dr. Michael Chen' },
    { value: 'dr-emily', label: 'Dr. Emily Rodriguez' },
  ];
  readonly sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'doctor', label: 'By Doctor' },
  ];
}
