import { Component, computed, signal } from '@angular/core';
import { CardComponent } from "@shared/components/ui/card";
import { ButtonComponent } from "@shared/components/ui/button";
import { SelectItemComponent, SelectContentComponent, SelectValueComponent, SelectTriggerComponent, SelectComponent } from "@shared/components/ui/select";
import { LabelComponent } from "@shared/components/ui/label";
import { InputComponent } from "@shared/components/ui/input";
import { LucideAngularModule, Plus, Trash2, Clock, DollarSign, Calendar } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { SwitchComponent } from "@shared/components/ui/switch";

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  id: string;
  label: string;
  enabled: boolean;
  slots: TimeSlot[];
}
interface ScheduleSettings {
  sessionDuration: number;
  inPersonFee: number;
  videoFee: number;   
  bufferTime: number;
  maxAppointments: number;
}

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
  settings = signal<ScheduleSettings>({
    sessionDuration: 30,
    inPersonFee: 150, 
    videoFee: 100,     
    bufferTime: 10,
    maxAppointments: 12
  });

  timeSlotsOptions = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  weekSchedule = signal<DaySchedule[]>([
    { id: 'monday', label: 'Monday', enabled: true, slots: [{ start: '9:00 AM', end: '5:00 PM' }] },
    { id: 'tuesday', label: 'Tuesday', enabled: true, slots: [{ start: '9:00 AM', end: '5:00 PM' }] },
    { id: 'wednesday', label: 'Wednesday', enabled: true, slots: [{ start: '9:00 AM', end: '5:00 PM' }] },
    { id: 'thursday', label: 'Thursday', enabled: true, slots: [{ start: '9:00 AM', end: '5:00 PM' }] },
    { id: 'friday', label: 'Friday', enabled: true, slots: [{ start: '9:00 AM', end: '5:00 PM' }] },
    { id: 'saturday', label: 'Saturday', enabled: true, slots: [{ start: '9:00 AM', end: '1:00 PM' }] },
    { id: 'sunday', label: 'Sunday', enabled: false, slots: [{ start: '9:00 AM', end: '5:00 PM' }] },
  ]);

  breaks = signal([
    { id: 1, label: 'Lunch Break', time: '12:00 PM - 1:00 PM' }
  ]);

  timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const period = i < 12 ? 'AM' : 'PM';
    return `${hour}:00 ${period}`;
  });

  workingDaysCount = computed(() => {
    return this.weekSchedule().filter(day => day.enabled).length;
  });

  dailyCapacity = computed(() => {
    const { sessionDuration, bufferTime, maxAppointments } = this.settings();
    const totalMinutesPerSession = sessionDuration + bufferTime;
    const averageWorkingMinutes = 420; 
    const calculatedSlots = Math.floor(averageWorkingMinutes / totalMinutesPerSession);
    return Math.min(calculatedSlots, maxAppointments);
  });

  formattedSessionDuration = computed(() => {
    const duration = this.settings().sessionDuration;
    if (duration === 60) return '1 hour';
    if (duration === 90) return '1.5 hours';
    if (duration === 120) return '2 hours';
    return `${duration} minutes`;
  });
  weeklyCapacity = computed(() => {
    return this.dailyCapacity() * this.workingDaysCount();
  });

  // --- Actions ---

updateSetting(key: keyof ScheduleSettings, eventOrValue: Event | string | null) {
    let numericValue = 0; 

    if (eventOrValue === null) {
      numericValue = 0; 
    } 
    else if (typeof eventOrValue === 'string') {
      numericValue = Number(eventOrValue);
    } 
    else if ('target' in eventOrValue) {
      const target = eventOrValue.target as HTMLInputElement;
      numericValue = Number(target?.value || 0);
    }

    this.settings.update(s => ({ ...s, [key]: numericValue }));
  }

  toggleDay(dayId: string, enabled: boolean) {
    this.weekSchedule.update(days => 
      days.map(d => d.id === dayId ? { ...d, enabled } : d)
    );
  }

  addSplitShift(dayId: string) {
    this.weekSchedule.update(days => 
      days.map(d => {
        if (d.id === dayId) {
          return { ...d, slots: [...d.slots, { start: '1:00 PM', end: '5:00 PM' }] };
        }
        return d;
      })
    );
  }

  removeTimeSlot(dayId: string, slotIndex: number) {
    this.weekSchedule.update(days => 
      days.map(d => {
        if (d.id === dayId) {
          const newSlots = [...d.slots];
          newSlots.splice(slotIndex, 1);
          return { ...d, slots: newSlots };
        }
        return d;
      })
    );
  }

  updateTimeSlot(dayId: string, slotIndex: number, field: 'start' | 'end', value: string | null) {
    const safeValue = value ?? '';
    this.weekSchedule.update(days => 
      days.map(d => {
        if (d.id === dayId) {
          const newSlots = [...d.slots];
          newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: safeValue };
          return { ...d, slots: newSlots };
        }
        return d;
      })
    );
  }

  copyToAllDays() {
    const mondaySlots = this.weekSchedule().find(d => d.id === 'monday')?.slots || [];
    this.weekSchedule.update(days => 
      days.map(d => d.id !== 'sunday' ? { ...d, slots: JSON.parse(JSON.stringify(mondaySlots)) } : d)
    );
  }
}
