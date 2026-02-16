import { Component, signal, computed, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, Clock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-angular';

import { ButtonComponent } from '@ui/button';
import { CardComponent } from '@ui/card';
import { BadgeComponent } from '@ui/badge';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-reschedule',
  imports: [
    CommonModule,
    LucideAngularModule,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
    RouterLink
],
  templateUrl: './reschedule.html',
  styleUrl: './reschedule.scss',
})
export class Reschedule {
  appointmentId = input<string>();
  onNavigate = output<string>(); 
  selectedDate = signal<string>('');
  selectedTime = signal<string>('');
  showConfirmation = signal<boolean>(false);

  // Constants & Mock Data
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

  // Icon Imports for Template
  readonly icons = { Calendar, Clock, ArrowLeft, CheckCircle, AlertCircle };

  readonly dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate()
    };
  });

  // Actions
  handleReschedule() {
    if (this.selectedDate() && this.selectedTime()) {
      this.showConfirmation.set(true);
    }
  }

  handleNavigate(page: string) {
    this.onNavigate.emit(page);
  }
}
