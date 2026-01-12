import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IsActiveMatchOptions, Router, RouterModule, UrlTree } from '@angular/router';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  User,
  LogOut,
  X,
  Menu,
  LucideAngularModule
} from 'lucide-angular';

@Component({
  selector: 'app-doctor-navbar',
  standalone: true,
  imports: [CommonModule,LucideAngularModule,RouterModule],
  templateUrl: 'doctor-navbar.html',
  styleUrl: 'doctor-navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorNavbarComponent {
  mobileMenuOpen = signal(false);

  readonly   LayoutDashboard = LayoutDashboard
  readonly   Calendar = Calendar
  readonly   Clock = Clock
  readonly   User = User
  readonly   LogOut = LogOut
  readonly   X =   X
  readonly   Menu = Menu
  navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/doctor/dashboard' },
    { id: 'doctor-appointments', label: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { id: 'work-schedule', label: 'Work Schedule', icon: Clock, path: '/doctor/schedule' },
    { id: 'doctor-profile', label: 'Profile', icon: User, path: '/doctor/profile' },
  ];

  constructor(private router: Router) {}

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
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
