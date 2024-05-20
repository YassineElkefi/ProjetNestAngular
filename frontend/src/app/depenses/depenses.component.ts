import { Component, OnInit } from '@angular/core';
import { Depense } from '../models/Depense.model';
import { DepensesService } from '../services/depenses.service';
import { Color,ColorHelper } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-depenses',
  templateUrl: './depenses.component.html',
  styleUrl: './depenses.component.css'
})
export class DepensesComponent implements OnInit{
  depenses: Depense[] = [];
  newDepense: Depense = new Depense(null,0, new Date(),"","", []);
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

  constructor(private depenseService: DepensesService) { }

  ngOnInit(): void {
    this.loadDepenses();
    const period = new Date(); // Adjust this to the desired period
    this.loadExpensesByCategory(period);
  }

  loadDepenses(){
    this.depenseService.getDepenses(this.sortBy,this.sortOrder).subscribe({
    next: (depenses: Depense[]) => {
      this.depenses = depenses;
    },
    error: (error) => {
      console.error(error);
    }
  })
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
      this.depenseService.filterDepense(this.startDate, this.endDate).subscribe(data => {
        this.depenses = data;
      });
    }
  }

  addDepense() {
    this.newDepense.tags = this.tagsInput ? this.tagsInput.split(',').map(tag => tag.trim()) : [];    this.newDepense.date = new Date();
    this.depenseService.addDepense(this.newDepense).subscribe(newDepense => {
      this.ngOnInit()
      this.newDepense = new Depense(null, 0, new Date(), "", "", []);
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
    this.depenseService.getExpensesByCategory(period).subscribe(data => {
      this.pieChartData = data.map(item => ({ name: item._id, value: item.totalAmount }));
      console.log('Pie Chart Data:', this.pieChartData);  // Log the data
    });
  }
}
