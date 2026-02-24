import { Component, Input } from '@angular/core';
import { Loader2, Stethoscope ,LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'app-loading-screen',
  imports: [LucideAngularModule],
  templateUrl: './loading-screen.html',
  styleUrl: './loading-screen.scss',
})
export class LoadingScreen {
  @Input() message: string = 'Loading...';
  
  readonly StethoscopeIcon = Stethoscope;
  readonly Loader2Icon = Loader2;
}
