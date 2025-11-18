import {
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Injectable,
  input, // Changed from @Input
  Output,
  signal,
  ViewChild,
  ViewEncapsulation,
  Renderer2,
  OnDestroy,
  Injector,
  AfterViewInit,
  DestroyRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { LucideAngularModule, Check, ChevronDown, ChevronUp } from 'lucide-angular';
import { cn } from '@utils/cn.util';

// --- DI CONTROLLER SERVICE ---
// (Refactored to accept HTMLElement)

@Injectable()
export class SelectController {
  // Current state of the select
  isOpen = signal(false);
  selectedValue = signal<string | null>(null);
  selectedLabel = signal<string | null>(null);
  disabled = signal(false);
  placeholder = signal<string | undefined>(undefined);

  // References to communicate with the parent overlay
  overlayRef: OverlayRef | null = null;
  // FIX: Accept HTMLElement directly, it's more robust
  triggerElementRef = signal<HTMLElement | null>(null);

  // Outputs
  valueChange = new EventEmitter<string | null>();

  constructor(
    private overlay: Overlay,
    private destroyRef: DestroyRef
  ) {
    // Ensure overlay is closed when controller is destroyed
    destroyRef.onDestroy(() => this.close());
  }

  // FIX: Accept HTMLElement
  toggle(triggerEl: HTMLElement) {
    if (this.disabled()) return;

    if (this.isOpen()) {
      this.close();
    } else {

      this.open(triggerEl);
    }
  }

  // FIX: Accept HTMLElement
  open(triggerEl: HTMLElement) {
    if (this.isOpen() || this.disabled()) return;
    this.triggerElementRef.set(triggerEl);
    this.isOpen.set(true);
  }

  close() {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    this.triggerElementRef.set(null);
  }

  selectItem(value: string, label: string) {
    this.selectedValue.set(value);
    this.selectedLabel.set(label);
    this.valueChange.emit(value);
    this.close();
  }
}

// --- 1. Select Root Component ---
// (Refactored to use signal inputs)

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [], // Root component doesn't need CommonModule
  template: `<ng-content></ng-content>`,
  styles: [':host { display: contents; }'],
  providers: [SelectController],
})
export class SelectComponent {
  controller = inject(SelectController);

  // --- Inputs (Refactored to signal inputs) ---
  value = input<string | null>(null);
  disabled = input<boolean | string>(false);
  placeholder = input<string | undefined>(undefined);

  // --- Outputs ---
  @Output() valueChange = this.controller.valueChange;

  constructor() {
    // Effect to sync all signal inputs with the controller's state
    effect(() => {
      // Sync value (only if it's not null/undefined)
      const val = this.value();
      if (val) {
        this.controller.selectedValue.set(val);
      }

      // Sync disabled state
      const dis = this.disabled();
      this.controller.disabled.set(dis === true || dis === '');

      // Sync placeholder
      this.controller.placeholder.set(this.placeholder());
    });
  }
}

// --- 2. Select Trigger Component ---
// (Refactored to remove ViewChild and pass native element)

