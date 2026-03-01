import {
  Component,
  Injectable,
  inject,
  computed,
  signal,
  effect,
  Injector,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
  input,
  Renderer2,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { cn } from '@utils/cn.util';

// ---------------------------------------------------------------------
// 🧠 Controller Service - manages open/close state and side
// ---------------------------------------------------------------------
@Injectable()
export class SheetController implements OnDestroy {
  private _destroy$ = new Subject<void>();

  readonly isOpen = signal(false);
  readonly side = signal<'top' | 'right' | 'bottom' | 'left'>('right');

  open(side: 'top' | 'right' | 'bottom' | 'left' = 'right') {
    this.side.set(side);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  toggle(side: 'top' | 'right' | 'bottom' | 'left' = 'right') {
    this.isOpen() ? this.close() : this.open(side);
  }

  ngOnDestroy() {
    this.close();
    this._destroy$.next();
    this._destroy$.complete();
  }
}

// ---------------------------------------------------------------------
// 🧱 Root Component - provides the controller
// ---------------------------------------------------------------------
@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [CommonModule],
  providers: [SheetController],
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetComponent {}

// ---------------------------------------------------------------------
// 🎯 Trigger Component
// ---------------------------------------------------------------------
@Component({
  selector: 'app-sheet-trigger',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="button" data-slot="sheet-trigger" (click)="controller.open(side())">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`:host { display: contents; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetTriggerComponent {
  controller = inject(SheetController);
  side = input<'top' | 'right' | 'bottom' | 'left'>('right');
}

// ---------------------------------------------------------------------
// ❌ Close Component
// ---------------------------------------------------------------------
@Component({
  selector: 'app-sheet-close',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="button" data-slot="sheet-close" (click)="controller.close()">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`:host { display: contents; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetCloseComponent {
  controller = inject(SheetController);
}

// ---------------------------------------------------------------------
// 🪟 Content Component (Native Portal via Renderer2)
// ---------------------------------------------------------------------
@Component({
  selector: 'app-sheet-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #container style="display: none;">
      <div
        #portalRoot
        [style.display]="controller.isOpen() ? 'block' : 'none'"
        [attr.data-state]="controller.isOpen() ? 'open' : 'closed'"
      >
        <div
          data-slot="sheet-overlay"
          [class]="overlayClasses()"
          [attr.data-state]="controller.isOpen() ? 'open' : 'closed'"
          (click)="controller.close()"
        ></div>

        <div
          #contentEl
          data-slot="sheet-content"
          [class]="contentClasses()"
          [attr.data-state]="controller.isOpen() ? 'open' : 'closed'"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
        >
          <ng-content></ng-content>

          <button
            type="button"
            (click)="controller.close()"
            class="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            <span class="sr-only">Close</span>
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetContentComponent implements OnDestroy {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @ViewChild('portalRoot') portalRoot!: ElementRef<HTMLDivElement>;
  @ViewChild('contentEl') contentEl!: ElementRef<HTMLDivElement>;

  controller = inject(SheetController);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private injector = inject(Injector);

  userClass = input<string>('', { alias: 'class' });

  side = input<'top' | 'right' | 'bottom' | 'left'>('right');

  private escapeListener?: () => void;

  protected sheetSide = computed(() => this.controller.side() || this.side());

  protected overlayClasses = computed(() =>
    cn(
      'fixed inset-0 z-50 bg-black/50 transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
    )
  );

  protected contentClasses = computed(() => {
    const side = this.sheetSide();
    return cn(
      'bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out',
      side === 'right' && 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
      side === 'left' && 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
      side === 'top' && 'inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
      side === 'bottom' && 'inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
      this.userClass()
    );
  });

  constructor() {
    effect(
      () => {
        if (this.controller.isOpen()) {
          this.attachToBody();
        } else {
          // Delay detach slightly to allow tailwind close animations to finish (if desired)
          // For immediate closure handling:
          this.detachFromBody();
        }
      },
      { injector: this.injector }
    );
  }

  private attachToBody() {
    setTimeout(() => {
      const root = this.portalRoot?.nativeElement;
      if (!root) return;

      this.renderer.appendChild(this.document.body, root);

      // Scroll locking
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
      this.renderer.setStyle(this.document.body, 'paddingRight', `${scrollBarWidth}px`);

      // Escape key listener
      this.escapeListener = this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.controller.close();
        }
      });

      // Focus management
      setTimeout(() => this.contentEl?.nativeElement.focus(), 50);
    });
  }

  private detachFromBody() {
    const root = this.portalRoot?.nativeElement;
    const container = this.container?.nativeElement;

    if (root && container) {
      this.renderer.appendChild(container, root);
    }

    // Unlock scroll
    this.renderer.removeStyle(this.document.body, 'overflow');
    this.renderer.removeStyle(this.document.body, 'paddingRight');

    if (this.escapeListener) {
      this.escapeListener();
      this.escapeListener = undefined;
    }
  }

  ngOnDestroy() {
    this.detachFromBody();
    this.controller.close();
  }
}

// ---------------------------------------------------------------------
// 🧩 Structural Components (Header, Footer, Title, Description)
// ---------------------------------------------------------------------
@Component({
  selector: 'app-sheet-header',
  standalone: true,
  imports: [CommonModule],
  template: `<div data-slot="sheet-header" [class]="classes()"><ng-content></ng-content></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetHeaderComponent {
  userClass = input<string>('', { alias: 'class' });

  protected classes = computed(() => cn('flex flex-col gap-1.5 p-4', this.userClass()));
}

@Component({
  selector: 'app-sheet-footer',
  standalone: true,
  imports: [CommonModule],
  template: `<div data-slot="sheet-footer" [class]="classes()"><ng-content></ng-content></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetFooterComponent {
  userClass = input<string>('', { alias: 'class' });

  protected classes = computed(() => cn('mt-auto flex flex-col gap-2 p-4', this.userClass()));
}

@Component({
  selector: 'app-sheet-title',
  standalone: true,
  imports: [CommonModule],
  template: `<h3 data-slot="sheet-title" [class]="classes()"><ng-content></ng-content></h3>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetTitleComponent {
  userClass = input<string>('', { alias: 'class' });

  protected classes = computed(() => cn('text-foreground text-lg font-semibold', this.userClass()));
}

@Component({
  selector: 'app-sheet-description',
  standalone: true,
  imports: [CommonModule],
  template: `<p data-slot="sheet-description" [class]="classes()"><ng-content></ng-content></p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetDescriptionComponent {
  userClass = input<string>('', { alias: 'class' });

  protected classes = computed(() => cn('text-muted-foreground text-sm', this.userClass()));
}