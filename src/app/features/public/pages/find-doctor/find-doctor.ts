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
import {  FormsModule } from '@angular/forms';
import { SelectComponent, SelectTriggerComponent, SelectItemComponent, SelectValueComponent, SelectContentComponent } from "@ui/select";
import { DoctorFilterService } from '@core/services/doctor-filter.service';


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
    RouterModule,
],
  standalone:true,
  templateUrl: './find-doctor.html',
  styleUrl: './find-doctor.scss',
  providers:[
    DoctorFilterService
  ]
})
export class FindDoctor {
  protected store = inject(DoctorFilterService);;
  private router = inject(Router);


  mobileFilterOpen = signal(false);
  showSidebar = signal(false);
  lastValue = '';

  readonly Search = Search;
  readonly Filter = Filter;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly specializations = this.store.specializations;

  sortOptions = this.store.sortOptions

  selectedSort = signal<string | null>('rating');

  onNavigate(page: string, doctorId?: string) {
    const route = doctorId ? [page, doctorId] : [page];
    this.router.navigate(route);
  }



  onLocationInput(value: string) {
    this.lastValue = value;
  }

  onSearch(value: string) {
    this.store.updateFilter({ search: value || null });
  }

  onSearchName(value: string) {
    this.store.updateFilter({ drname: value || null });
  }


  onPriceChange(values: number[]) {
    this.store.updateFilter({ min: values[0], max: values[1] });
  }

  onSpecChecked(checked: boolean, spec: string) {
    this.store.toggleListFilter('spec', spec, checked);
  }

  onGenderChecked(checked: boolean, gender: string) {
    this.store.toggleListFilter('gender', gender, checked);
  }

  onDayChecked(checked: boolean, day: string) {
    this.store.toggleListFilter('day', day, checked);
  }

  onLocationBlur(value: string) {
    this.store.updateFilter({ location: value || null });
  }
  
  changePage(p: number) {
    this.store.changePage(p);
  }

  onSortChange(value: string | null) {
    this.selectedSort.set(value);
    this.store.updateFilter({ sort: value || null })
  }

  resetFilters() {
    this.store.updateFilter({ 
      search: null, spec: null, gender: null, 
      day: null, location: null, min: null, max: null 
    });
  }
  get minLabel() {
    return Math.floor(this.store.true_min / 50) * 50; 
  }

  get maxLabel() {
    return Math.ceil(this.store.true_max / 50) * 50;
  }
}
