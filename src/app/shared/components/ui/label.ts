import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@utils/cn.util';

// --- Label Component ---

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label
      [attr.data-slot]="'label'"
      [attr.for]="htmlFor()"
      [class]="hostClasses()"
    >
      <ng-content></ng-content>
    </label>
  `,
  styles: [
    `
      /* Ensures the component itself doesn't wrap the label */
      :host {
        display: contents;
      }
    `,
  ],
})
export class LabelComponent {
  // --- Inputs ---

  /**
   * The ID of the form element this label is associated with.
   * Maps to the HTML 'for' attribute.
   */
  htmlFor = input<string >('', { alias: 'for' });

  /**
   * Optional custom classes to merge with the label styles.
   * Replaces the \`className\` prop from React.
   */
  customClasses = input<string | undefined>();

  // --- Computed Classes ---

  protected hostClasses = computed(() =>
    cn(
      'flex items-center gap-2  text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      this.customClasses(),
    ),
  );
}