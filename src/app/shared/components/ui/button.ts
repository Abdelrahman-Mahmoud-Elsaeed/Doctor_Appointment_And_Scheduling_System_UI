import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { cn } from '@utils/cn.util';

// --- CVA (Class Variance Authority) Helper ---

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonVariantProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * A local helper function to replicate the class-variance-authority (CVA)
 * behavior from the original React component.
 *
 * This is exported for consistency with the original module.
 */
export function buttonVariants(props: ButtonVariantProps): string {
  const variant = props.variant ?? 'default';
  const size = props.size ?? 'default';

  // Base classes applied to all variants
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

  // Variant-specific classes
  const variants: Record<ButtonVariant, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive:
      'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
    outline:
      'border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  // Size-specific classes
  const sizes: Record<ButtonSize, string> = {
    default: 'h-9 px-4 py-2 has-[>svg]:px-3',
    sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
    lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
    icon: 'size-9 rounded-md',
  };

  return cn(base, variants[variant], sizes[size]);
}

// --- Angular Button Component ---

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  template: `
    <button
      data-slot="button"
      [type]="type()"
      [disabled]="disabled()"
      [class]="computedClasses()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      /*
       This ensures that the <app-button> component itself
       doesn't add an extra element to the DOM, and the <button>
       from the template is rendered directly in its place.
      */
      :host {
        display: contents;
      }
    `,
  ],
  // Use ViewEncapsulation.None to allow Tailwind's [&>svg]
  // and has-[>svg] selectors to pierce the <ng-content> boundary.
  encapsulation:ViewEncapsulation.None
})
export class ButtonComponent {
  // --- Inputs ---

  /**
   * The visual style of the button.
   * @default 'default'
   */
  variant = input<ButtonVariant>('default');

  /**
   * The size of the button.
   * @default 'default'
   */
  size = input<ButtonSize>('default');

  /**
   * The type of the button.
   * @default 'button'
   */
  type = input<'button' | 'submit' | 'reset'>('button');

  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled = input<boolean>(false);

  /**
   * Optional custom classes to merge with the button styles.
   * Replaces the \`className\` prop from React.
   */
  customClasses = input<string | undefined>();

  // --- Internal State ---

  /**
   * Computes the final class string for the button element.
   */
  protected computedClasses = computed(() =>
    cn(
      buttonVariants({ variant: this.variant(), size: this.size() }),
      this.customClasses(),
    ),
  );
}