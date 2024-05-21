import { Component, OnInit } from '@angular/core';
import { Depense } from '../models/Depense.model';
import { DepensesService } from '../services/depenses.service';
import { Color,ColorHelper } from '@swimlane/ngx-charts';
import { Category } from '../models/Category.model';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { parse } from "papaparse";
import { unparse } from "papaparse";

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
  csvUploadVisible: boolean = false;

  view: [number, number] = [700, 400];
  showLegend = true;
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  gradient = false;
  colorScheme: string | Color = 'cool'; 
  pieChartData: any[] = [];
  categories: Category[] = [];
  selectedFile:any;
  categorySelect:""

  file: File;
  formData: FormData;

  userId;


  constructor(private depenseService: DepensesService, private categoryService: CategoryService,private cookieService: CookieService, private authService:AuthService) { }

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
    this.fetchCategories();
  }


  fetchCategories(): void {
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
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
        this.ngOnInit();
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
    this.newDepense.category = this.categorySelect;

    const category = this.categories.find(cat => cat.name === this.newDepense.category);
    if (!category) {
      console.error('Category not found');
      return;
    }

    const totalExpenses = this.depenses
      .filter(dep => dep.category === this.newDepense.category)
      .reduce((sum, dep) => sum + dep.montant, 0) + this.newDepense.montant;

    if (totalExpenses > category.budget) {
      alert(`Budget exceeded for category ${this.newDepense.category}. Total expenses: ${totalExpenses}, Budget: ${category.budget}`);
    }

      this.depenseService.addDepense(this.newDepense, this.userId).subscribe(newDepense => {
        this.newDepense = new Depense(null, 0, new Date(), '', '', null, []);
        this.tagsInput = '';
        this.ngOnInit();
      });
    
  }



  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }
  toggleAddDepense(){
    this.addDepenseVisible = !this.addDepenseVisible;
  }

  toggleCSVUpload(){
    this.csvUploadVisible = !this.csvUploadVisible;
  }

  loadExpensesByCategory(period: Date) {
    this.depenseService.getExpensesByCategory(this.userId, period).subscribe(data => {
      this.pieChartData = data.map(item => ({ name: item._id, value: item.totalAmount }));
      console.log('Pie Chart Data:', this.pieChartData); 
    });
  }

  onCSVFileSelected(event): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.selectedFile = fileList[0];
    }
  }

  onUploadButtonClicked(): void {
    if (this.selectedFile) {
      this.readCSV(this.selectedFile);
    }
  }

  readCSV(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = reader.result as string;
      const parsedData = parse(csvContent, { header: true });
      this.addUserIdToCSV(parsedData.data);
    };
    reader.readAsText(file);
  }

  addUserIdToCSV(data: any[]): void {
    const updatedData = data.map(row => ({ ...row, userId: this.userId }));
    const newCSV = unparse(updatedData);

    const blob = new Blob([newCSV], { type: 'text/csv;charset=utf-8;' });
    const newFile = new File([blob], 'updated_data.csv', { type: 'text/csv' });
    
    const formData = new FormData();
    formData.append('file', newFile, newFile.name);

    this.uploadCSV(formData);
  }

  uploadCSV(formData: FormData): void {
    this.depenseService.importCSV(formData).subscribe(() => {
      this.ngOnInit();
    });
  }
}
