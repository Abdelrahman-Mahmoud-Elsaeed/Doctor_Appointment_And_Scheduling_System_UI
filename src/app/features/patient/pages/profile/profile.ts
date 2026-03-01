import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// UI primitives (adjust paths if needed)
import { ButtonComponent } from '@ui/button'; // adjust path / exports
import { InputComponent } from '@ui/input';
import { LabelComponent } from '@ui/label';
import { CardComponent } from '@ui/card';
import {
  tabsComponent, tabsListComponent,
  tabsTriggerComponent,
  tabsContentComponent
} from '@ui/taps';
import {
  SelectComponent, SelectTriggerComponent,
  SelectContentComponent,
  SelectItemComponent,
  SelectValueComponent
} from '@ui/select';

import { mockPatient } from '@assets/mockData';

// lucide icon provider
import { LucideAngularModule, Camera, Mail, Phone, User, Calendar, MapPin } from 'lucide-angular';
@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ButtonComponent,
    InputComponent,
    LabelComponent,
    CardComponent,
    tabsComponent,
    tabsListComponent,
    tabsTriggerComponent,
    tabsContentComponent,
    SelectComponent,
    SelectTriggerComponent,
    SelectContentComponent,
    SelectItemComponent,
    SelectValueComponent,
    LucideAngularModule
  ],
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  @Input() onNavigate?: (page: string) => void;

  protected readonly Camera = Camera;
  protected readonly Mail = Mail;
  protected readonly Phone = Phone;
  protected readonly User = User;
  protected readonly Calendar = Calendar;
  protected readonly MapPin = MapPin;

  // mock data import
  mockPatient = mockPatient;
  selctedGender = signal<string|null>(mockPatient.gender.toLowerCase());
  selectedBloodType = signal<string | null>('o-positive')
  // small helpers you might want to wire up later
  onChangeAvatar() {
    // wire your avatar flow here (open modal / file input)
    console.log('change avatar clicked');
  }
}
