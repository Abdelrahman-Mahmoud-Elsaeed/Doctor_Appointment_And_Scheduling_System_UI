import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@utils/cn.util';

// --- Input Component ---

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input
      [type]="type()"
      [attr.data-slot]="'input'"
      [disabled]="disabled()"
      [placeholder]="placeholder()"
      [value]="value()"
      [name]="name()"
      [id]="id()"
      [class]="hostClasses()"
    />
  `,
  styles: [
    `
      /*
        By default, Angular components are 'display: inline'.
        We allow the native input to define its own display properties.
      */
    `,
  ],
  // Use ViewEncapsulation.None to ensure complex Tailwind selectors (like file:...)
  // apply correctly to the native input element.
  
})
export class InputComponent {
  // --- Inputs ---

  /**
   * The type of the input (e.g., 'text', 'password', 'email', 'file').
   * Maps directly to the HTML 'type' attribute.
   * @default 'text'
   */
  type = input<'text' | 'email' | 'password' | 'file' | string>('text');

  /**
   * Optional custom classes to merge with the input styles.
   * Replaces the \`className\` prop from React.
   */
  customClasses = input<string | undefined>();

  // Standard input attributes bound for completeness
  placeholder = input<string | undefined>('');
  disabled = input<boolean | string>(false);
  value = input<string | number | null >('');
  name = input<string | undefined>();
  id = input<string | undefined>('');

  // --- Computed Classes ---

  protected hostClasses = computed(() =>
    cn(
      // Base and styling classes
      'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',

      // Focus visibility classes
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',

      // ARIA invalid state classes
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',

      // Custom classes passed by the consumer
      this.customClasses(),
    ),
  );
}