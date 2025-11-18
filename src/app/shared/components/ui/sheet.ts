import {
  Component,
  Injectable,
  inject,
  Input,
  computed,
  signal,
  effect,
  Injector,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Overlay,
  OverlayModule,
  OverlayRef,
} from '@angular/cdk/overlay';
import {
  CdkPortal,
  PortalModule,
  ComponentPortal,
} from '@angular/cdk/portal';
import { LucideAngularModule, X } from 'lucide-angular';
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

  overlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay) {}

  open(side: 'top' | 'right' | 'bottom' | 'left' = 'right') {
    this.side.set(side);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.overlayRef?.dispose();
    this.overlayRef = null;
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
    <button type="button" data-slot="sheet-trigger" (click)="controller.open(side)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`:host { display: contents; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetTriggerComponent {
  controller = inject(SheetController);
  @Input() side: 'top' | 'right' | 'bottom' | 'left' = 'right';
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
// 🪟 Content Component (Overlay + Portal)
// ---------------------------------------------------------------------
@Component({
  selector: 'app-sheet-content',
  standalone: true,
  imports: [CommonModule, OverlayModule, PortalModule, LucideAngularModule],
  template: `
    @if (controller.isOpen()) {
      <ng-template cdk-portal>
        <div
          data-slot="sheet-overlay"
          [class]="overlayClasses()"
          (click)="controller.close()"
        ></div>

        <div
          #contentEl
          data-slot="sheet-content"
          [class]="contentClasses()"
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
            <lucide-icon [img]="X" class="size-4" />
            <span class="sr-only">Close</span>
          </button>
        </div>
      </ng-template>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetContentComponent implements OnDestroy {
  controller = inject(SheetController);
  private overlay = inject(Overlay);
  private injector = inject(Injector);

  @Input() customClasses?: string;
  @Input() side: 'top' | 'right' | 'bottom' | 'left' = 'right';
  @ViewChild(CdkPortal) portal!: CdkPortal;

  readonly X = X;

  protected sheetSide = computed(() => this.controller.side() || this.side);

  protected overlayClasses = computed(() =>
    cn(
      "fixed inset-0 z-50 bg-black/50 transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out",
      "cdk-overlay-backdrop cdk-overlay-dark-backdrop"
    )
  );

  protected contentClasses = computed(() => {
    const side = this.sheetSide();
    return cn(
      "bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out duration-300",
      side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
      side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
      side === "top" && "inset-x-0 top-0 h-auto border-b",
      side === "bottom" && "inset-x-0 bottom-0 h-auto border-t",
      this.customClasses,
    );
  });

  constructor() {
    effect(() => {
      if (this.controller.isOpen()) this.openOverlay();
      else this.controller.overlayRef?.dispose();
    }, { injector: this.injector });
  }

  openOverlay() {
    const positionStrategy = this.overlay.position().global();
    this.controller.overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });

    this.controller.overlayRef.attach(this.portal);

    this.controller.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') this.controller.close();
    });
  }

  ngOnDestroy() {
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
  @Input() customClasses?: string;
  protected classes = computed(() => cn("flex flex-col gap-1.5 p-4", this.customClasses));
}

@Component({
  selector: 'app-sheet-footer',
  standalone: true,
  imports: [CommonModule],
  template: `<div data-slot="sheet-footer" [class]="classes()"><ng-content></ng-content></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetFooterComponent {
  @Input() customClasses?: string;
  protected classes = computed(() => cn("mt-auto flex flex-col gap-2 p-4", this.customClasses));
}

@Component({
  selector: 'app-sheet-title',
  standalone: true,
  imports: [CommonModule],
  template: `<h3 data-slot="sheet-title" [class]="classes()"><ng-content></ng-content></h3>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetTitleComponent {
  @Input() customClasses?: string;
  protected classes = computed(() => cn("text-foreground text-lg font-semibold", this.customClasses));
}

@Component({
  selector: 'app-sheet-description',
  standalone: true,
  imports: [CommonModule],
  template: `<p data-slot="sheet-description" [class]="classes()"><ng-content></ng-content></p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetDescriptionComponent {
  @Input() customClasses?: string;
  protected classes = computed(() => cn("text-muted-foreground text-sm", this.customClasses));
}
