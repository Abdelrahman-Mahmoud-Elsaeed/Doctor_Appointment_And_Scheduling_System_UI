// patient-navbar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Home,
  Search,
  Calendar,
  User,
  Menu,
  X,
  LucideAngularModule
} from 'lucide-angular';
import { IsActiveMatchOptions, Router, RouterModule, UrlTree } from '@angular/router';
import { ButtonComponent } from '@ui/button';
interface NavItem {
  id: string;
  label: string;
  icon: any;
  path:string;
}

@Component({
  selector: 'app-patient-navbar',
  standalone: true,
  imports: [CommonModule, ButtonComponent,LucideAngularModule,RouterModule],
  templateUrl: 'patient-navbar.html',
  styleUrls: ['patient-navbar.scss'],
})
export class PatientNavbar {
  constructor(private router: Router) {}

  mobileMenuOpen = false;
  readonly Home = Home
  readonly Search = Search
  readonly Calendar = Calendar
  readonly User = User
  readonly Menu = Menu
  readonly X = X

  navItems: NavItem[] = [
    { id: 'home', path:"/home",label: 'Home', icon: Home },
    { id: 'find-doctor' , path:"/find-doctor", label: 'Find Doctor', icon: Search },
    { id: 'appointments' , path:"/patient/appointments", label: 'My Appointments', icon: Calendar },
    { id: 'profile' , path:"/patient/profile", label: 'Profile', icon: User }
  ];

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  currentPage(url: string): boolean {
    const tree: UrlTree = this.router.createUrlTree([url]);
    const matchOptions: IsActiveMatchOptions = {
      paths: 'exact',         
      queryParams: 'ignored',  
      fragment: 'ignored',     
      matrixParams: 'ignored'  
    };
    return this.router.isActive(tree, matchOptions);
  }
}
