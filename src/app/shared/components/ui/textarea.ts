import { Component, Input, model, booleanAttribute, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '@utils/cn.util';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  template: `
    <textarea
      data-slot="textarea"
      [class]="
        cn(
          'resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          userClass()
        )
      "
      [id]="id"
      [placeholder]="placeholder"
      [rows]="rows"
      [disabled]="disabled"
      [attr.aria-invalid]="ariaInvalid"
      [value]="value()"
      (input)="onInput($event)"
    ></textarea>
  `,
    styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class TextareaComponent {
  /**
   * The two-way model binding for the textarea's value.
   */
  value = model<string>('');

  /**
   * Optional class name(s) to add to the component.
   */
  userClass = input<string>('', { alias: 'class' });

  /**
   * The id of the textarea.
   */
  @Input() id?: string;

  /**
   * The placeholder text.
   */
  @Input() placeholder?: string;

  /**
   * The number of rows.
   */
  @Input() rows: number | string = 3;

  /**
   * Whether the textarea is disabled.
   */
  @Input({ transform: booleanAttribute }) disabled = false;

  /**
   * For accessibility and styling.
   */
  @Input('aria-invalid') ariaInvalid: boolean | 'true' | 'false' = false;

  protected readonly cn = cn;

  /**
   * Updates the model on input.
   * @param event The DOM input event.
   */
  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value.set(target.value);
  }
}