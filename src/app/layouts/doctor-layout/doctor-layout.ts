import { Component } from '@angular/core';
import { DoctorNavbarComponent } from "@shared/components/nav/doctor-navbar/doctor-navbar";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "@shared/components/layout/footer/footer";

@Component({
  selector: 'app-doctor-layout',
  imports: [DoctorNavbarComponent, RouterOutlet, FooterComponent],
  standalone:true,
  templateUrl: './doctor-layout.html',
  styleUrl: './doctor-layout.scss',
})
export class DoctorLayout {

}
