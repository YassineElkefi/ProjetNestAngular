import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/Category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{
  categories: Category[];
  newCategory: Category = {
    _id: '',
    name: '',
    budget: 0
  };

  constructor(private categoryService: CategoryService) { }

ngOnInit(): void {
    this.fetchCategories();
}
  fetchCategories(): void {
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  addCategory(): void {
    this.categoryService.addCategory(this.newCategory).subscribe(
      response => {
        console.log('Category added successfully', response);
        this.newCategory = {_id: '', name: '', budget: 0 }; 
      },
      error => {
        console.error('Error adding category', error);
      }
    );
  }
}
