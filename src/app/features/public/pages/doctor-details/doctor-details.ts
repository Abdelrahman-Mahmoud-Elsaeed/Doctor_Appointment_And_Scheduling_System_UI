import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mockDoctors } from '@assets/mockData';
import { BadgeComponent } from '@shared/components/ui/badge';
import { ButtonComponent } from '@shared/components/ui/button';
import { CalendarComponent } from '@shared/components/ui/calendar';
import { CardComponent } from '@shared/components/ui/card';
import { LabelComponent } from '@shared/components/ui/label';
import { AppTabsComponent, AppTabsContentComponent, AppTabsListComponent, AppTabsTriggerComponent } from '@shared/components/ui/taps';
import { TextareaComponent } from '@shared/components/ui/textarea';
import { LucideAngularModule , Star, MapPin,Briefcase,GraduationCap,Award,Calendar,Clock } from 'lucide-angular';
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  selector: 'app-doctor-details',
  imports: [CommonModule, LucideAngularModule, LabelComponent, ButtonComponent, CalendarComponent, CardComponent, BadgeComponent, AppTabsContentComponent, AppTabsTriggerComponent, AppTabsListComponent, AppTabsComponent, TextareaComponent, RouterLink],
  standalone:true,
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.scss',
})
export class DoctorDetails {
  doctorId:string;
  doctor: any ;
  constructor(private route: ActivatedRoute) {
    this.doctorId = this.route.snapshot.paramMap.get('id')!;
    this.doctor = mockDoctors.find(d => d.id === this.doctorId) || mockDoctors[0];
  }

  readonly Star = Star
  readonly  MapPin =  MapPin
  readonly  Briefcase =  Briefcase
  readonly  GraduationCap =  GraduationCap
  readonly  Award =  Award
  readonly  Calendar =  Calendar
  readonly  Clock =  Clock
  selectedDate = new Date();

  timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];


}
