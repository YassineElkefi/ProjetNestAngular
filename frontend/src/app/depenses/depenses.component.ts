import { Component, OnInit } from '@angular/core';
import { Depense } from '../models/Depense.model';
import { DepensesService } from '../services/depenses.service';
import { Color,ColorHelper } from '@swimlane/ngx-charts';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-depenses',
  templateUrl: './depenses.component.html',
  styleUrl: './depenses.component.css'
})
export class DepensesComponent implements OnInit{
  depenses: Depense[] = [];
  newDepense: Depense = new Depense(null,0, new Date(),"","",null, []);
  tagsInput: string = '';

  sortBy: string = '';
  sortOrder: string = 'asc';

  startDate: string = '';
  endDate: string = '';

  filtersVisible: boolean = false;
  addDepenseVisible: boolean = false;

  view: [number, number] = [700, 400];
  showLegend = true;
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  gradient = false;
  colorScheme: string | Color = 'cool'; // Using a predefined color scheme
  pieChartData: any[] = [];
  userId;

  constructor(private depenseService: DepensesService,private cookieService: CookieService, private authService:AuthService) { }

  ngOnInit(): void {

    const token = this.cookieService.get('authToken');

    console.log('Token:', token);

    if (token) {
      this.userId = this.authService.getUserIdFromToken(token);
      if (this.userId) {
        console.log('User ID:', this.userId);
      } else {
        console.error('Failed to retrieve user ID from token.');
      }
    } else {
      console.error('No token found.');
    }
    this.loadDepenses();
    const period = new Date(); 
    this.loadExpensesByCategory(period);
  }

  loadDepenses(){
    this.depenseService.getDepenses(this.sortBy, this.sortOrder)
    .pipe(
      map((depenses: Depense[]) => depenses.filter(depense => depense.userId === this.userId))
    )
    .subscribe({
      next: (filteredDepenses: Depense[]) => {
        this.depenses = filteredDepenses;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  deleteDepense(id: string){
    this.depenseService.deleteDepense(id).subscribe({
      next: () => {
        this.depenses = this.depenses.filter(depense => depense._id !== id);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  sort(field: string) {    
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.loadDepenses();
  }

  onSubmit() {
    if (this.startDate && this.endDate) {
      this.depenseService.filterDepense(this.startDate, this.endDate).pipe(
        map((depenses: Depense[]) => depenses.filter(depense => depense.userId === this.userId))
      )
      .subscribe(data => {
        this.depenses = data;
      });
    }
  }

  addDepense() {
    this.newDepense.tags = this.tagsInput ? this.tagsInput.split(',').map(tag => tag.trim()) : [];
    this.newDepense.date = new Date();
    this.newDepense.userId = this.userId;
    console.log('Adding new depense:', this.newDepense);
    
    this.depenseService.addDepense(this.newDepense, this.userId).subscribe(newDepense => {
      this.ngOnInit(); // Consider reloading data after adding a new depense
      this.newDepense = new Depense(null, 0, new Date(), "", "",null, []);
      this.tagsInput = '';
    });
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }
  toggleAddDepense(){
    this.addDepenseVisible = !this.addDepenseVisible;
  }
  loadExpensesByCategory(period: Date) {
    this.depenseService.getExpensesByCategory(this.userId, period).subscribe(data => {
      this.pieChartData = data.map(item => ({ name: item._id, value: item.totalAmount }));
      console.log('Pie Chart Data:', this.pieChartData);  // Log the data
    });
  }
}
