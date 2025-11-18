import { Component } from '@angular/core';
import { mockDoctors } from '@assets/mockData';
import { LabelComponent } from "@shared/components/ui/label";
import { ButtonComponent } from "@shared/components/ui/button";
import { CalendarComponent } from "@shared/components/ui/calendar";
import { CardComponent } from "@shared/components/ui/card";
import { BadgeComponent } from "@shared/components/ui/badge";
import { AppTabsContentComponent, AppTabsTriggerComponent, AppTabsListComponent, AppTabsComponent } from "@shared/components/ui/taps";
import { LucideAngularModule, Star, MapPin, Briefcase, GraduationCap, Award, Calendar, Clock } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { TextareaComponent } from "@shared/components/ui/textarea";

@Component({
  selector: 'app-profile',
  imports: [CommonModule, LucideAngularModule, LabelComponent, ButtonComponent, CalendarComponent, CardComponent, BadgeComponent, AppTabsContentComponent, AppTabsTriggerComponent, AppTabsListComponent, AppTabsComponent, TextareaComponent],
  standalone:true,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  readonly Star = Star
  readonly  MapPin =  MapPin
  readonly  Briefcase =  Briefcase
  readonly  GraduationCap =  GraduationCap
  readonly  Award =  Award
  readonly  Calendar =  Calendar
  readonly  Clock =  Clock
  doctorId = '1';
  doctor = mockDoctors.find(d => d.id === this.doctorId) || mockDoctors[0];
  selectedDate = new Date();

  timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  onNavigate(page: string) {
    // Handle navigation logic
    console.log('Navigate to:', page);
  }
}
