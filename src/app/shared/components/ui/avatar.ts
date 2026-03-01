import {
  Component,
  computed,
  inject,
  input,
  signal,
  effect,
} from '@angular/core';
import { cn } from '@utils/cn.util';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <span 
      data-slot="avatar" 
      [class]="hostClasses()">
      <ng-content></ng-content>
    </span>
  `,
  styles: [':host { display: contents; }'],
})
export class AvatarComponent {
  userClass = input<string>('', { alias: 'class' });

  protected hostClasses = computed(() =>
    cn(
      'relative flex size-10 shrink-0 overflow-hidden rounded-full',
      this.userClass(),
    ),
  );

  imageStatus = signal<'loading' | 'loaded' | 'error'>('loading');
}


@Component({
  selector: 'app-avatar-image',
  standalone: true,
  template: `
    @if (avatar.imageStatus() !== 'error') {
      <img
        data-slot="avatar-image"
        [src]="src()"
        [alt]="alt()"
        [class]="hostClasses()"
        (load)="onLoad()"
        (error)="onError()"
      />
    }
  `,
  styles: [':host { display: contents; }'],
})
export class AvatarImageComponent {
  src = input.required<string>({ alias: 'src' });
  alt = input<string>('Avatar', { alias: 'alt' });
  
  userClass = input<string>('', { alias: 'class' });

  protected avatar = inject(AvatarComponent);

  protected hostClasses = computed(() =>
    cn(
      'aspect-square size-full object-cover',
      this.userClass()     
    ),
  );

  constructor() {
    effect(() => {
      this.src();
      this.avatar.imageStatus.set('loading');
    }, { allowSignalWrites: true });
  }

  onLoad() {
    this.avatar.imageStatus.set('loaded');
  }

  onError() {
    this.avatar.imageStatus.set('error');
  }
}


// --- 3. Avatar Fallback Component ---
@Component({
  selector: 'app-avatar-fallback',
  standalone: true,
  template: `
    @if (avatar.imageStatus() === 'error') {
      <span data-slot="avatar-fallback" [class]="hostClasses()">
        <ng-content></ng-content>
      </span>
    }
  `,
  styles: [':host { display: contents; }'],
})
export class AvatarFallbackComponent {
  userClass = input<string>('', { alias: 'class' });

  protected avatar = inject(AvatarComponent);

  protected hostClasses = computed(() =>
    cn(
      'bg-muted flex size-full items-center justify-center rounded-full',
      this.avatar.userClass(), 
      this.userClass()
    ),
  );
}