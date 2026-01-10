 import  {  Component,  OnInit }  from  '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
 
 @Component({
    selector:  'app-dashboard',
    templateUrl:  './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule]
 })
 export  class DashboardComponent  implements  OnInit  {
    stats  =  [
        {  title: 'Patients',  icon:  'people',  value:  120 },
        {  title:  'Séances  à  venir', icon:  'event',  value:  15  },
        { title:  'Paiements  en  attente',  icon: 'payment',  value:  5  },
        {  title: 'Ventes  &  Stock',  icon:  'shopping_cart', value:  30  },
        {  title:  'Charges', icon:  'account_balance',  value:  12  }
    ];
 
    constructor()  {}
 
    ngOnInit():  void  {
        //  Later: fetch  stats  from  backend
    }
 }
