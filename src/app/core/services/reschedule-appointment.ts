import { Injectable } from '@angular/core';

@Injectable()
export class RescheduleAppointment {
    readonly timeSlots = {
    morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    afternoon: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'],
    evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM']
  };

  readonly currentAppointment = {
    id: '1',
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
    },
    date: 'Feb 20, 2026',
    time: '10:00 AM',
    type: 'In-Person Visit'
  };
}
