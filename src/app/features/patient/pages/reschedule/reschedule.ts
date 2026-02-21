import { Component, signal, computed, output, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, Clock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-angular';

import { ButtonComponent } from '@ui/button';
import { CardComponent } from '@ui/card';
import { BadgeComponent } from '@ui/badge';
import { RouterLink } from "@angular/router";
import { RescheduleAppointment } from '@core/services/reschedule-appointment';

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
  providers:[
    RescheduleAppointment
  ]
})
export class Reschedule {
  appointmentId = input<string>();
  selectedDate = signal<string>('');
  selectedTime = signal<string>('');
  showConfirmation = signal<boolean>(false);
  rescheduleServeice = inject(RescheduleAppointment)

  // Constants & Mock Data
  readonly timeSlots = this.rescheduleServeice.timeSlots;

  readonly currentAppointment = this.rescheduleServeice.currentAppointment;

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


}
