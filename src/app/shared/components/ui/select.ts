import {
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Injectable,
  input,
  Output,
  signal,
  ViewChild,
  Renderer2,
  OnDestroy,
  Injector,
  DestroyRef,
  HostListener,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { cn } from '@utils/cn.util';

// --- DI CONTROLLER SERVICE ---

@Injectable()
export class SelectController {
  isOpen = signal(false);
  selectedValue = signal<string | null>(null);
  selectedLabel = signal<string | null>(null);
  disabled = signal(false);
  placeholder = signal<string | undefined>(undefined);

  triggerElementRef = signal<HTMLElement | null>(null);

  valueChange = new EventEmitter<string | null>();

  private document = inject(DOCUMENT);

  constructor(private destroyRef: DestroyRef) {
    this.destroyRef.onDestroy(() => this.close());
  }

  toggle(triggerEl: HTMLElement) {

    if (this.disabled()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(triggerEl);
    }
  }

  open(triggerEl: HTMLElement) {
    
    if (this.isOpen() || this.disabled()) return;
    this.triggerElementRef.set(triggerEl);
    this.isOpen.set(true);
  }

  close() {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.document.body.style.overflow = '';
    this.document.body.style.paddingRight = '';
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

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  styles: [':host { display: contents; }'],
  providers: [SelectController],
})
export class SelectComponent {
  controller = inject(SelectController);

  value = input<string | null>(null);
  disabled = input<boolean | string>(false);
  placeholder = input<string | undefined>(undefined);

  @Output() valueChange = this.controller.valueChange;

  constructor() {
    effect(() => {
      const val = this.value();
      if (val) {
        this.controller.selectedValue.set(val);
      }

      const dis = this.disabled();
      this.controller.disabled.set(dis === true || dis === '');

      this.controller.placeholder.set(this.placeholder());
    });
  }
}

// --- 2. Select Trigger Component ---

@Component({
  selector: 'app-select-trigger',
  standalone: true,
  imports: [CommonModule],
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
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-50"><path d="m6 9 6 6 6-6"/></svg>
    </button>
  `,
  styles: [':host { display: contents; }'],
    host: {
    '[attr.id]': 'null',
  },
})
export class SelectTriggerComponent {
  userClass = input<string>('', { alias: 'class' });

  size = input<'sm' | 'default'>('default');
  id = input<string>('', { alias: 'id' });

  protected controller = inject(SelectController);

  protected hostClasses = computed(() =>
    cn(
      'border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
      this.userClass()
    )
  );
}

// --- 3. Select Value Component ---

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

// --- 4. Select Content Component (Native Portal Logic) ---

@Component({
  selector: 'app-select-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #container style="display: none;">
      <div
        #contentEl
        [style.display]="controller.isOpen() ? 'block' : 'none'"
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
    </div>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectContentComponent implements OnDestroy {
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @ViewChild('contentEl') contentEl!: ElementRef<HTMLDivElement>;

  protected controller = inject(SelectController);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private injector = inject(Injector);

  userClass = input<string>('', { alias: 'class' });
  position = signal<'popper' | 'item-aligned'>('popper');

  private clickOutsideListener?: () => void;
  private scrollListener?: () => void;

  protected hostClasses = computed(() =>
    cn(
      'bg-popover text-popover-foreground w-full data-[state=open]:animate-in data-[state=closed]:animate-out z-50 min-w-[8rem] origin-top-left overflow-x-hidden overflow-y-hidden rounded-md border shadow-md',
      this.position() === 'popper' &&
        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
      this.userClass()
    )
  );

  protected viewportClasses = computed(() =>
    cn(
      'p-1 scroll-my-1 max-h-48 overflow-y-auto',
      this.position() === 'popper' &&
        'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
    )
  );

  constructor() {
    effect(
      () => {
        const isOpen = this.controller.isOpen();
        if (isOpen) {
          this.attachToBody();
        } else {
          this.detachFromBody();
        }
      },
      { injector: this.injector }
    );
  }

  private attachToBody() {
    // Wait for view updates
    setTimeout(() => {
      const content = this.contentEl?.nativeElement;
      const trigger = this.controller.triggerElementRef();

      if (!content || !trigger) return;

      // Append to body natively
      this.renderer.appendChild(this.document.body, content);

      // Positioning logic
      const updatePosition = () => {
        const rect = trigger.getBoundingClientRect();
        this.renderer.setStyle(content, 'position', 'fixed');
        this.renderer.setStyle(content, 'top', `${rect.bottom + 4}px`);
        this.renderer.setStyle(content, 'left', `${rect.left}px`);
        this.renderer.setStyle(content, 'width', `${rect.width}px`);
        this.renderer.setStyle(content, '--radix-select-trigger-width', `${rect.width}px`);
        this.renderer.setStyle(content, '--radix-select-trigger-height', `${rect.height}px`);
      };
      
      updatePosition();

      // Lock scroll & prevent body shift
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
      this.renderer.setStyle(this.document.body, 'paddingRight', `${scrollBarWidth}px`);

      // Click outside listener
      this.clickOutsideListener = this.renderer.listen(
        'document',
        'mousedown',
        (event: MouseEvent) => {
          const target = event.target as HTMLElement;

          const labelForTrigger =
            target.tagName === 'LABEL' &&
            target.getAttribute('for') === trigger.id;
          if (
            !content.contains(target) &&
            !trigger.contains(target) &&
            !labelForTrigger
          ) {
            this.controller.close();
          }
        }
      );

      // Maintain positioning on scroll (if trigger is inside a scrollable div)
      this.scrollListener = this.renderer.listen('window', 'scroll', updatePosition);

      // Auto-focus selected item or setup hover states
      setTimeout(() => {
        const selected = content.querySelector<HTMLElement>('[data-slot="select-item"][aria-selected="true"]');
        selected?.focus();

        const items = content.querySelectorAll<HTMLElement>('[data-slot="select-item"]:not([data-disabled="true"])');
        items.forEach((item) => {
          item.setAttribute('tabindex', '0');
          item.addEventListener('mouseenter', () => item.focus());
        });
      });
    });
  }

  private detachFromBody() {
    const content = this.contentEl?.nativeElement;
    const container = this.container?.nativeElement;

    if (content && container) {
      this.renderer.appendChild(container, content);
    }

    if (this.clickOutsideListener) {
      this.clickOutsideListener();
      this.clickOutsideListener = undefined;
    }

    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = undefined;
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (!this.contentEl) return;
    const items = Array.from(
      this.contentEl.nativeElement.querySelectorAll<HTMLElement>(
        '[data-slot="select-item"]:not([data-disabled="true"])'
      )
    );
    const activeIndex = items.findIndex((el) => el === this.document.activeElement);

    if (event.key === 'ArrowDown') {
      const nextIndex = (activeIndex + 1) % items.length;
      items[nextIndex].focus();
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      const prevIndex = (activeIndex - 1 + items.length) % items.length;
      items[prevIndex].focus();
      event.preventDefault();
    } else if (event.key === 'Enter' || event.key === ' ') {
      (this.document.activeElement as HTMLElement)?.click();
      event.preventDefault();
    } else if (event.key === 'Escape') {
      this.controller.close();
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.detachFromBody();
  }
}

// --- 5. Select Item Component ---

@Component({
  selector: 'app-select-item',
  standalone: true,
  imports: [CommonModule],
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M20 6 9 17l-5-5"/></svg>
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
  value = input.required<string>();
  userClass = input<string>('', { alias: 'class' });

  disabled = input<boolean | string>(false);

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
      this.userClass()
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

@Component({
  selector: 'app-select-scroll-up-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div data-slot="select-scroll-up-button" [class]="hostClasses()">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="m18 15-6-6-6 6"/></svg>
    </div>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectScrollUpButtonComponent {
  userClass = input<string>('', { alias: 'class' });

  protected hostClasses = computed(() =>
    cn('flex cursor-default items-center justify-center py-1', this.userClass())
  );
}

@Component({
  selector: 'app-select-scroll-down-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div data-slot="select-scroll-down-button" [class]="hostClasses()">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="m6 9 6 6 6-6"/></svg>
    </div>
  `,
  styles: [':host { display: contents; }'],
})
export class SelectScrollDownButtonComponent {
  userClass = input<string>('', { alias: 'class' });

  protected hostClasses = computed(() =>
    cn('flex cursor-default items-center justify-center py-1', this.userClass())
  );
}

// --- 7. Remaining Structural Components ---

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
  userClass = input<string>('', { alias: 'class' });

  protected hostClasses = computed(() =>
    cn('text-muted-foreground px-2 py-1.5 text-xs', this.userClass())
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
  userClass = input<string>('', { alias: 'class' });

  protected hostClasses = computed(() =>
    cn('bg-border pointer-events-none -mx-1 my-1 h-px', this.userClass())
  );
}