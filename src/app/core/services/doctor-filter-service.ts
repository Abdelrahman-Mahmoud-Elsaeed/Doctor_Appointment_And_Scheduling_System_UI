import { Injectable, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { mockDoctors,specializations } from '@assets/mockData';

@Injectable()
export class DoctorFilterService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private allDoctors = mockDoctors;

  // --- State ---
  // The URL is the single source of truth
  private queryParams = toSignal(this.route.queryParamMap);

  // --- Selectors (Computed) ---
  readonly specializations = specializations;
  readonly sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'experience', label: 'Most Experienced' },
  ]
  readonly searchTerm = computed(() => this.queryParams()?.get('search') ?? '');
  readonly selectedSpecs = computed(() => this.queryParams()?.getAll('spec') ?? []);
  readonly selectedGender = computed(() => this.queryParams()?.getAll('gender') ?? []);
  readonly selectedDays = computed(() => this.queryParams()?.getAll('day') ?? []);
  readonly location = computed(() => this.queryParams()?.get('location') ?? '');

  readonly true_min = Math.min(...this.allDoctors.map(d => d.price));
  readonly true_max = Math.max(...this.allDoctors.map(d => d.price));


readonly priceRange = computed(() => {
    const params = this.queryParams();
    const minParam = params?.get('min');
    const maxParam = params?.get('max');

    let rawMin = minParam === null ? 0 : Number(minParam); 
    let rawMax = maxParam === null ? this.true_max : Number(maxParam);

    if (isNaN(rawMin)) rawMin = 0;
    if (isNaN(rawMax)) rawMax = this.true_max;

    let finalMax = Math.min(rawMax, this.true_max);
    let finalMin = Math.max(rawMin, this.true_min);
    if (finalMin > finalMax) {
        finalMin = finalMax;
    }
    return [finalMin, finalMax];
});
  readonly page = computed(() => {
    const p = Number(this.queryParams()?.get('page') ?? '1');
    return (isNaN(p) || p < 1) ? 1 : p;
  });

  // --- Business Logic ---
  readonly ITEMS_PER_PAGE = 20;

  readonly filteredDoctors = computed(() => {
    let doctors = this.allDoctors;
    const term = this.searchTerm().toLowerCase();
    const specs = this.selectedSpecs();
    const genders = this.selectedGender();
    const days = this.selectedDays();
    const loc = this.location().toLowerCase();
    const [min, max] = this.priceRange();

    // Clean Filter Logic
    if (term) doctors = doctors.filter(d => d.name.toLowerCase().includes(term));
    if (loc) doctors = doctors.filter(d => d.location.toLowerCase().includes(loc));
    if (specs.length) doctors = doctors.filter(d => specs.includes(d.specialization));
    if (genders.length) doctors = doctors.filter(d => genders.includes(d.gender));
    if (days.length) doctors = doctors.filter(d => d.availability.some(day => days.includes(day)));
    if (min > this.true_min || max < this.true_max) { 
      doctors = doctors.filter(d => d.price >= min && d.price <= max);
    }
    return doctors;
  });

  readonly displayedDoctors = computed(() => {
    const startIndex = (this.page() - 1) * this.ITEMS_PER_PAGE;
    return this.filteredDoctors().slice(startIndex, startIndex + this.ITEMS_PER_PAGE);
  });

  readonly totalPages = computed(() => {
    const total = Math.ceil(this.filteredDoctors().length / this.ITEMS_PER_PAGE);
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  // --- Actions ---
  
  updateFilter(params: Record<string, any>) {
    this.updateUrl({ ...params, page: 1 });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages().length) {
      this.updateUrl({ page });
    }
  }

  toggleListFilter(key: 'spec' | 'gender' | 'day', value: string, checked: boolean) {
    const current = new Set(this.queryParams()?.getAll(key) ?? []);
    checked ? current.add(value) : current.delete(value);
    this.updateFilter({ [key]: Array.from(current) });
  }

  private updateUrl(params: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}