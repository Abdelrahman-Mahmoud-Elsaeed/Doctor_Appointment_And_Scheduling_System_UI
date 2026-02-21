import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrowLeft, Calendar, Clock, MapPin, Video, Phone, Mail, User, FileText, CheckCircle, XCircle, LucideAngularModule } from 'lucide-angular';
import { CardComponent } from "@shared/components/ui/card";
import { BadgeComponent } from "@shared/components/ui/badge";
import { tabsComponent, tabsListComponent, tabsTriggerComponent, tabsContentComponent } from "@shared/components/ui/taps";
import { ButtonComponent } from "@shared/components/ui/button";

const MOCK_APPOINTMENT_DETAILS = {
  id: '1',
  patient: {
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@email.com',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts']
  },
  appointment: {
    date: 'Feb 25, 2026',
    time: '10:00 AM',
    type: 'In-Person Visit',
    status: 'confirmed',
    duration: '30 minutes',
    location: 'Main Street Medical Center, Room 205'
  },
  reason: 'Follow-up consultation for hypertension management. Patient reports occasional headaches and dizziness.',
  notes: 'Patient is on current medication: Lisinopril 10mg daily. Last BP reading was 145/90.',
  medicalHistory: [
    { condition: 'Hypertension', diagnosedDate: 'Jan 2024', status: 'Ongoing' },
    { condition: 'Type 2 Diabetes', diagnosedDate: 'Mar 2023', status: 'Managed' },
    { condition: 'High Cholesterol', diagnosedDate: 'Jun 2022', status: 'Controlled' }
  ],
  previousVisits: [
    { date: 'Jan 15, 2026', reason: 'Routine checkup', notes: 'BP: 140/85, Patient stable' },
    { date: 'Dec 10, 2025', reason: 'Blood pressure monitoring', notes: 'Adjusted medication dosage' },
    { date: 'Nov 5, 2025', reason: 'Initial consultation', notes: 'Prescribed Lisinopril' }
  ]
};

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CardComponent, BadgeComponent, tabsComponent, tabsListComponent, tabsTriggerComponent, tabsContentComponent, ButtonComponent],
  templateUrl: './appointment-details.html'
})
export class AppointmentDetails {
  // Modern Signal Inputs and Outputs
  appointmentId = input<string>();
  navigate = output<{page: string, id?: string}>();

  // State
  details = signal(MOCK_APPOINTMENT_DETAILS);

  // Icons
  ArrowLeftIcon = ArrowLeft;
  CalendarIcon = Calendar;
  ClockIcon = Clock;
  MapPinIcon = MapPin;
  VideoIcon = Video;
  PhoneIcon = Phone;
  MailIcon = Mail;
  UserIcon = User;
  FileTextIcon = FileText;
  CheckCircleIcon = CheckCircle;
  XCircleIcon = XCircle;

  goBack() {
    this.navigate.emit({ page: 'doctor-appointments' });
  }

  handleConfirm() {
    console.log('Appointment confirmed');
  }

  handleComplete() {
    console.log('Appointment completed');
  }

  handleCancel() {
    console.log('Appointment cancelled');
  }

  getStatusBadgeClass(status: string): string {
    if (status === 'confirmed') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  }
}