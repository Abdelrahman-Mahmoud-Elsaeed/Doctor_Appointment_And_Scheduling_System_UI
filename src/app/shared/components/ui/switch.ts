import { Component, Input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@utils/cn.util';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
    type="button"
    data-slot="switch"
    role="switch"
    [attr.aria-checked]="checked()"
    [attr.data-state]="checked() ? 'checked' : 'unchecked'"
    [disabled]="disabled"
    (click)="toggle()"
    [class]="cn(
      'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      className
    )"
  >
    <span
      data-slot="switch-thumb"
      [attr.data-state]="checked() ? 'checked' : 'unchecked'"
      [class]="cn(
        'bg-card dark:data-[state=unchecked]:bg-card-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0'
      )"
    ></span>
    </button>
  `,
})
export class SwitchComponent {
  @Input() className?: string;
  @Input() disabled = false;

  /**
   * The controlled state of the switch.
   * Supports two-way binding: [(checked)]="mySignal"
   */
  checked = model(false);

  protected readonly cn = cn;

  /**
   * Toggles the state of the switch when clicked.
   */
  protected toggle(): void {
    if (!this.disabled) {
      this.checked.set(!this.checked());
    }
  }
}