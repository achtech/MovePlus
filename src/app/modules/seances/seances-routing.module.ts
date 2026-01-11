 import  {  NgModule }  from  '@angular/core';
 import {  RouterModule,  Routes  } from  '@angular/router';
 import  { SeanceListComponent  }  from  './seance-list/seance-list.component';
import  {  SeanceAgendaComponent  } from  './seance-agenda/seance-agenda.component';
import { SeanceFormComponent } from './seance-form/seance-form.component';
 
 const routes:  Routes  =  [
    {  path: '',  component:  SeanceListComponent  },
    {  path: 'agenda',  component:  SeanceAgendaComponent  },
    {  path: 'form',  component:  SeanceFormComponent  }
];
 
 @NgModule({
    imports:  [RouterModule.forChild(routes)],
    exports:  [RouterModule]
 })
export  class  SeancesRoutingModule  {}
