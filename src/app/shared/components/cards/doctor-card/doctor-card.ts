import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LucideAngularModule,Star, MapPin, DollarSign, Clock } from 'lucide-angular';

import { Doctor } from '@core/models/core-models';
import { CardComponent } from '@ui/card';
import {  BadgeComponent } from '@ui/badge';
import { ButtonComponent } from '@ui/button';



@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CardComponent, ButtonComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:"doctor-card.html"
})
export class DoctorCardComponent {
  @Input({ required: true }) doctor!: Doctor;
  @Output() bookNow = new EventEmitter<void>();
  @Output() viewProfile = new EventEmitter<void>();
  
  readonly Star = Star
  readonly MapPin = MapPin
  readonly DollarSign = DollarSign
  readonly Clock = Clock
}