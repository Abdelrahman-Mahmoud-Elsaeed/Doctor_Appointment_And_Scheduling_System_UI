import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgModuleRef,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Provider,
  SimpleChanges,
  signal,
  WritableSignal,
  AfterViewInit,
  DestroyRef,
  input,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { cn } from '@utils/cn.util';

/**
 * TabsService
 * - Provided by the root tabsComponent instance (scoped to that tabs tree).
 * - Manages active value, trigger registration, keyboard navigation, and focus.
 */
class tabsService {
  // internal registry of triggers in registration order
  private triggers: { value: string; el: HTMLElement }[] = [];

  // active value signal
  activeValue: WritableSignal<string | null> = signal<string | null>(null);

  // controlled mode flag (root sets it)
  controlled = false;

  // emits when active changes; root component uses this to emit valueChange if controlled
  onChange: (value: string) => void = () => {};

  registerTrigger(value: string, el: HTMLElement) {
    // ensure unique registration
    const idx = this.triggers.findIndex((t) => t.el === el || t.value === value);
    if (idx >= 0) {
      this.triggers[idx] = { value, el };
    } else {
      this.triggers.push({ value, el });
    }
  }

  unregisterTrigger(el: HTMLElement) {
    this.triggers = this.triggers.filter((t) => t.el !== el);
  }

  setActive(value: string) {
    if (this.controlled) {
      this.onChange(value);
      this.activeValue.set(value)
    } else {
      this.activeValue.set(value);
      this.onChange(value);
    }
  }

  getActive() {
    return this.activeValue();
  }

  focusTriggerByIndex(index: number) {
    if (index < 0 || index >= this.triggers.length) return;
    this.triggers[index].el.focus();
  }

  focusNext(currentValue: string | null) {
    if (!this.triggers.length) return;
    const idx = this.triggers.findIndex((t) => t.value === currentValue);
    const next = (idx + 1 + this.triggers.length) % this.triggers.length;
    this.focusTriggerByIndex(next);
  }

  focusPrev(currentValue: string | null) {
    if (!this.triggers.length) return;
    const idx = this.triggers.findIndex((t) => t.value === currentValue);
    const prev = (idx - 1 + this.triggers.length) % this.triggers.length;
    this.focusTriggerByIndex(prev);
  }

  focusFirst() {
    if (!this.triggers.length) return;
    this.focusTriggerByIndex(0);
  }

  focusLast() {
    if (!this.triggers.length) return;
    this.focusTriggerByIndex(this.triggers.length - 1);
  }

  // find index of trigger by value
  indexOf(value: string | null) {
    if (value === null) return -1;
    return this.triggers.findIndex((t) => t.value === value);
  }
}

