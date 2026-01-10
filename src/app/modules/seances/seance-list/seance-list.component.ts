import  { Component,  OnInit  }  from '@angular/core';
import  {  SeanceService, Seance  }  from  '../seance.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
   selector:  'app-seance-list',
   templateUrl:  './seance-list.component.html',
   styleUrls:  ['./seance-list.component.scss'],
   standalone: true,
   imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule]
})
export class  SeanceListComponent  implements  OnInit {
    displayedColumns: string[]  =  ['patientId',  'therapistId', 'dateTime',  'duration',  'type',  'status', 'actions'];
    seances: Seance[]  =  [];

   constructor(private  seanceService: SeanceService)  {}

   ngOnInit():  void  {
      this.loadSeances();
    }

    loadSeances(): void  {
       this.seanceService.getSeances().subscribe(data  => this.seances  =  data);
   }

   deleteSeance(id:  number):  void {
       this.seanceService.deleteSeance(id).subscribe(()  =>  this.loadSeances());
   }
}
