import { Component, Input } from '@angular/core';
import { BadgeComponent } from "@shared/components/ui/badge";
import { CardComponent } from "@shared/components/ui/card";
import { CalendarComponent } from "@shared/components/ui/calendar";
import { ButtonComponent } from "@shared/components/ui/button";
import { AppTabsContentComponent, AppTabsTriggerComponent, AppTabsListComponent, AppTabsComponent } from "@shared/components/ui/taps";
import { SelectItemComponent, SelectContentComponent, SelectTriggerComponent, SelectValueComponent, SelectComponent } from "@shared/components/ui/select";
import { LucideAngularModule, Calendar, List, Clock, Filter } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { mockAppointments } from '@assets/mockData';

@Component({
  selector: 'app-appointments',
  imports: [CommonModule,LucideAngularModule,BadgeComponent, CardComponent, CalendarComponent, ButtonComponent, AppTabsContentComponent, AppTabsTriggerComponent, AppTabsListComponent, AppTabsComponent, SelectItemComponent, SelectContentComponent, SelectTriggerComponent, SelectValueComponent, SelectComponent],
  standalone:true,
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments {
  readonly Calendar = Calendar
  readonly List = List
  readonly Clock = Clock
  readonly Filter = Filter

  @Input() onNavigate?: (page: string) => void;

  // local state
  date: Date | undefined = new Date();
  view: 'list' | 'calendar' = 'list';

  mockAppointments = mockAppointments;

  setView(v: 'list' | 'calendar') {
    this.view = v;
  }

  setDate(d?: Date) {
    this.date = d;
  }

  formatDateLong(d: string) {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  navigate(page: string) {
    this.onNavigate?.(page);
  }

  get confirmedAppointments() {
    return this.mockAppointments.filter(a => a.status === 'confirmed');
  }
  get pendingAppointments() {
    return this.mockAppointments.filter(a => a.status === 'confirmed');
  }
  get completedAppointments() {
    return this.mockAppointments.filter(a => a.status === 'confirmed');
  }
}
