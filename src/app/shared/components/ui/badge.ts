import {
  Component,
  HostBinding,
  input, 
} from '@angular/core';
import { cn } from '@utils/cn.util';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';


function badgeVariants(props: { variant?: BadgeVariant }): string {
  const variant = props.variant ?? 'default';

  const base =
    'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden';

  const variants: Record<BadgeVariant, string> = {
    default:
      'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
    secondary:
      'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
    destructive:
      'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
    outline:
      'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
  };

  return cn(base, variants[variant]);
}


@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [],
  template: `
    <span [class]="hostClasses()">
      <ng-content></ng-content>
    </span>
  `,
  styles: [':host { display: contents; }'],
})

export class BadgeComponent {
  variant = input<BadgeVariant>('default',{ alias: 'variant' });
  userClass = input<string>('', { alias: 'class' });
  hostClasses() {
    return cn(
      badgeVariants({ variant: this.variant() }), 
      this.userClass()
    )
  }
}
