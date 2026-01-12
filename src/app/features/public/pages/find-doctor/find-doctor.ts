import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InputComponent } from '@ui/input';
import {  ButtonComponent } from '@ui/button';
import { CheckboxComponent } from '@ui/checkbox';
import { LabelComponent } from '@ui/label';
import { SliderComponent } from '@ui/slider';
import { DoctorCardComponent } from '@components/cards/doctor-card/doctor-card';
import { LucideAngularModule, Search, Filter, SlidersHorizontal} from 'lucide-angular';
import { specializations,mockDoctors } from '@assets/mockData';
import {  FormsModule } from '@angular/forms';
import { SelectComponent, SelectTriggerComponent, SelectLabelComponent, SelectItemComponent, SelectValueComponent, SelectContentComponent } from "@ui/select";


@Component({
  selector: 'app-find-doctor',
  imports: [
    DoctorCardComponent,
    InputComponent,
    CheckboxComponent,
    LabelComponent,
    SliderComponent,
    FormsModule,
    LucideAngularModule,
    CommonModule,
    ButtonComponent,
    SelectComponent,
    SelectTriggerComponent,
    SelectItemComponent,
    SelectValueComponent,
    SelectContentComponent
],
  standalone:true,
  templateUrl: './find-doctor.html',
  styleUrl: './find-doctor.scss',
})
export class FindDoctor {
  priceRange = signal<number[]>([80, 200]);
  mobileFilterOpen = signal(false);
  showSidebar = signal(false);
  readonly Search = Search;
  readonly Filter = Filter;
  readonly SlidersHorizontal = SlidersHorizontal

  specializations = specializations;
  mockDoctors = mockDoctors;

  constructor(private router: Router) {}

  sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'experience', label: 'Most Experienced' },
  ];

  selected = signal<string | null>(this.sortOptions[0].value); 

  onNavigate(page: string, doctorId?: string) {
    const route = doctorId ? [page, doctorId] : [page];
    console.log(route)
    this.router.navigate(route);
  }

  resetFilters() {
    this.priceRange.set([80, 200]);
  }

  onPriceChange(value: number | number[]) {
    this.priceRange.set(
      Array.isArray(value) ? value : [value]
    );
  }
}
