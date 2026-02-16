import { Component, inject, Input, signal } from '@angular/core';
import { LucideAngularModule, Calendar, Clock, Filter } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { AppTabsComponent, AppTabsContentComponent, AppTabsListComponent, AppTabsTriggerComponent } from "@ui/taps";
import { AppointmentCardComponent } from "@shared/components/cards/appointment-card/appointment-card";
import { FormsModule } from '@angular/forms';
import { SelectComponent, SelectTriggerComponent, SelectContentComponent, SelectItemComponent, SelectValueComponent } from "@ui/select";
import { PatientAppointments } from '@core/services/patient-appointments.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-appointments',
  standalone:true,
  imports: [CommonModule, AppTabsComponent, AppTabsContentComponent, AppTabsListComponent, AppTabsTriggerComponent, LucideAngularModule, FormsModule, AppointmentCardComponent, SelectComponent, SelectTriggerComponent, SelectContentComponent, SelectItemComponent, SelectValueComponent, RouterLink],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
  providers:[
    PatientAppointments
  ]
})
export class Appointments {
  @Input() onNavigate?: (page: string) => void;
  appointment = inject(PatientAppointments)

  mockAppointments = this.appointment.mockAppointments;
  confirmedAppointments = this.appointment.confirmedAppointments;
  pendingAppointments = this.appointment.pendingAppointments;
  completedAppointments = this.appointment.completedAppointments;
  filterOptions = this.appointment.filterOptions;
  sortOptions = this.appointment.sortOptions;;


  selectedDoctor = signal<string | null>(null)
  selectedSort = signal<string | null>(null)

  onCancel(id: string) {
    console.log('Cancel', id);
  }

  onReschedule(id: string) {
    console.log('Reschedule', id);
  }

  readonly Calendar = Calendar
  readonly Clock = Clock
  readonly Filter = Filter
}
