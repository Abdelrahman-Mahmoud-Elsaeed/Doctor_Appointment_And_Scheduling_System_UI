import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@utils/cn.util';

// --- Label Component ---

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
    <ng-container *ngIf="hasHtmlFor(); else spanOnly">
      <label
        [attr.for]="htmlFor()"
        [class]="hostClasses()"
        [attr.data-slot]="'label'"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </label>
    </ng-container>

    <ng-template #spanOnly>
      <span [class]="hostClasses()" [attr.data-slot]="'label'">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </span>
    </ng-template>
  `,
  styles: [
    `
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

  customClasses = input<string | undefined>();

  // --- Computed Classes ---

  protected hostClasses = computed(() =>
    cn(
      'flex items-center gap-2  text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      this.customClasses(),
    ),
  );

  protected hasHtmlFor() {
    return this.htmlFor().length > 0;
  }
}