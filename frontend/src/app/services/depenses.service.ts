import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Depense } from '../models/Depense.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepensesService {

  baseUrl = 'http://localhost:3000/depenses';
  constructor(private http:HttpClient) { }

  getDepenses(sortBy?: string, sortOrder: string = 'asc'): Observable<Depense[]>{
    let url = this.baseUrl;
    if(sortBy){
      url += `?sortBy=${sortBy}&sortOrder=${sortOrder}`;
    }
    return this.http.get<Depense[]>(url);
}

  filterDepense(startDate, endDate): Observable<Depense[]>{
    return this.http.get<Depense[]>(`${this.baseUrl}/filter?startDate=${startDate}&endDate=${endDate}`);
  }

  getDepenseById(id:string){
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addDepense(depense: Depense, userId: string): Observable<Depense> {
    return this.http.post<Depense>(`${this.baseUrl}?userId=${userId}`, depense);
  }

  updateDepense(id:string, depense:Depense){
    return this.http.patch(`${this.baseUrl}/${id}`, depense);
  }

  deleteDepense(id: string){
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getExpensesByCategory(userId: string, period: Date): Observable<any> {
    return this.http.get(`${this.baseUrl}/by-category/${period.toISOString()}/${userId}`);
  }

}
