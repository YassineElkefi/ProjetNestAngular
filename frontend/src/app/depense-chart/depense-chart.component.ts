import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DepensesService } from '../services/depenses.service';
import { Chart } from 'chart.js/auto';
import moment from 'moment';

@Component({
  selector: 'app-depense-chart',
  templateUrl: './depense-chart.component.html',
  styleUrl: './depense-chart.component.css'
})
export class DepenseChartComponent implements OnInit , AfterViewInit{
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  totalAmount: number = 0;
  transactionCount: number = 0;
  dailyData: any[] = [];
  chart: any;
  startDate: string;
  endDate: string;

  constructor(private transactionService: DepensesService) {}

  ngOnInit() {
    this.transactionService.getDepenses().subscribe(transactions => {
      this.transactions = transactions;
      this.dailyData = this.processTransactions(transactions);
      if (this.canvas) {
        this.createChart();
      }
    });
  }

  generateReport() {
    const start = moment(this.startDate).startOf('day');
    const end = moment(this.endDate).endOf('day');
  
    this.filteredTransactions = this.transactions.filter(transaction => {
      const transactionDate = moment(transaction.date);

      const isWithinRange = transactionDate.isBetween(start, end, null, '[]');
      return isWithinRange;
    });
  
    console.log('Filtered Transactions:', this.filteredTransactions);
  
    this.calculateReportDetails();
  }
  

  calculateReportDetails() {
    this.totalAmount = this.filteredTransactions.reduce((sum, transaction) => sum + transaction.montant, 0);
    this.transactionCount = this.filteredTransactions.length;
  }

  ngAfterViewInit() {
    if (this.canvas && this.dailyData.length > 0) {
      this.createChart();
    }
  }

  processTransactions(transactions: any[]): any[] {
    const depenses = [];
  
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date).toISOString().split('T')[0];
  
      const existingDepense = depenses.find(depense => depense.date === transactionDate);
      if (existingDepense) {
        existingDepense.montant += transaction.montant;
      } else {
        depenses.push({
          date: transactionDate,
          montant: transaction.montant
        });
      }
    });
  
    console.log('Depenses:', depenses);
  
    return depenses;
  }

  createChart() {
    const labels = this.dailyData.map(data => data.date);
    const data = this.dailyData.map(data => data.montant);
  
    console.log('Chart Labels:', labels);
    console.log('Chart Data:', data);
  
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Daily Transactions',
              data: data,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            x: {
              beginAtZero: true
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return value.toLocaleString();
                }
              }
            }
          }
        }
      });
    } else {
      console.error('Failed to get 2D context from canvas element.');
    }
  }
  
}

