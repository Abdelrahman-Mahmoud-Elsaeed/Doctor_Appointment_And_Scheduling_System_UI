import { Component, computed, signal } from '@angular/core';
import { LucideAngularModule, Mail, Lock, User, Phone,Upload,MapPin, ArrowRight, Shield, CheckCircle2, FileText, Award } from 'lucide-angular';
import { mockPatient } from '@assets/mockData';
import { InputComponent } from "@ui/input";
import { LabelComponent } from "@shared/components/ui/label";
import { CardComponent } from "@shared/components/ui/card";
import { CommonModule } from '@angular/common';
import { SelectComponent, SelectItemComponent, SelectContentComponent, SelectTriggerComponent, SelectValueComponent } from "@shared/components/ui/select";
import { CheckboxComponent } from "@shared/components/ui/checkbox";
import { ButtonComponent } from '@shared/components/ui/button';
import { tabsContentComponent, tabsComponent, tabsTriggerComponent, tabsListComponent } from "@shared/components/ui/taps";
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [CommonModule, LucideAngularModule,RouterLink, InputComponent, ButtonComponent, LabelComponent, CardComponent, SelectComponent, SelectItemComponent, CheckboxComponent, tabsContentComponent, tabsComponent, tabsTriggerComponent, tabsListComponent, SelectContentComponent, SelectTriggerComponent, SelectValueComponent],
  standalone:true,
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
// State for tab control, updated to match your new HTML
  selectedTab = signal('patient');

  // State for password strength logic (preserved)
  password = signal('');
  passwordStrength = signal(0);

  // --- Icon Definitions ---
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly User = User;
  readonly Phone = Phone;
  readonly ArrowRight = ArrowRight;
  readonly Shield = Shield;
  readonly CheckCircle2 = CheckCircle2;
  readonly FileText = FileText;
  readonly Award = Award;
  readonly Upload = Upload
  readonly MapPin = MapPin
  // --- Password Strength Computations (Preserved) ---
  passwordStrengthText = computed(() => {
    const strength = this.passwordStrength();
    if (strength <= 1) return 'Weak';
    if (strength <= 2) return 'Fair';
    if (strength <= 3) return 'Good';
    return 'Strong';
  });

  passwordStrengthColor = computed(() => {
    const strength = this.passwordStrength();
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  });

  passwordStrengthWidth = computed(() => {
    return `${(this.passwordStrength() / 5) * 100}%`;
  });

  // --- Password Requirement Computations (Preserved) ---
  hasMinLength = computed(() => this.password().length >= 8);
  hasUpperLower = computed(() => /[A-Z]/.test(this.password()) && /[a-z]/.test(this.password()));
  hasNumber = computed(() => /[0-9]/.test(this.password()));



  /**
   * Handles the input event from the password field
   * @param event The DOM event
   */
  onPasswordChange(event: Event): void {
    const pwd = (event.target as HTMLInputElement).value;
    this.password.set(pwd);
    this.passwordStrength.set(this.calculatePasswordStrength(pwd));
  }

  /**
   * Pure function to calculate password strength score
   * @param pwd The password string
   * @returns A strength score (0-5)
   */
  private calculatePasswordStrength(pwd: string): number {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  }
}
