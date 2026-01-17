import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  priceRange = signal<number[]>([]);
  mobileFilterOpen = signal(false);
  showSidebar = signal(false);
  selectedSpecs = signal<string[]>([]);
  selectedGender = signal<string[]>([]);
  location = signal('');
  selectedDays = signal<string[]>([]);
  searchTerm = signal('');

  lastValue = '';
  readonly Search = Search;
  readonly Filter = Filter;
  readonly SlidersHorizontal = SlidersHorizontal

  specializations = specializations;
  mockDoctors = mockDoctors;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    const query = this.route.snapshot.queryParamMap;

    const specs = query.getAll('spec');
    if (specs.length) {
      this.selectedSpecs.set(specs);
    }
    const genders = query.getAll('gender');
    if (genders.length) {
      this.selectedSpecs.set(specs);
    }


    const min = Number(query.get('min') ?? 80);
    const max = Number(query.get('max') ?? 200);
    if (!isNaN(min) && !isNaN(max)) {
      this.priceRange.set([min, max]);
    }

    const loc = query.get('location');
    if (loc) this.location.set(loc);

    const days = query.getAll('day');
    if (days.length) this.selectedDays.set(days);
  }

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
    this.location.set('');
    this.selectedDays.set([]);
    this.selectedGender.set([])
    this.selectedSpecs.set([])
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  onSortChange(value: string | null) {
    this.selected.set(value);
    this.updateQuery({ sort: value || null });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
    this.updateQuery({ search: value || null });
  }

  onPriceChange(value: number[]) {
    this.priceRange.set(
      Array.isArray(value) ? value : [value]
    );
    this.updateQuery({
      min: value[0],
      max: value[1],
    });
  }

  onSpecChecked(checked: boolean, spec: string) {
    const current = this.selectedSpecs();

    const updated = checked
      ? [...current, spec]
      : current.filter(s => s !== spec);

    this.selectedSpecs.set(updated);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { spec: updated },
      queryParamsHandling: 'merge',
    });
  }

  onGenderChecked(checked: boolean, gender: string) {
    const current = this.selectedGender();

    const updated = checked
      ? [...current, gender]
      : current.filter(s => s !== gender);

    this.selectedGender.set(updated);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { gender: updated },
      queryParamsHandling: 'merge',
    });
  }
  onLocationInput(value: string) {
    this.lastValue = value; 
  }

  onLocationBlur(value:string) {
    this.location.set(this.lastValue);
    this.updateQuery({ location: this.lastValue || null });
  }


  onDayChecked(checked: boolean, day: string) {
    const current = this.selectedDays();

    const updated = checked
      ? [...current, day]
      : current.filter(d => d !== day);

    this.selectedDays.set(updated);
    this.updateQuery({ day: updated });
  }

  

  private updateQuery(params: Record<string, any>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
