import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { cn } from '@utils/cn.util';

// Defines a single day cell in the grid
interface CalendarDay {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isOutside: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [class]="cn('p-3', customClasses)">
      <div class="flex flex-col gap-4">
                <div class="flex justify-center pt-1 relative items-center w-full">
          <div class="flex items-center gap-1">
            <button
              type="button"
              (click)="previousMonth()"
              [class]="cn(
                'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                'absolute left-1',
                'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground'
              )"
            >
              <lucide-icon [img]="ChevronLeft" class="size-4"></lucide-icon>
            </button>

            <div class="text-sm font-medium">
              {{ monthYearLabel() }}
            </div>

            <button
              type="button"
              (click)="nextMonth()"
              [class]="cn(
                'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                'absolute right-1',
                'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground'
              )"
            >
              <lucide-icon [img]="ChevronRight" class="size-4"></lucide-icon>
            </button>
          </div>
        </div>

                <div class="w-full border-collapse">
                    <div class="flex">
            @for (day of weekdays; track day) {
                            <div class="text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] text-center">
                {{ day }}
              </div>
            }
          </div>

                    @for (week of calendarGrid(); track $index) {
            <div class="flex w-full mt-2">
              @for (day of week; track day.date) {
                @if (showOutsideDays || !day.isOutside) {
                                    <div
                    [class]="cn(
                      'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1',
                      {
                        'bg-accent rounded-md': day.isSelected
                      }
                    )"
                  >
                    <button
                      type="button"
                      (click)="onDayClick(day)"
                      [disabled]="day.isDisabled"
                      [class]="cn(
                                                'w-full aspect-square p-0 font-normal aria-selected:opacity-100',
                        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground',
                        {
                          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground': day.isSelected,
                          'bg-accent text-accent-foreground': day.isToday && !day.isSelected,
                          'day-outside text-muted-foreground aria-selected:text-muted-foreground': day.isOutside,
                          'text-muted-foreground opacity-50': day.isDisabled,
                          'invisible': !showOutsideDays && day.isOutside
                        }
                      )"
                    >
                      {{ day.date.getDate() }}
                    </button>
                  </div>
                } @else {
                                    <div class="flex-1"></div>
                }
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class CalendarComponent {
  // --- Public API ---
  @Input() customClasses?: string;
  @Input() showOutsideDays = true;
  @Input()
  set selected(value: Date | undefined) {
    this.selectedDate.set(value ? this.normalizeDate(value) : undefined);
  }

  @Output() select = new EventEmitter<Date>();

  // --- Internal State ---
  protected readonly cn = cn;
  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;
  protected weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
// protected Signature: `today`
  protected today = this.normalizeDate(new Date());

  /** The first day of the currently displayed month */
  protected currentMonth = signal(this.normalizeDate(new Date(), 'month'));
  protected selectedDate = signal<Date | undefined>(undefined);

  /** Formatted label for the month and year (e.g., "November 2025") */
  protected monthYearLabel = computed(() => {
    return this.currentMonth().toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  });

  /**
   * A 2D array (6x7) representing the weeks and days of the displayed month.
   */
  protected calendarGrid = computed<CalendarDay[][]>(() => {
    const month = this.currentMonth(); // e.g., Nov 1, 2025
    const weeks: CalendarDay[][] = [];

    // Find the start of the grid (first day of the month, then rewind to the preceding Sunday)
    const firstDayOfMonth = month.getDay(); // e.g., Nov 1 is a Sat (6)
    const startDate = new Date(month);
    startDate.setDate(1 - firstDayOfMonth); // 1 - 6 = -5. Sets date to Oct 26 (Sunday)

    // Build the 6x7 grid
    for (let w = 0; w < 6; w++) {
      const week: CalendarDay[] = [];
      for (let d = 0; d < 7; d++) {
        // Calculate the date for the current cell
        const offset = w * 7 + d;
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + offset);

        // Get properties for this day
        const isOutside = day.getMonth() !== month.getMonth();
        const isSelected = !!this.selectedDate() && day.getTime() === this.selectedDate()!.getTime();
        const isToday = day.getTime() === this.today.getTime();

        week.push({
          date: day,
          isToday: isToday,
          isSelected: isSelected,
          isOutside: isOutside,
          isDisabled: false, // Placeholder for future logic
        });
      }
      weeks.push(week);
    }
    return weeks;
  });

  // --- Event Handlers ---

  /** Moves to the previous month */
  protected previousMonth(): void {
    this.currentMonth.update((date) => {
      return new Date(date.getFullYear(), date.getMonth() - 1, 1);
    });
  }

  /** Moves to the next month */
  protected nextMonth(): void {
    this.currentMonth.update((date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    });
  }

  /** Handles clicking on a day, emits the 'select' event */
  protected onDayClick(day: CalendarDay): void {
    if (day.isDisabled) return;
    this.selectedDate.set(day.date);
    this.select.emit(day.date);
  }

  // --- Helpers ---

  /** Normalizes a date to midnight (or start of month) */
  private normalizeDate(date: Date, to: 'day' | 'month' = 'day'): Date {
    const newDate = new Date(date);
    if (to === 'month') {
      newDate.setDate(1);
    }
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }
}