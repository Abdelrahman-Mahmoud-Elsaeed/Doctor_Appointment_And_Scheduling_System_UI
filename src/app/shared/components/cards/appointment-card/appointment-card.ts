import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '@core/models/core-models';
import { CardComponent } from '@ui/card';
import {  BadgeComponent } from '@ui/badge';
import { ButtonComponent } from '@ui/button';
import { LucideAngularModule,Calendar, Clock, FileText } from 'lucide-angular';



@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CardComponent, ButtonComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:"appointment-card.html"
})

export class AppointmentCardComponent {
  @Input({ required: true }) appointment!: Appointment;
  @Output() cancelAppointment = new EventEmitter<void>();
  @Output() rescheduleAppointment = new EventEmitter<void>();

  readonly Calendar = Calendar
  readonly Clock = Clock
  readonly FileText = FileText
  
  getStatusClasses(status: Appointment['status']): string {
    const statusColors: Record<Appointment['status'], string> = {
      confirmed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    // Use the outline variant styles from the Badge component logic
    return `${statusColors[status]} text-xs border`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    try {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }
}