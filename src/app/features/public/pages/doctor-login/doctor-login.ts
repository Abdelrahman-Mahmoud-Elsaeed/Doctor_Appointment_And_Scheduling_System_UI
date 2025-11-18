import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '@ui/button';
import { LucideAngularModule, Mail, Lock, ArrowRight, Shield, Stethoscope, Calendar, Users } from 'lucide-angular';
import { InputComponent } from "@ui/input";
import { LabelComponent } from "@ui/label";
import { CheckboxComponent } from "@ui/checkbox";
import { CardComponent } from "@ui/card";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-doctor-login',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent, InputComponent, LabelComponent, CheckboxComponent, CardComponent, RouterLink],
  templateUrl: './doctor-login.html',
  styleUrls: ['./doctor-login.scss']
})
export class DoctorLogin implements OnInit {

  readonly Mail = Mail
  readonly Lock = Lock
  readonly ArrowRight = ArrowRight
  readonly Shield = Shield
  readonly Stethoscope = Stethoscope
  readonly Calendar = Calendar
  readonly Users = Users
  constructor() { }

  ngOnInit() {
  }

}
