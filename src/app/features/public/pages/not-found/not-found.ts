import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Home, Search, ArrowLeft } from 'lucide-angular';
import { ButtonComponent } from '@shared/components/ui/button';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-not-found',
  standalone:true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent, RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  // Icons
  readonly Home = Home;
  readonly Search = Search;
  readonly ArrowLeft = ArrowLeft;
  goBack() {
    window.history.back();
  }
}
