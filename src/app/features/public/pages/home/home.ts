import { Component, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mockDoctors, specializations, testimonials } from '@assets/mockData';
import { Doctor } from '@core/models/core-models';
import { ButtonComponent } from '@ui/button';
import { CardComponent } from '@ui/card';
import {  BadgeComponent } from '@ui/badge';
import { InputComponent } from '@ui/input';
import { CheckCircle, Clock, LucideAngularModule, Router, Search, Shield, Star, Users } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    LucideAngularModule,
    RouterModule,
    CardComponent,
    BadgeComponent,
    ButtonComponent
],
  
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class Home {
  @Output() navigateTo = new EventEmitter<{ page: string; doctorId?: string }>();
  readonly Search = Search;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly Shield = Shield;
  readonly Users = Users;
  readonly Star = Star;

  public specializations = specializations;
  public testimonials = testimonials;

  public featuredDoctors:Doctor[] = mockDoctors.slice(0, 3);


}
