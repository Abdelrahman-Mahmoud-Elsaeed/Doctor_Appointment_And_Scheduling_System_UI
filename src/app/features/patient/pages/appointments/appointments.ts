import { Appointment } from '@core/models/core-models';
import { mockAppointments } from '@assets/mockData';
import { Component, Input, signal } from '@angular/core';
import { LucideAngularModule, Calendar, Clock, Filter } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { AppTabsComponent, AppTabsContentComponent, AppTabsListComponent, AppTabsTriggerComponent } from "@ui/taps";
import { AppointmentCardComponent } from "@shared/components/cards/appointment-card/appointment-card";
import { FormsModule } from '@angular/forms';
import { SelectComponent, SelectTriggerComponent, SelectContentComponent, SelectItemComponent, SelectValueComponent } from "@ui/select";

@Component({
  selector: 'app-appointments',
  standalone:true,
  imports: [CommonModule, AppTabsComponent, AppTabsContentComponent, AppTabsListComponent, AppTabsTriggerComponent, LucideAngularModule, FormsModule, AppointmentCardComponent, SelectComponent, SelectTriggerComponent, SelectContentComponent, SelectItemComponent, SelectValueComponent],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments {
  @Input() onNavigate?: (page: string) => void;

  mockAppointments = mockAppointments;

  confirmedAppointments = this.mockAppointments.filter(a => a.status === 'confirmed');
  pendingAppointments = this.mockAppointments.filter(a => a.status === 'pending');
  completedAppointments = this.mockAppointments.filter(a => a.status === 'completed');
  
  readonly Calendar = Calendar
  readonly Clock = Clock
  readonly Filter = Filter
  selectedDoctor = signal<string | null>(null)
  selectedSort = signal<string | null>(null)
  filterOptions = [
    { value: 'all', label: 'All Doctors' },
    { value: 'dr-sarah', label: 'Dr. Sarah Johnson' },
    { value: 'dr-michael', label: 'Dr. Michael Chen' },
    { value: 'dr-emily', label: 'Dr. Emily Rodriguez' },
  ];
  sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'doctor', label: 'By Doctor' },
  ];

  onCancel(id: string) {
    console.log('Cancel', id);
  }

  onReschedule(id: string) {
    console.log('Reschedule', id);
  }
}
