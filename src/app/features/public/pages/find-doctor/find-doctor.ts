import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { Doctor } from '@core/models/core-models';
import { toSignal } from '@angular/core/rxjs-interop';

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
    SelectContentComponent,
    RouterModule
],
  standalone:true,
  templateUrl: './find-doctor.html',
  styleUrl: './find-doctor.scss',
})
export class FindDoctor {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mobileFilterOpen = signal(false);
  showSidebar = signal(false);
  lastValue = '';


  searchTerm = computed(() => this.queryParams()?.get('search') ?? '');
  selectedSpecs = computed(() => this.queryParams()?.getAll('spec') ?? []);
  selectedGender = computed(() => this.queryParams()?.getAll('gender') ?? []);
  selectedDays = computed(() => this.queryParams()?.getAll('day') ?? []);
  location = computed(() => this.queryParams()?.get('location') ?? '');

  priceRange = computed(() => {
    let min = Number(this.queryParams()?.get('min'));
    let max = Number(this.queryParams()?.get('max'));
    if (min == 0) min = 0; 
    if (max == 0) max = 250; 
    return [isNaN(min) ? 0 : min, isNaN(max) ? 500 : max];
  });
  page = computed(() => {
    const p = Number(this.queryParams()?.get('page') ?? '1');
    return (isNaN(p) || p < 1) ? 1 : p;
  });

  readonly Search = Search;
  readonly Filter = Filter;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly specializations = specializations;
  readonly ITEMS_PER_PAGE = 20;

  
  private queryParams = toSignal(this.route.queryParamMap, { initialValue: null }); 
  allDoctors: Doctor[] = mockDoctors;  

filteredDoctors = computed(() => {
    let doctors = this.allDoctors;

    // A. Text Search (Name)
    const term = this.searchTerm().toLowerCase();
    if (term) {
      doctors = doctors.filter(d => d.name.toLowerCase().includes(term));
    }

    // B. Specialization (Array check)
    const specs = this.selectedSpecs();
    if (specs.length > 0) {
      doctors = doctors.filter(d => specs.includes(d.specialization));
    }

    // C. Gender (Array check) - FIXED
    const genders = this.selectedGender();
    if (genders.length > 0) {
      // Assumes your Doctor model has a 'gender' property like 'Male' | 'Female'
      doctors = doctors.filter(d => genders.includes(d.gender)); 
    }

    // D. Location (Partial match) - FIXED
    const loc = this.location().toLowerCase();
    if (loc) {
      doctors = doctors.filter(d => d.location.toLowerCase().includes(loc));
    }

    // E. Price Range - FIXED
    const [min, max] = this.priceRange();
    if (min > 0 || max < 500) { // Only filter if changed from defaults
        doctors = doctors.filter(d => d.price >= min && d.price <= max);
    }

    // F. Days (Array check)
    const days = this.selectedDays();
    if (days.length > 0) {
        doctors = doctors.filter(d => d.availability.some(day => days.includes(day)));
    }

    return doctors;
  });

  totalPages = computed(() => {
    const total = Math.ceil(this.filteredDoctors().length / this.ITEMS_PER_PAGE);
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  displayedDoctors = computed(() => {
    const startIndex = (this.page() - 1) * this.ITEMS_PER_PAGE;
    const endIndex = startIndex + this.ITEMS_PER_PAGE;
    return this.filteredDoctors().slice(startIndex, endIndex);
  });



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



  onSortChange(value: string | null) {
    this.selected.set(value);
    this.updateParams({ sort: value || null });
  }

  onSearchChange(value: string) {
    this.updateParams({ search: value || null }); 
  }

  onPriceChange(values: number[]) {
    this.updateParams({ min: values[0], max: values[1] });
  }

  toggleFilter(key: 'spec' | 'gender' | 'day', value: string, checked: boolean) {
    const currentList = this.queryParams()?.getAll(key) ?? [];
    const set = new Set(currentList);

    if (checked) set.add(value);
    else set.delete(value);

    this.updateParams({ [key]: Array.from(set) });
  }

  onLocationBlur(value: string) {
    this.updateParams({ location: value || null });
  }
  onLocationInput(value: string) {
    this.lastValue = value; 
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages().length) {
      this.updateParams({ page: newPage }, false); // False = don't reset to 1
    }
  }

  onSpecChecked(checked: boolean, spec: string) {
    this.toggleFilter('spec', spec, checked);
  }

  onGenderChecked(checked: boolean, gender: string) {
    this.toggleFilter('gender', gender, checked);
  }
  onDayChecked(checked: boolean, day: string) {
    this.toggleFilter('day', day, checked);
  }
  resetFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {} 
    });
  }

  nextPage() {
    const next = this.page() + 1;
    if (next <= this.totalPages().length) {
      this.updateParams({page:next});
    }
  }

  previousPage() {
    const prev = this.page() - 1;
    if (prev >= 1) {
      this.updateParams({page:prev});
    }
  }

  updateParams(params: Record<string, string | number | string[] | null>, resetPage = true) {
    const newParams: any = {};
    if (resetPage) {
      newParams['page'] = 1;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...params, ...newParams },
      queryParamsHandling: 'merge',
    });
  }


}
