import {
  Component,
  input,
  output,
  computed,
  signal,
  ViewEncapsulation,
  ElementRef,
  Renderer2,
  OnDestroy,
  AfterViewInit,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@utils/cn.util';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      data-slot="slider"
      [class]="hostClasses()"
      [attr.aria-orientation]="orientation()"
      [attr.aria-disabled]="disabled() ? 'true' : null"
    >
      <div data-slot="slider-track" [class]="trackClasses()">
        <div
          data-slot="slider-range"
          [class]="rangeClasses()"
          [style.left.%]="rangePosition().start"
          [style.width.%]="rangePosition().size"
        ></div>
      </div>

      @for (val of activeValues(); track $index) {
        <div
          data-slot="slider-thumb"
          role="slider"
          tabindex="0"
          [attr.data-index]="$index"
          [attr.aria-valuemin]="min()"
          [attr.aria-valuemax]="max()"
          [attr.aria-valuenow]="val"
          [class]="thumbClasses()"
          [style.left.%]="orientation() === 'horizontal' ? thumbPositions()[$index] : null"
          [style.bottom.%]="orientation() === 'vertical' ? thumbPositions()[$index] : null"
          (mousedown)="startDrag($event, $index)"
          (touchstart)="startDrag($event, $index)"
          (keydown)="handleKeyDown($event, $index)"
        ></div>
      }
    </div>
  `,
  styles: [`
    :host { display: contents; }

    [data-slot='slider'] { position: relative; user-select: none; }

    [data-slot='slider-thumb'] {
      position: absolute;
      cursor: grab;
      transform: translate(-50%, -50%);
      top: 50%;
      touch-action: none;
    }
  `],
})
export class SliderComponent implements AfterViewInit, OnDestroy {
  // Inputs
  value = input<number | number[]>();
  defaultValue = input<number | number[]>();
  min = input(0);
  max = input(100);
  step = input(1);
  styles = input<string | undefined>();
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  disabled = input(false);

  // Outputs
  readonly valueChange = output< number[]>();

  // Internal state
  private internalValues = signal<number[]>([]);
  private draggingIndex: number | null = null;
  private sliderRect!: DOMRect;

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  private moveListener?: () => void;
  private upListener?: () => void;

  constructor() {
    // Initialize state
    const init = this.defaultValue() ?? this.min();
    const initial = Array.isArray(init) ? init : [init];
    this.internalValues.set(initial);

    // Sync with external controlled value
    effect(() => {
      const external = this.value();
      
      if (external !== undefined) {
        this.internalValues.set(Array.isArray(external) ? external : [external]);
      }
    });
  }

  ngAfterViewInit() {
    this.updateSliderRect();
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  // --- Computed values ---

  protected activeValues = computed(() =>
    this.internalValues().length > 0
      ? this.internalValues()
      : [this.min()]
  );

  protected thumbPositions = computed(() => {
    const min = this.min();
    const max = this.max();
    return this.activeValues().map(v => ((v - min) / (max - min)) * 100);
  });

  protected rangePosition = computed(() => {
    const positions = this.thumbPositions();
    if (positions.length === 1) return { start: 0, size: positions[0] };
    const start = Math.min(...positions);
    const end = Math.max(...positions);
    return { start, size: end - start };
  });

  // --- Interaction ---

  startDrag(event: MouseEvent | TouchEvent, index: number) {
    if (this.disabled()) return;

    this.draggingIndex = index;
    this.updateSliderRect();

    this.moveListener = this.renderer.listen('document', 'mousemove', e => this.drag(e));
    this.upListener = this.renderer.listen('document', 'mouseup', () => this.stopDrag());
    this.renderer.listen('document', 'touchmove', e => this.drag(e));
    this.renderer.listen('document', 'touchend', () => this.stopDrag());
  }

  drag(event: MouseEvent | TouchEvent) {
    if (this.draggingIndex === null || !this.sliderRect) return;

    const client = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const { left, width } = this.sliderRect;

    let percent = (client - left) / width;
    percent = Math.max(0, Math.min(1, percent));

    const newValue = this.mapPercentToValue(percent);
    this.updateValue(newValue, this.draggingIndex);
  }

  stopDrag() {
    this.draggingIndex = null;
    this.removeListeners();
  }

  private removeListeners() {
    if (this.moveListener) this.moveListener();
    if (this.upListener) this.upListener();
    this.moveListener = undefined;
    this.upListener = undefined;
  }

  handleKeyDown(event: KeyboardEvent, index: number) {
    if (this.disabled()) return;

    let newValue = this.internalValues()[index];
    if (newValue === undefined) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = this.clampValue(newValue + this.step());
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = this.clampValue(newValue - this.step());
        break;
      case 'Home':
        newValue = this.min();
        break;
      case 'End':
        newValue = this.max();
        break;
      default:
        return;
    }

    event.preventDefault();
    this.updateValue(newValue, index);
  }

  updateSliderRect() {
    const track = this.el.nativeElement.querySelector('[data-slot="slider-track"]');
    if (track) this.sliderRect = track.getBoundingClientRect();
  }

  mapPercentToValue(percent: number): number {
    const min = this.min();
    const max = this.max();
    const stepped = Math.round((percent * (max - min) + min) / this.step()) * this.step();
    return this.clampValue(stepped);
  }

  clampValue(value: number): number {
    return Math.max(this.min(), Math.min(this.max(), value));
  }

  updateValue(newValue: number, index: number) {
    const newValues = [...this.internalValues()];
    newValues[index] = newValue;
    if (newValues.length > 1) newValues.sort((a, b) => a - b);

    this.internalValues.set(newValues);
    this.valueChange.emit([
      newValues[0],
      newValues[1] ?? newValues[0],
    ]);
  }

  // --- Classes ---
  protected hostClasses = computed(() =>
    cn(
      'relative flex w-full items-center select-none touch-none data-[disabled]:opacity-50',
      this.orientation() === 'vertical' && 'flex-col h-full min-h-44 w-auto',
      this.styles()
    )
  );

  protected trackClasses = computed(() =>
    cn(
      'bg-muted relative grow overflow-hidden rounded-full',
      this.orientation() === 'horizontal' ? 'h-4 w-full' : 'w-1.5 h-full'
    )
  );

  protected rangeClasses = computed(() =>
    cn(
      'bg-primary absolute',
      this.orientation() === 'horizontal' ? 'h-full' : 'w-full'
    )
  );

  protected thumbClasses = computed(() =>
    cn(
      'border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow]',
      'hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden',
      'disabled:pointer-events-none disabled:opacity-50'
    )
  );
}
