import { Component } from '@angular/core';
import { CardComponent } from "@shared/components/ui/card";
import { ButtonComponent } from "@shared/components/ui/button";
import { SelectItemComponent, SelectContentComponent, SelectValueComponent, SelectTriggerComponent, SelectComponent } from "@shared/components/ui/select";
import { LabelComponent } from "@shared/components/ui/label";
import { InputComponent } from "@shared/components/ui/input";
import { LucideAngularModule, Plus, Trash2, Clock, DollarSign, Calendar } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { SwitchComponent } from "@shared/components/ui/switch";

@Component({
  selector: 'app-schedule',
  imports: [CommonModule, LucideAngularModule, CardComponent, ButtonComponent, SelectItemComponent, SelectContentComponent, SelectValueComponent, SelectTriggerComponent, SelectComponent, LabelComponent, InputComponent, SwitchComponent],
  standalone:true,
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
})
export class Schedule {
  readonly Plus =Plus
  readonly  Trash2 = Trash2
  readonly Clock =Clock
  readonly DollarSign =DollarSign
  readonly Calendar =Calendar 

  weekDays = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
  ];

  timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const period = i < 12 ? 'AM' : 'PM';
    return `${hour}:00 ${period}`;
  });
}
