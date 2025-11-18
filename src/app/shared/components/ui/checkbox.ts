import {
  Component,
  computed,
  Input,
  Output,
  EventEmitter,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Check, Minus } from 'lucide-angular';
import { cn } from '@utils/cn.util';

// --- Checkbox Component ---

@Component({
  selector: 'app-checkbox',
  standalone: true,
  // Now imports the provided LucideAngularModule
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      data-slot="checkbox"
      role="checkbox"
      [type]="'button'"
      [aria-checked]="isCheckedOrIndeterminate()"
      [attr.data-state]="dataState()"
      [disabled]="disabled"
      [class]="hostClasses()"
      (click)="toggle()"
      [id]="id"
    >
      @if (isCheckedOrIndeterminate() !== false) {
        <span data-slot="checkbox-indicator" [class]="indicatorClasses()">
          @if (isCheckedOrIndeterminate() === true) {
            <lucide-icon [img]="Check" class="size-3.5"></lucide-icon>
          } @else if (isCheckedOrIndeterminate() === 'indeterminate') {
            <lucide-icon [img]="Minus" class="size-3.5"></lucide-icon>
          }
        </span>
      }
    </button>
  `,
  styles: [
    `
      /* Ensures the component itself doesn't wrap the button */
      :host {
        display: contents;
      }
    `,
  ],
})
export class CheckboxComponent {
  // --- Icon Imports for Template Use ---
  // Must be readonly properties on the class to be accessible in the template
  protected readonly Check = Check;
  protected readonly Minus = Minus;

  // --- Inputs & Outputs ---

  /**
   * Represents the checked state. Can be 'true', 'false', or 'indeterminate'.
   */
  @Input() set checked(
    value: boolean | 'indeterminate' | undefined,
  ) {
    this._checked.set(value === true ? true : value === 'indeterminate' ? 'indeterminate' : false);
  }

  /**
   * Disables the checkbox.
   */
  @Input() disabled: boolean | string  = false;

  /**
   * Optional custom classes to merge with the checkbox styles.
   */
  @Input() customClasses: string | undefined;

  /**
   * Event emitted when the checkbox is toggled by user interaction.
   * Emits 'true' for checked, 'false' for unchecked. It never emits 'indeterminate'.
   */
  @Input() id:string = ''
  @Output() checkedChange = new EventEmitter<boolean>();

  // --- Internal State (Signals) ---

  // Private signal mirroring the input state
  private _checked = signal<boolean | 'indeterminate'>(false);

  // Expose state as a computed signal for template and class logic
  protected isCheckedOrIndeterminate = computed(() => this._checked());

  // Computed data attribute for Tailwind class logic (used in the template's [attr.data-state])
  protected dataState = computed(() =>
    this._checked() === true ? 'checked' : this._checked() === 'indeterminate' ? 'indeterminate' : 'unchecked',
  );

  // Computed classes for the host button element
  protected hostClasses = computed(() =>
    cn(
      'peer border bg-input-background dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      this.customClasses,
    ),
  );

  // Computed classes for the inner indicator span
  protected indicatorClasses = computed(() =>
    cn('flex items-center justify-center text-current transition-none'),
  );

  // --- Logic ---

  /**
   * Handles the click event to toggle the state.
   */
  toggle(): void {
    if (this.disabled) {
      return;
    }

    const currentState = this._checked();
    let newState: boolean;

    if (currentState === 'indeterminate' || currentState === false) {
      // Toggle to checked (true)
      newState = true;
    } else {
      // Toggle to unchecked (false)
      newState = false;
    }

    this._checked.set(newState);
    this.checkedChange.emit(newState);
  }
}