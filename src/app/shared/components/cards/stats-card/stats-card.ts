import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  CardComponent } from '@ui/card';
import {LucideAngularModule,Calendar, Clock, Users, TrendingUp } from 'lucide-angular';



@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule,  LucideAngularModule, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:"stats-card.html"
})

export class StatsCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: number;
  @Input({ required: true }) icon!: string;

  /**
   * Determines the background and text color classes based on the icon.
   * @param icon The icon identifier string.
   * @returns Tailwind CSS classes for background and text.
   */
  getBgColor(icon: string): string {
    const colorMap: Record<string, string> = {
      'calendar': 'bg-blue-100 text-blue-600',
      'clock': 'bg-green-100 text-green-600',
      'users': 'bg-purple-100 text-purple-600',
      'trending-up': 'bg-orange-100 text-orange-600'
    };
    return colorMap[icon] || 'bg-gray-100 text-gray-600';
  }


  readonly Calendar = Calendar
  readonly Clock = Clock
  readonly Users = Users
  readonly TrendingUp = TrendingUp
}