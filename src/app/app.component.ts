import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingScreen } from '@components/loading-screen/loading-screen';
import { LoadingService } from '@services/loading-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingScreen], 
  template: `
    @if(loading.isLoading()) {
      <app-loading-screen [message]="loading.message()"></app-loading-screen>
    }
    
    <router-outlet></router-outlet>
  `
})
export class App {
  protected loading = inject(LoadingService);
}