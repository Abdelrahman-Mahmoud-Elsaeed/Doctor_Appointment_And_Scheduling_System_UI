import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { PatientNavbar } from "@components/layout/nav/patient-navbar/patient-navbar";
import { FooterComponent } from "@components/layout/footer/footer";
import { filter } from 'rxjs';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, PatientNavbar, FooterComponent],
  standalone:true,
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {
  hideHeaderFooter = false;
  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const urlPath = (event as NavigationEnd).urlAfterRedirects.split('?')[0];
        this.hideHeaderFooter = !['/login', '/register', '/doctor-login'].includes(urlPath);
      });
  }
}
