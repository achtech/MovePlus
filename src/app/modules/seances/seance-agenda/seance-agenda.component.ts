import  {  Component }  from  '@angular/core';
import {  CalendarOptions  }  from '@fullcalendar/core';
import  {  SeanceService }  from  '../seance.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { runAfterBrowserHydration } from '../../../core/utils/browser-init';

@Component({
    selector: 'app-seance-agenda',
    templateUrl: './seance-agenda.component.html',
    styleUrls: ['./seance-agenda.component.scss'],
    standalone: true,
    imports: [CommonModule, FullCalendarModule]
})
export  class SeanceAgendaComponent  {
   calendarOptions:  CalendarOptions =  {
       initialView:  'dayGridMonth',
      editable:  true,
       selectable:  true,
      events:  []
   };

   constructor(private  seanceService:  SeanceService)  {
      runAfterBrowserHydration(() => {
        this.seanceService.getSeances().subscribe(seances  => {
          this.calendarOptions.events =  seances.map(s  =>  ({
            id:  s.id?.toString(),
            title:  `${s.type} -  Patient  ${s.patientId}`,
            start: s.dateTime
          }));
        });
      });
    }
}
