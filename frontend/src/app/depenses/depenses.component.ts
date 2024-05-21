import { Component, OnInit } from '@angular/core';
import { Depense } from '../models/Depense.model';
import { DepensesService } from '../services/depenses.service';
import { Color,ColorHelper } from '@swimlane/ngx-charts';
import { Category } from '../models/Category.model';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-depenses',
  templateUrl: './depenses.component.html',
  styleUrl: './depenses.component.css'
})
export class DepensesComponent implements OnInit{
  depenses: Depense[] = [];
  newDepense: Depense = new Depense(null, 0, new Date(), null, '', []);
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
  colorScheme: string | Color = 'cool'; 
  pieChartData: any[] = [];
  categories: Category[] = [];

  constructor(private depenseService: DepensesService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadDepenses();
    const period = new Date();
    this.loadExpensesByCategory(period);
    this.fetchCategories();
  }


  fetchCategories(): void {
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
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
    console.log(this.newDepense);
    this.newDepense.tags = this.tagsInput ? this.tagsInput.split(',').map(tag => tag.trim()) : [];
    this.newDepense.date = new Date();
    this.depenseService.addDepense(this.newDepense).subscribe(newDepense => {
      this.ngOnInit();
      this.newDepense = new Depense(null, 0, new Date(), null, "", []);
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
      console.log('Pie Chart Data:', this.pieChartData); 
    });
  }
}