/* -------------------------------------------------------------------------- */
/*                                  tabs                                   */
/*  Root component. Usage:
    <app-tabs [value]="..." (valueChange)="..." [defaultValue]="'tab1'">
      <app-tabs-list> ... </app-tabs-list>
      <app-tabs-content value="tab1"> ... </app-tabs-content>
    </app-tabs>
*/
/* -------------------------------------------------------------------------- */
@Component({
  selector: "app-tabs",
  standalone: true,
  imports: [CommonModule],
  providers: [
    // provide a unique TabsService per tabsComponent instance
    {
      provide: tabsService,
      useFactory: () => new tabsService(),
    } as Provider,
  ],
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class tabsComponent implements OnInit, OnChanges, OnDestroy {
  private tabsService = inject(tabsService);
  private destroyRef = inject(DestroyRef);

  /** Controlled value input. If provided, the component acts controlled. */
  @Input() value?: string | null;

  /** defaultValue for uncontrolled mode */
  @Input() defaultValue?: string;

  /** class list to pass to root */
  userClass = input<string>('', { alias: 'class' });


  /** emits when active value changes */
  @Output() valueChange = new EventEmitter<string>();

  // computed active value (mirrors service signal)
  active = computed(() => this.tabsService.activeValue());

  // host id attributes for accessibility (optionally set by user, but we'll auto-generate if not)
  @Input() id?: string;

  ngOnInit(): void {
    // Controlled vs uncontrolled
    this.tabsService.controlled = this.value !== undefined && this.value !== null;
    // Initialize active value
    if (this.tabsService.controlled) {
      // controlled: reflect the provided value (if any) into the service as readonly source
      this.tabsService.activeValue.set(this.value ?? null);
    } else {
      // uncontrolled: use defaultValue or the current service value
      this.tabsService.activeValue.set(this.defaultValue ?? this.tabsService.getActive());
    }

    // when service requests a change, emit `valueChange` and update internal signal for uncontrolled
    this.tabsService.onChange = (v: string) => {
      if (!this.tabsService.controlled) {
        this.tabsService.activeValue.set(v);
      }
      // Always emit to allow parent listeners to react.
      this.valueChange.emit(v);
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If parent changed controlled value, update service value
    if (changes["value"]) {
      this.tabsService.controlled = this.value !== undefined && this.value !== null;
      if (this.tabsService.controlled) {
        this.tabsService.activeValue.set(this.value ?? null);
      }
    }
    // defaultValue changes only affect uncontrolled init; we don't switch mid-flight.
  }

  ngOnDestroy(): void {
    // nothing special — child triggers unregister themselves
  }

  // Helper to build classes like the original: keep Tailwind exactly
  get rootClasses() {
    return cn("flex flex-col gap-2", this.userClass() ?? "");
  }
}

/* -------------------------------------------------------------------------- */
/*                                 tabsList                                */
/*  Usage: <app-tabs-list [class]>'children triggers here'</app-tabs-list>
/* -------------------------------------------------------------------------- */
@Component({
  selector: "app-tabs-list",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      data-slot="tabs-list"
      role="tablist"
      [attr.aria-orientation]="orientation"
      [class]="listClasses"
    >
      <ng-content></ng-content>
    </div>
  `,
    styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class tabsListComponent {
  userClass = input<string>('', { alias: 'class' });

  @Input() orientation: "horizontal" | "vertical" = "horizontal";

  get listClasses() {
    // copied exactly from React wrapper
    return cn(
      "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex",
      this.userClass() ?? ""
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                                tabsTrigger                               */
/*  Usage: <app-tabs-trigger [value] class>Label</app-tabs-trigger>
/*  - Registers itself to TabsService on init and unregister on destroy
/*  - When clicked, calls TabsService.setActive(value)
/*  - Exposes keyboard behavior (handled at button level)
*/
/* -------------------------------------------------------------------------- */
@Component({
  selector: "app-tabs-trigger",
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      data-slot="tabs-trigger"
      role="tab"
      [attr.aria-selected]="isActive()"
      [attr.aria-controls]="contentId"
      [attr.data-state]="isActive() ? 'active' : 'inactive'"
      [disabled]="disabled"
      (click)="onClick()"
      (keydown)="onKeydown($event)"
      (focus)="onFocus()"
      [attr.tabindex]="tabIndex"
      [class]="triggerClasses"
      #btn
    >
      <ng-content></ng-content>
    </button>
  `,
    styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class tabsTriggerComponent implements OnInit, AfterViewInit, OnDestroy {
  private tabsService = inject(tabsService);
  private elRef = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input() value!: string;
  @Input() disabled = false;
  userClass = input<string>('', { alias: 'class' });

  // optional id references to content
  @Input() contentId?: string;

  // tabindex: when active -> 0 else -1 (standard ARIA pattern for roving tabindex)
  get tabIndex() {
    return this.isActive() ? 0 : -1;
  }

  // compute whether this tab is active
  isActive(): boolean {
    return this.tabsService.getActive() === this.value;
  }

  // derive classes (preserve Tailwind exactly)
  get triggerClasses() {
    return cn(
      "data-[state=active]:bg-card dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this.userClass()
    );
  }

  // reference to native button for registration/focus
  private nativeButton!: HTMLElement;

  ngOnInit(): void {
    if (!this.value) {
      throw new Error("app-tabs-trigger requires a [value] input.");
    }
  }

  ngAfterViewInit(): void {
    // register this trigger in the TabsService
    // find the native button element
    // the ElementRef injected above is the component host; query for button inside
    const host = (this.elRef as any).nativeElement as HTMLElement;
    this.nativeButton = host.querySelector("button") as HTMLElement;
    if (!this.nativeButton) return;
    this.tabsService.registerTrigger(this.value, this.nativeButton);
    // If there's no active value yet and this is the first register AND no controlled value
    const current = this.tabsService.getActive();
    if (!this.tabsService.controlled && (current === null || current === undefined)) {
      // set first registered as active if defaultValue wasn't set by root
      this.tabsService.activeValue.set(this.value);
    }
  }

  ngOnDestroy(): void {
    if (this.nativeButton) {
      this.tabsService.unregisterTrigger(this.nativeButton);
    }
  }

  onClick() {
    if (this.disabled) return;
    this.tabsService.setActive(this.value);
  }

  onFocus() {
    // set tabindex and active? We follow ARIA: focus alone doesn't activate tab unless clicked or Enter/Space.
  }

  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    // basic keyboard navigation for horizontal orientation (Radix supports L/R)
    if (key === "ArrowRight") {
      event.preventDefault();
      this.tabsService.focusNext(this.tabsService.getActive());
      return;
    }
    if (key === "ArrowLeft") {
      event.preventDefault();
      this.tabsService.focusPrev(this.tabsService.getActive());
      return;
    }
    if (key === "Home") {
      event.preventDefault();
      this.tabsService.focusFirst();
      return;
    }
    if (key === "End") {
      event.preventDefault();
      this.tabsService.focusLast();
      return;
    }
    if (key === "Enter" || key === " ") {
      // Space or Enter activates focused tab
      event.preventDefault();
      if (!this.disabled) this.tabsService.setActive(this.value);
      return;
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                tabsContent                               */
/*  Usage: <app-tabs-content [value] [class]>content...</app-tabs-content>
/*  - Renders content only if active value === value input
/*  - Adds data-slot and classes preserved
/* -------------------------------------------------------------------------- */
@Component({
  selector: "app-tabs-content",
  standalone: true,
  imports: [CommonModule],
  template: `
  @if(isActive()){
    <div
      data-slot="tabs-content"
      role="tabpanel"
      [attr.aria-labelledby]="labelledById"
      [id]="contentId"
      [class]="contentClasses"
      tabindex="0"
    >
      <ng-content></ng-content>
    </div>
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
export class tabsContentComponent implements OnInit {
  private tabsService = inject(tabsService);

  /** value that maps this content to a trigger */
  @Input() value!: string;

  /** optional id for this content (so trigger can reference aria-controls) */
  @Input() contentId?: string;

  /** optional id of labelledby (trigger id) */
  @Input() labelledById?: string;

  userClass = input<string>('', { alias: 'class' });

  ngOnInit(): void {
    if (!this.value) {
      throw new Error("app-tabs-content requires a [value] input.");
    }
  }

  isActive() {
    return this.tabsService.getActive() === this.value;
  }

  get contentClasses() {
    return cn("flex-1 outline-none", this.userClass() ?? "");
  }
}

