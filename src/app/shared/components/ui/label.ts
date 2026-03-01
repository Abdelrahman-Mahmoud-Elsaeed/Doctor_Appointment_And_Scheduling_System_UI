import { Component, computed, HostListener, input } from '@angular/core';
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
    @if(hasHtmlFor()){
      <label
        [attr.for]="htmlFor()"
        [class]="hostClasses()"
        [attr.data-slot]="'label'"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </label>
    } @else {
      <span [class]="hostClasses()" [attr.data-slot]="'label'">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </span>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  host: {
    '[attr.for]': 'null',
  },
})
export class LabelComponent {

  htmlFor = input<string >('', { alias: 'for' });

  userClass = input<string>('', { alias: 'class' });

  // --- Computed Classes ---

  protected hostClasses = computed(() =>
    cn(
      'flex items-center gap-2  text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      this.userClass(),
    ),
  );

  protected hasHtmlFor() {
    return this.htmlFor().length > 0;
  }


}