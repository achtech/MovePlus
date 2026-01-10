import  { NgModule  }  from  '@angular/core';
import  {  CommonModule  } from  '@angular/common';
import  { SeancesRoutingModule  }  from  './seances-routing.module';
import  {  SeanceListComponent  } from  './seance-list/seance-list.component';
import  { SeanceAgendaComponent  }  from  './seance-agenda/seance-agenda.component';

import  {  FormsModule, ReactiveFormsModule  }  from  '@angular/forms';
import  {  MatTableModule  } from  '@angular/material/table';
import  { MatFormFieldModule  }  from  '@angular/material/form-field';
import  {  MatInputModule  } from  '@angular/material/input';
import  { MatButtonModule  }  from  '@angular/material/button';
import  {  MatIconModule  } from  '@angular/material/icon';
import  { MatDialogModule  }  from  '@angular/material/dialog';

import  {  FullCalendarModule }  from  '@fullcalendar/angular';

@NgModule({
    declarations: [],
   imports:  [
       CommonModule,
       SeancesRoutingModule,
      FormsModule,
       ReactiveFormsModule,
       MatTableModule,
       MatFormFieldModule,
      MatInputModule,
       MatButtonModule,
       MatIconModule,
       MatDialogModule,
      FullCalendarModule,
       SeanceListComponent,
       SeanceAgendaComponent
    ]
})
export  class  SeancesModule {}
