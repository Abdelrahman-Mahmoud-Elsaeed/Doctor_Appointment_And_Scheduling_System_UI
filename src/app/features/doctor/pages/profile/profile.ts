import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Camera,
  Mail,
  Phone,
  User,
  MapPin,
  Award,
  GraduationCap,
  Briefcase,
  Star,
  Calendar,
  Clock,
  Users,
  TrendingUp,
} from 'lucide-angular';

// UI Components
import { ButtonComponent } from '@shared/components/ui/button';
import { InputComponent } from '@shared/components/ui/input';
import { LabelComponent } from '@shared/components/ui/label';
import { CardComponent } from '@shared/components/ui/card';
import {
  tabsComponent,
  tabsContentComponent,
  tabsListComponent,
  tabsTriggerComponent,
} from '@shared/components/ui/taps';
import { BadgeComponent } from '@shared/components/ui/badge';
import {
  SelectComponent,
  SelectContentComponent,
  SelectItemComponent,
  SelectTriggerComponent,
  SelectValueComponent,
} from '@shared/components/ui/select';
import { TextareaComponent } from '@shared/components/ui/textarea';
import { CalendarComponent } from '@shared/components/ui/calendar';
import { mockDoctors } from '@assets/mockData';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    LucideAngularModule,
    LabelComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    SelectContentComponent,
    SelectItemComponent,
    SelectTriggerComponent,
    SelectValueComponent,
    CardComponent,
    BadgeComponent,
    tabsContentComponent,
    tabsTriggerComponent,
    tabsListComponent,
    tabsComponent,
    TextareaComponent,
    RouterLink
],
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  readonly Star = Star;
  readonly MapPin = MapPin;
  readonly Briefcase = Briefcase;
  readonly GraduationCap = GraduationCap;
  readonly Award = Award;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Camera = Camera;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly User = User;
  readonly Users = Users;
  readonly TrendingUp = TrendingUp;
  readonly Lock = Lock;
  doctorId = '1';
  doctor = mockDoctors.find((d) => d.id === this.doctorId) || mockDoctors[0];
  selectedDate = new Date();
  activeTab = signal('personal');
  
  readonly specializations = [
    'Cardiologist',
    'Dermatologist',
    'Pediatrician',
    'Neurologist',
    'General Physician',
  ];
  timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
  ];

  onNavigate(page: string) {
    // Handle navigation logic
    console.log('Navigate to:', page);
  }
}
