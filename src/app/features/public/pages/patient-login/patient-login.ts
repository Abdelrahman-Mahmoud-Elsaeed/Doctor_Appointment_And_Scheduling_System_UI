import { Component, signal } from '@angular/core';
import { CardComponent } from "@shared/components/ui/card";
import { LabelComponent } from "@shared/components/ui/label";
import { InputComponent } from "@shared/components/ui/input";
import { CheckboxComponent } from "@shared/components/ui/checkbox";
import { ButtonComponent } from "@shared/components/ui/button";
import { LucideAngularModule,ArrowRight, Mail,Lock } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterModule,LucideAngularModule,CardComponent, LabelComponent, InputComponent, CheckboxComponent, ButtonComponent],
  standalone:true,
  templateUrl: './patient-login.html',
  styleUrl: './patient-login.scss',
})
export class PatientLogin {
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly ArrowRight = ArrowRight;

  // Mock state for demonstration
  email = signal('');
  password = signal('');
  rememberMe = signal(false);

}
