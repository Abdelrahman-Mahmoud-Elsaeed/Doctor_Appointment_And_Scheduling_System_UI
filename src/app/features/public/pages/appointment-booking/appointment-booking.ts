import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Calendar, Clock, Video, MapPin, FileText, ArrowLeft, CheckCircle } from 'lucide-angular';
import { mockDoctors } from '@assets/mockData';
import { ButtonComponent } from '@ui/button';
import { CardComponent } from '@ui/card';
import { BadgeComponent } from '@ui/badge';

interface AppointmentType {
  id: string;
  label: string;
  icon: any;
  price: number;
}
@Component({
  selector: 'app-appointment-booking',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ButtonComponent,
    CardComponent,
    BadgeComponent,
    RouterLink
],
  templateUrl: './appointment-booking.html',
  styleUrl: './appointment-booking.scss',
})
export class AppointmentBooking {
  doctorId:string;
  doctor: any;
  constructor(private router:Router,private route: ActivatedRoute) {
    this.doctorId = this.route.snapshot.paramMap.get('id')!;
    this.doctor = mockDoctors.find(d => d.id === this.doctorId) || mockDoctors[0];
  }



  // Icons for template usage
  readonly icons = { Calendar, Clock, Video, MapPin, FileText, ArrowLeft, CheckCircle };

  // Constants
  readonly timeSlots = {
    morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    afternoon: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'],
    evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM']
  };

  readonly appointmentTypes: AppointmentType[] = [
    { id: 'in-person', label: 'In-Person Visit', icon: MapPin, price: 50 },
    { id: 'video', label: 'Video Consultation', icon: Video, price: 40 }
  ];

  // State Signals
  selectedDate = signal<string>('');
  selectedTime = signal<string>('');
  appointmentType = signal<string>('in-person');
  notes = signal<string>('');
  showConfirmation = signal<boolean>(false);
  
  // Date Logic
  dates = signal<Date[]>([]);



  // Computed Price (Helper)
  selectedTypePrice = computed(() => {
    return this.appointmentTypes.find(t => t.id === this.appointmentType())?.price;
  });

  ngOnInit() {
    this.generateDates();
  }

  generateDates() {
    const next14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });
    this.dates.set(next14Days);
  }

  handleBooking() {
    if (this.selectedDate() && this.selectedTime() && this.appointmentType()) {
      this.showConfirmation.set(true);
    }
  }


  // Date Formatting Helpers for Template
  getDateStr(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getDayStr(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
}
