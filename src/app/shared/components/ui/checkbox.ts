import {
  Component,
  computed,
  Input,
  Output,
  EventEmitter,
  signal,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@utils/cn.util';

// --- Checkbox Component ---

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      data-slot="checkbox"
      role="checkbox"
      [type]="'button'"
      [aria-checked]="isCheckedOrIndeterminate()"
      [attr.data-state]="dataState()"
      [disabled]="disabled()"
      [class]="hostClasses()"
      (click)="toggle()"
      [id]="id()"
    >
      @if (isCheckedOrIndeterminate() !== false) {
        <span data-slot="checkbox-indicator" [class]="indicatorClasses()">
          @if (isCheckedOrIndeterminate() === true) {
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5"><path d="M20 6 9 17l-5-5"/></svg>
          } @else if (isCheckedOrIndeterminate() === 'indeterminate') {
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5"><path d="M5 12h14"/></svg>
          }
        </span>
      }
    </button>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  host: {
    '[attr.id]': 'null',
  },
})
export class CheckboxComponent {


  @Input() set checked(
    value: boolean | 'indeterminate' | undefined,
  ) {
    this._checked.set(value === true ? true : value === 'indeterminate' ? 'indeterminate' : false);
  }

  disabled = input<string>('', { alias: 'disabled' });


  userClass = input<string>('', { alias: 'class' });

  id = input<string>('', { alias: 'id' });

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
      this.userClass(),
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
    if (this.disabled()) {
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