@Component({
  selector: 'app-select-trigger',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      #trigger
      type="button"
      data-slot="select-trigger"
      [attr.data-size]="size()"
      [disabled]="controller.disabled()"
      [class]="hostClasses()"
      (click)="controller.toggle(trigger)"
      aria-haspopup="listbox"
      [attr.aria-expanded]="controller.isOpen()"
      [id]="id()"
    >
      <ng-content></ng-content>
      <lucide-icon [img]="ChevronDown" class="size-4 opacity-50 "></lucide-icon>
    </button>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectTriggerComponent {
  // FIX: Removed unnecessary ViewChild

  // --- Inputs (Refactored to signal inputs) ---
  customClasses = input<string | undefined>();
  size = input<'sm' | 'default'>('default');
  id = input<string>('')
  // Note: contentId and labelledby props are removed
  // as they are better managed by the content component internally.

  protected controller = inject(SelectController);
  protected readonly ChevronDown = ChevronDown;

  protected hostClasses = computed(() =>
    cn(
      'border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
      this.customClasses()
    )
  );
}

// --- 3. Select Value Component ---
// (No logical changes needed, already clean)

@Component({
  selector: 'app-select-value',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      data-slot="select-value"
      [attr.data-placeholder]="isPlaceholderVisible() ? '' : null"
    >
      @if (controller.selectedLabel()) {
      {{ controller.selectedLabel() }}
      } @else if (controller.placeholder()) {
      {{ controller.placeholder() }}
      } @else {
      <ng-content></ng-content>
      }
    </span>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectValueComponent {
  protected controller = inject(SelectController);
  protected isPlaceholderVisible = computed(
    () => !this.controller.selectedValue() && this.controller.placeholder()
  );
}

// --- 4. Select Content Component (Popover/Portal Logic) ---
// (Refactored for robust overlay logic and fixed race condition)

@Component({
  selector: 'app-select-content',
  standalone: true,
  imports: [CommonModule, OverlayModule, PortalModule, LucideAngularModule],
  template: `
    <ng-template cdk-portal>
      <div
        #contentEl
        data-slot="select-content"
        [attr.data-state]="controller.isOpen() ? 'open' : 'closed'"
        [attr.data-side]="'bottom'"
        [class]="hostClasses()"
        (keydown)="onKeydown($event)"
      >
        <div data-slot="select-viewport" [class]="viewportClasses()">
          <ng-content></ng-content>
        </div>
      </div>
    </ng-template>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectContentComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CdkPortal, { static: true }) portal!: CdkPortal;
  @ViewChild('contentEl') contentEl!: ElementRef<HTMLDivElement>;
  protected controller = inject(SelectController);

  private overlay = inject(Overlay);
  private renderer = inject(Renderer2);
  private injector = inject(Injector);

  customClasses = signal<string | undefined>(undefined);
  position = signal<'popper' | 'item-aligned'>('popper');

  protected hostClasses = computed(() =>
    cn(
      'bg-popover text-popover-foreground w-full data-[state=open]:animate-in data-[state=closed]:animate-out relative z-50 min-w-[8rem] origin-top-left overflow-x-hidden overflow-y-hidden rounded-md border shadow-md',
      this.position() === 'popper' &&
        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
      this.customClasses()
    )
  );

  protected viewportClasses = computed(() =>
    cn(
      'p-1 scroll-my-1 max-h-48 overflow-y-auto',
      this.position() === 'popper' &&
        'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
    )
  );

  private overlayRef!: OverlayRef;

  constructor() {
    effect(
      () => {
        const isOpen = this.controller.isOpen();
        const triggerEl = this.controller.triggerElementRef();

        if (isOpen && triggerEl) {
          this.attachOverlay(triggerEl);
        } else if (!isOpen && this.controller.overlayRef) {
          this.controller.overlayRef.detach();
          this.controller.overlayRef.dispose();
          this.controller.overlayRef = null;
        }
      },
      { injector: this.injector }
    );
  }

  ngAfterViewInit() {}

  private attachOverlay(triggerEl: HTMLElement) {
    if (this.controller.overlayRef) return;

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(triggerEl)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: this.position() === 'popper' ? 4 : 0,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
            offsetY: this.position() === 'popper' ? -4 : 0,
          },
        ])
        .withPush(false)
        .withViewportMargin(10),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.controller.overlayRef = this.overlayRef;
    this.overlayRef.attach(this.portal);
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`;
    const rect = triggerEl.getBoundingClientRect();
    const overlayPane = this.overlayRef.overlayElement;
    this.renderer.setStyle(overlayPane, 'width', `${rect.width}px`);
    this.renderer.setStyle(
      overlayPane,
      '--radix-select-trigger-width',
      `${rect.width}px`
    );
    this.renderer.setStyle(
      overlayPane,
      '--radix-select-trigger-height',
      `${rect.height}px`
    );

    setTimeout(() => {
      const selected = overlayPane.querySelector<HTMLElement>(
        '[data-slot="select-item"][aria-selected="true"]'
      );
      selected?.focus();

      // --- Hover-to-focus logic ---
      const items = overlayPane.querySelectorAll<HTMLElement>(
        '[data-slot="select-item"]:not([data-disabled="true"])'
      );
      items.forEach((item) => {
        item.setAttribute('tabindex', '0'); // make focusable
        item.addEventListener('mouseenter', () => item.focus());
      });
    });

    // Click outside
    const clickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Make sure overlay exists before checking
      const overlayEl = this.overlayRef?.overlayElement;
      const triggerElRef = triggerEl;

      if (!overlayEl || !triggerElRef) return; // overlay not ready or disposed

      if (!overlayEl.contains(target) && !triggerElRef.contains(target)) {
        this.controller.close();
        cleanup();
      }
    };



    const cleanup = () => {
      document.removeEventListener('mousedown', clickOutside);
    };

    document.addEventListener('mousedown', clickOutside);
  }

  /** Keyboard navigation */
  onKeydown(event: KeyboardEvent) {
    const items = Array.from(
      this.contentEl.nativeElement.querySelectorAll<HTMLElement>(
        '[data-slot="select-item"]:not([data-disabled="true"])'
      )
    );
    const activeIndex = items.findIndex(
      (el) => el === document.activeElement
    );

    if (event.key === 'ArrowDown') {
      const nextIndex = (activeIndex + 1) % items.length;
      items[nextIndex].focus();
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      const prevIndex =
        (activeIndex - 1 + items.length) % items.length;
      items[prevIndex].focus();
      event.preventDefault();
    } else if (event.key === 'Enter' || event.key === ' ') {
      (document.activeElement as HTMLElement)?.click();
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.overlayRef?.dispose();
  }
}


// --- 5. Select Item Component ---
// (Refactored to signal inputs)

@Component({
  selector: 'app-select-item',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      data-slot="select-item"
      role="option"
      tabindex="0"
      [attr.data-value]="value()"
      [attr.aria-selected]="isSelected()"
      [attr.data-disabled]="isDisabled() ? 'true' : null"
      [class]="hostClasses()"
      (click)="onSelect()"
    >
      <span class="absolute right-2 flex size-3.5 items-center justify-center">
        @if (isSelected()) {
        <lucide-icon [img]="Check" class="size-4"></lucide-icon>
        }
      </span>
      <span data-slot="select-item-text">
        <ng-content></ng-content>
      </span>
    </div>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectItemComponent {
  // --- Inputs (Refactored to signal inputs) ---
  value = input.required<string>();
  customClasses = input<string | undefined>();
  disabled = input<boolean | string>(false);

  protected readonly Check = Check;
  protected controller = inject(SelectController);
  private el = inject(ElementRef);

  protected isSelected = computed(
    () => this.controller.selectedValue() === this.value()
  );

  protected isDisabled = computed(() => {
    const dis = this.disabled();
    return dis === true || dis === 'true' || dis === '';
  });

  protected hostClasses = computed(() =>
    cn(
      'focus:bg-accent focus:text-accent-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
      this.customClasses()
    )
  );

  onSelect() {
    if (this.isDisabled()) return;

    const label = this.el.nativeElement.textContent?.trim() || this.value();
    this.controller.selectItem(this.value(), label);
  }
  @HostListener('mouseenter')
  onHover() {
    if (!this.isDisabled()) {
      this.el.nativeElement.focus();
    }
  }
}

// --- 6. Scroll Buttons ---
// (Refactored to signal inputs)

@Component({
  selector: 'app-select-scroll-up-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div data-slot="select-scroll-up-button" [class]="hostClasses()">
      <lucide-icon [img]="ChevronUp" class="size-4" />
    </div>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectScrollUpButtonComponent {
  customClasses = input<string | undefined>();
  protected readonly ChevronUp = ChevronUp;
  protected hostClasses = computed(() =>
    cn('flex cursor-default items-center justify-center py-1', this.customClasses())
  );
}

@Component({
  selector: 'app-select-scroll-down-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div data-slot="select-scroll-down-button" [class]="hostClasses()">
      <lucide-icon [img]="ChevronDown" class="size-4" />
    </div>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectScrollDownButtonComponent {
  customClasses = input<string | undefined>();
  protected readonly ChevronDown = ChevronDown;
  protected hostClasses = computed(() =>
    cn('flex cursor-default items-center justify-center py-1', this.customClasses())
  );
}

// --- 7. Remaining Structural Components ---
// (Refactored to signal inputs)

@Component({
  selector: 'app-select-group',
  standalone: true,
  imports: [],
  template: `
    <div data-slot="select-group">
      <ng-content></ng-content>
    </div>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectGroupComponent {}

@Component({
  selector: 'app-select-label',
  standalone: true,
  imports: [],
  template: `
    <div data-slot="select-label" [class]="hostClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectLabelComponent {
  customClasses = input<string | undefined>();
  protected hostClasses = computed(() =>
    cn('text-muted-foreground px-2 py-1.5 text-xs', this.customClasses())
  );
}

@Component({
  selector: 'app-select-separator',
  standalone: true,
  imports: [],
  template: `
    <div data-slot="select-separator" [class]="hostClasses()"></div>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectSeparatorComponent {
  customClasses = input<string | undefined>();
  protected hostClasses = computed(() =>
    cn('bg-border pointer-events-none -mx-1 my-1 h-px', this.customClasses())
  );
}