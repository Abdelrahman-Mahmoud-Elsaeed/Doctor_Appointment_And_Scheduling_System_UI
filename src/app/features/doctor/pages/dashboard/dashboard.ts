import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardComponent } from "@shared/components/ui/card";
import { BadgeComponent } from "@shared/components/ui/badge";
import { ButtonComponent } from "@shared/components/ui/button";
import { StatsCardComponent } from "@shared/components/cards/stats-card/stats-card";
import { mockAppointments,mockDashboardStats } from '@assets/mockData';
import { LucideAngularModule,ArrowRight,Clock,User,Calendar } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,LucideAngularModule, CardComponent, BadgeComponent, ButtonComponent, StatsCardComponent],
  standalone:true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  @Input() onNavigate?: (page: string) => void;
  readonly ArrowRight = ArrowRight
  readonly Clock = Clock
  readonly User = User
  readonly Calendar = Calendar
  todaysAppointments = mockAppointments.slice(0, 2);
  upcomingAppointments = mockAppointments.slice(0, 5);
  mockDashboardStats = mockDashboardStats
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  viewPage(page: string) {
    this.onNavigate?.(page);
  }
}
