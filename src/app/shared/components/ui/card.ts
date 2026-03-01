import { Component, computed, input } from '@angular/core';
import { cn } from '@utils/cn.util';

// --- Card (Root) ---

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  template: `
    <div data-slot="card" [class]="hostClasses()">
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
export class CardComponent {
  userClass = input<string>('', { alias: 'class' });
  protected hostClasses = computed(() =>
    cn(
      'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border',
      this.userClass(),
    ),
  );
}


@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [],
  template: `
    <div data-slot="card-header" [class]="hostClasses()">
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
export class CardHeaderComponent {
  userClass = input<string>('', { alias: 'class' });
  protected hostClasses = computed(() =>
    cn(
      '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
      this.userClass(),
    ),
  );
}

// --- Card Title ---

@Component({
  selector: 'app-card-title',
  standalone: true,
  imports: [],
  template: `
    <h4 data-slot="card-title" [class]="hostClasses()">
      <ng-content></ng-content>
    </h4>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class CardTitleComponent {
  userClass = input<string>('', { alias: 'class' });
  protected hostClasses = computed(() =>
    cn('leading-none', this.userClass()),
  );
}

// --- Card Description ---

@Component({
  selector: 'app-card-description',
  standalone: true,
  imports: [],
  template: `
    <p data-slot="card-description" [class]="hostClasses()">
      <ng-content></ng-content>
    </p>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class CardDescriptionComponent {
  userClass = input<string>('', { alias: 'class' });
  protected hostClasses = computed(() =>
    cn('text-muted-foreground', this.userClass()),
  );
}

// --- Card Action ---

@Component({
  selector: 'app-card-action',
  standalone: true,
  imports: [],
  template: `
    <div data-slot="card-action" [class]="hostClasses()">
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
export class CardActionComponent {
  userClass = input<string>('', { alias: 'class' });
  protected hostClasses = computed(() =>
    cn(
      'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
      this.userClass(),
    ),
  );
}

// --- Card Content ---

@Component({
  selector: 'app-card-content',
  standalone: true,
  imports: [],
  template: `
    <div data-slot="card-content" [class]="hostClasses()">
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
export class CardContentComponent {
  userClass = input<string>('', { alias: 'class' });

  protected hostClasses = computed(() =>
    cn('px-6 [&:last-child]:pb-6', this.userClass()),
  );
}

// --- Card Footer ---

@Component({
  selector: 'app-card-footer',
  standalone: true,
  imports: [],
  template: `
    <div data-slot="card-footer" [class]="hostClasses()">
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
export class CardFooterComponent {
  userClass = input<string>('', { alias: 'class' });

  protected hostClasses = computed(() =>
    cn('flex items-center px-6 pb-6 [.border-t]:pt-6', this.userClass()),
  );
}