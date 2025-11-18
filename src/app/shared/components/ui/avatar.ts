import {
  Component,
  computed,
  forwardRef,
  inject,
  Input,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@utils/cn.util';

// --- Root Avatar Component ---
// (Provides state and DI for children)

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [],
  template: `
    <span data-slot="avatar" [class]="hostClasses()">
      <ng-content></ng-content>
    </span>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  // Provide this component instance to all children
  providers: [
    { provide: AvatarComponent, useExisting: forwardRef(() => AvatarComponent) },
  ],
})
export class AvatarComponent {
  @Input() customClasses: string | undefined;

  protected hostClasses = computed(() =>
    cn(
      'relative flex size-10 shrink-0 overflow-hidden rounded-full',
      this.customClasses,
    ),
  );

  /**
   * Shared state for children components.
   * - 'loading': Initial state, or when src changes.
   * - 'loaded': Image successfully loaded.
   * - 'error': Image failed to load.
   */
  imageStatus = signal<'loading' | 'loaded' | 'error'>('loading');
}

// --- Avatar Image Component ---
// (Renders the image and updates parent state)

@Component({
  selector: 'app-avatar-image',
  standalone: true,
  imports: [CommonModule], // For @if
  template: `
    @if (avatar.imageStatus() !== 'error') {
      <img
        data-slot="avatar-image"
        [src]="src"
        [alt]="alt"
        [class]="hostClasses()"
        (load)="onLoad()"
        (error)="onError()"
      />
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class AvatarImageComponent implements OnChanges {
  @Input({ required: true }) src: string = '';
  @Input() alt: string = 'Avatar';
  @Input() customClasses: string | undefined;

  protected hostClasses = computed(() =>
    cn('aspect-square size-full', this.customClasses),
  );

  protected avatar = inject(AvatarComponent);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['src'] && !changes['src'].firstChange) {
      this.avatar.imageStatus.set('loading');
    }
  }

  onLoad() {
    this.avatar.imageStatus.set('loaded');
  }

  onError() {
    this.avatar.imageStatus.set('error');
  }
}

// --- Avatar Fallback Component ---
// (Renders only when the image fails)

@Component({
  selector: 'app-avatar-fallback',
  standalone: true,
  imports: [CommonModule], // For @if
  template: `
    @if (avatar.imageStatus() === 'error') {
      <span data-slot="avatar-fallback" [class]="hostClasses()">
        <ng-content></ng-content>
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
})
export class AvatarFallbackComponent {
  @Input() customClasses: string | undefined;

  protected hostClasses = computed(() =>
    cn(
      'bg-muted flex size-full items-center justify-center rounded-full',
      this.customClasses,
    ),
  );

  // Inject the parent AvatarComponent
  protected avatar = inject(AvatarComponent);
}