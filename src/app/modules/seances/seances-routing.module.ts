 import  {  NgModule }  from  '@angular/core';
 import {  RouterModule,  Routes  } from  '@angular/router';
 import  { SeanceListComponent  }  from  './seance-list/seance-list.component';
import  {  SeanceAgendaComponent  } from  './seance-agenda/seance-agenda.component';
 
 const routes:  Routes  =  [
    {  path: '',  component:  SeanceListComponent  },
    {  path: 'agenda',  component:  SeanceAgendaComponent  }
];
 
 @NgModule({
    imports:  [RouterModule.forChild(routes)],
    exports:  [RouterModule]
 })
export  class  SeancesRoutingModule  {}
