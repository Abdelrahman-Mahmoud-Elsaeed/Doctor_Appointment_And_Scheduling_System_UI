import { Component } from '@angular/core';
import { PatientNavbar } from "@components/nav/patient-navbar/patient-navbar";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "@components/layout/footer/footer";

@Component({
  selector: 'app-patient-layout',
  imports: [PatientNavbar, RouterModule, FooterComponent],
  standalone:true,
  templateUrl: './patient-layout.html',
  styleUrl: './patient-layout.scss',
})
export class PatientLayout {

}
